import React from 'react';

export const WithProtectedRoute = React.lazy(() =>
  import('./with-protected-route'),
);
export const WithProtectedSuperAdminRoute = React.lazy(() =>
  import('./with-protected-super-admin-route'),
);
