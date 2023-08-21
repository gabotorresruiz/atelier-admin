import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { Dashboard, Login, MacroCategories, UserSettings } from './pages';
import Layout from './layout';
import { LinearLoader } from './components';
import { WithProtectedRoute } from './HOC';
import AddMacroCategory from './pages/macro-categories/add-macro-category/add-macro-category';
import EditMacroCategory from './pages/macro-categories/edit-macro-category/edit-macro-category';

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
          <Route path='macro-categories' element={<MacroCategories />} />
          <Route path='macro-category/new' element={<AddMacroCategory />} />
          <Route
            path='macro-category/edit/:id'
            element={<EditMacroCategory />}
          />
          <Route path='settings' element={<UserSettings />} />
        </Route>
        {/* <Route element={<WithProtectedSuperAdminRoute />}>
          <Route path='invite-user' element={<InviteUser />} />
        </Route> */}
      </Route>
      <Route path='*' element={<p>404 Not Found</p>} />
    </Routes>
  </BrowserRouter>
);

export default App;
