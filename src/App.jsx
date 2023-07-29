import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { Dashboard, Login } from './pages';
import Layout from './layout';
import { LinearLoader } from './components';
import { WithProtectedRoute } from './HOC';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        element={
          <Suspense fallback={<LinearLoader />}>
            <Outlet />
          </Suspense>
        }
      >
        <Route index element={<Login />} />
        <Route path='login' element={<Navigate to='/' replace />} />
      </Route>
      <Route element={<WithProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path='dashboard' element={<Dashboard />} />
        </Route>
      </Route>
      <Route path='*' element={<p>404 Not Found</p>} />
    </Routes>
  </BrowserRouter>
);

export default App;
