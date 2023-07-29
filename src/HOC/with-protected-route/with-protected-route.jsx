import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getLoggedUser } from '../../utils';

const WithProtectedRoute = () => {
  const location = useLocation();
  const isLoggedUser = getLoggedUser();

  return isLoggedUser ? (
    <Outlet />
  ) : (
    <Navigate to='/' state={{ from: location }} replace />
  );
};

export default WithProtectedRoute;
