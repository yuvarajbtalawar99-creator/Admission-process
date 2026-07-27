import { Request, Response, NextFunction } from 'express';
import sequelize from '../config/database';
import User from '../models/User';
import Student from '../models/Student';
import Admission from '../models/Admission';
import authService from '../services/auth.service';
import securityEvents from '../services/securityEvents.service';

const IS_PROD = process.env.NODE_ENV === 'production';

// Cookie options for the refresh token
const cookieOptions = {
  httpOnly: true,
  secure: IS_PROD, // Secure in production (HTTPS)
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

const getUserPayload = async (user: User) => {
  const student = user.role === 'STUDENT' ? await Student.findOne({ where: { userId: user.id } }) : null;
  const admission = user.role === 'STUDENT' ? await Admission.findOne({ where: { userId: user.id } }) : null;
  const system = (user.role === 'STUDENT' && (!admission || admission.applicationStatus !== 'ENROLLED') && !student)
    ? 'ADMISSION'
    : 'ERP';
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: `${user.firstName} ${user.lastName}`,
    profileImage: user.profileImage,
    mustChangePassword: user.mustChangePassword,
    system,
  };
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      securityEvents.loginFailure(req, email, 'User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check status
    if (user.status !== 'ACTIVE') {
      securityEvents.loginFailure(req, email, `Account ${user.status.toLowerCase()}`, user.id);
      return res.status(403).json({ error: 'Your account is inactive or suspended' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      securityEvents.loginFailure(req, email, 'Invalid password', user.id);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate tokens and store session via AuthService
    const { accessToken, refreshToken } = await authService.generateTokens(user);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, cookieOptions);

    // Audit Success
    securityEvents.loginSuccess(req, { id: user.id, role: user.role, email: user.email });

    return res.status(200).json({
      success: true,
      data: {
        token: accessToken,
        user: await getUserPayload(user),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const currentRefreshToken = req.cookies?.refreshToken;

    if (!currentRefreshToken) {
      return res.status(401).json({ error: 'Refresh token not found. Please log in again.' });
    }

    const sessionData = await authService.refreshSession(currentRefreshToken);

    if (!sessionData) {
      // Clear cookie if session is invalid or expired
      res.clearCookie('refreshToken');
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    }

    // Set the new rotated refresh token
    res.cookie('refreshToken', sessionData.refreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      data: {
        token: sessionData.accessToken,
        user: await getUserPayload(sessionData.user),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const authReq = req as any;
    if (authReq.user?.id) {
      // Revoke the session in Redis
      await authService.revokeSession(authReq.user.id);
      securityEvents.logout(req, authReq.user.id);
    }
    
    // Clear the httpOnly cookie
    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error during logout' });
  }
};

export const status = async (req: Request, res: Response): Promise<any> => {
  const authReq = req as any;
  if (!authReq.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const user = await User.findByPk(authReq.user.id, {
      attributes: ['id', 'email', 'role', 'firstName', 'lastName', 'profileImage', 'status', 'mustChangePassword']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'User account is inactive or suspended' });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: await getUserPayload(user),
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error check' });
  }
};

export const checkPhone = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    const existing = await User.findOne({ where: { phone } });
    return res.status(200).json({ exists: !!existing });
  } catch (error) {
    return next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'First name, last name, email, and password are required.' });
    }

    // Check email uniqueness
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Check phone uniqueness if provided
    if (phone) {
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        return res.status(409).json({ error: 'An account with this mobile number already exists.' });
      }
    }

    // Create user
    const user = await User.create({
      email,
      passwordHash: password,  // hashed by beforeSave hook
      firstName,
      lastName,
      phone: phone || null,
      role: 'STUDENT',
      status: 'ACTIVE',
    });

    // Auto-create blank admission record
    const year = new Date().getFullYear();
    const count = await Admission.count();
    const seq = String(count + 1).padStart(5, '0');
    await Admission.create({
      userId: user.id,
      applicationNumber: `APP-${year}-${seq}`,
      applicationStatus: 'DRAFT',
    });

    // Issue tokens
    const { accessToken, refreshToken } = await authService.generateTokens(user);

    const IS_PROD = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authReq = req as any;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required' });
    }

    const user = await User.findByPk(authReq.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      securityEvents.loginFailure(req, user.email, 'Invalid old password during password change', user.id);
      return res.status(401).json({ error: 'Invalid old password' });
    }

    user.passwordHash = newPassword; // Hashed by hook
    user.mustChangePassword = false;
    await user.save();

    // Revoke all other sessions for security
    await authService.revokeSession(user.id);
    
    // Generate new tokens
    const { accessToken, refreshToken } = await authService.generateTokens(user);

    const IS_PROD = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: {
        token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
          profileImage: user.profileImage,
          mustChangePassword: user.mustChangePassword,
        },
      }
    });
  } catch (error) {
    return next(error);
  }
};

