import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { getLoggedUser } from '../../utils';
import { LoginForm } from '../../modules';
import { LinearLoader } from '../../components';

const Login = () => {
  const isLoggedUser = getLoggedUser();
  return !isLoggedUser ? (
    <Suspense fallback={<LinearLoader />}>
      <LoginForm />
    </Suspense>
  ) : (
    <Navigate to='dashboard' replace />
  );
};

export default Login;
