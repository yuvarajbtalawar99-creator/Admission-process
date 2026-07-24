import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import feeService from '../services/fee.service';

export const getStudentFees = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const fees = await feeService.getStudentFees(userId);
    return res.status(200).json({
      success: true,
      data: fees,
    });
  } catch (error) {
    return next(error);
  }
};

export const makeFeePayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { feeId } = req.params;
    const { amount, paymentMethod, transactionReference } = req.body;

    if (!amount || !paymentMethod || !transactionReference) {
      return res.status(400).json({ error: 'Amount, paymentMethod, and transactionReference are required.' });
    }

    const result = await feeService.payFee(
      userId,
      feeId,
      Number(amount),
      paymentMethod,
      transactionReference
    );

    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully.',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
