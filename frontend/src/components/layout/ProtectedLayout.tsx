import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ForcePasswordChange from '../auth/ForcePasswordChange';

export const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = user?.role || '';

  // Admin routes: only ADMIN or SUPER_ADMIN
  if (location.pathname.startsWith('/admin') && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Student routes: only STUDENT
  if (location.pathname.startsWith('/student') && role !== 'STUDENT') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Teacher routes: only TEACHER
  if (location.pathname.startsWith('/teacher') && role !== 'TEACHER') {
    return <Navigate to="/unauthorized" replace />;
  }

  // HOD routes: only HOD
  if (location.pathname.startsWith('/hod') && role !== 'HOD') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Principal routes: PRINCIPAL or SUPER_ADMIN
  if (location.pathname.startsWith('/principal') && role !== 'PRINCIPAL' && role !== 'SUPER_ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Parent routes: only PARENT
  if (location.pathname.startsWith('/parent') && role !== 'PARENT') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      {user?.mustChangePassword && <ForcePasswordChange />}
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
