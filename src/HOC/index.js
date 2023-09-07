import React from 'react';

export const WithProtectedRoute = React.lazy(() =>
  import('./with-protected-route'),
);
export const WithProtectedAdminRoute = React.lazy(() =>
  import('./with-protected-admin-route'),
);
