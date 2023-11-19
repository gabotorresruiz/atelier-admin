import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import {
  AddCategory,
  AddMacroCategory,
  AddProduct,
  AddSubCategory,
  Categories,
  Dashboard,
  EditCategory,
  EditMacroCategory,
  EditProduct,
  EditSubCategory,
  Login,
  MacroCategories,
  Products,
  SubCategories,
  Colors,
  AddColors,
} from './pages';

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
      <Route
        element={
          <Suspense fallback={<LinearLoader />}>
            <WithProtectedRoute />
          </Suspense>
        }
      >
        <Route element={<Layout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='macro-categories' element={<MacroCategories />} />
          <Route path='macro-categories/new' element={<AddMacroCategory />} />
          <Route
            path='macro-categories/edit/:id'
            element={<EditMacroCategory />}
          />
          <Route path='categories' element={<Categories />} />
          <Route path='categories/new' element={<AddCategory />} />
          <Route path='categories/edit/:id' element={<EditCategory />} />
          <Route path='sub-categories' element={<SubCategories />} />
          <Route path='sub-categories/new' element={<AddSubCategory />} />
          <Route path='sub-categories/edit/:id' element={<EditSubCategory />} />
          <Route path='products' element={<Products />} />
          <Route path='products/new' element={<AddProduct />} />
          <Route path='products/edit/:id' element={<EditProduct />} />
          <Route path='colors' element={<Colors />} />
          <Route path='colors/new' element={<AddColors />} />
        </Route>
      </Route>
      <Route path='*' element={<p>404 Not Found</p>} />
    </Routes>
  </BrowserRouter>
);

export default App;
