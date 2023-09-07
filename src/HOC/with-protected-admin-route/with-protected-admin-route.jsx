import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import jwt_decoded from 'jwt-decode';
import { getLoggedUser } from '../../utils';

const WithProtectedAdminRoute = () => {
  const location = useLocation();
  const { token } = getLoggedUser();
  // const { role } = jwt_decoded(token);
  const role = token;

  return role === 'ADMIN' ? (
    <Outlet />
  ) : (
    <Navigate to='/dashboard' state={{ from: location }} replace />
  );
};

export default WithProtectedAdminRoute;
