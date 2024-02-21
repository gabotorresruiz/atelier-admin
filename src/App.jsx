import React, { Suspense } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import {
  AddBranding,
  AddCategory,
  AddColor,
  AddMacroCategory,
  AddProduct,
  AddSize,
  AddSubCategory,
  AddTrend,
  Branding,
  Categories,
  Colorants,
  Colors,
  Dashboard,
  EditBranding,
  EditCategory,
  EditColor,
  EditColorant,
  EditMacroCategory,
  EditProduct,
  EditSize,
  EditSubCategory,
  EditTrend,
  Login,
  MacroCategories,
  Orders,
  EditOrder,
  Products,
  Sizes,
  SubCategories,
  Trends,
  UploadColorant,
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
          <Route path='tintometric-colors' element={<Colors />} />
          <Route path='tintometric-colors/edit/:id' element={<EditColor />} />
          <Route path='tintometric-colors/upload' element={<AddColor />} />
          <Route path='colorants' element={<Colorants />} />
          <Route path='colorants/edit/:id' element={<EditColorant />} />
          <Route path='colorants/upload' element={<UploadColorant />} />
          <Route path='trends' element={<Trends />} />
          <Route path='trends/new' element={<AddTrend />} />
          <Route path='trends/edit/:id' element={<EditTrend />} />
          <Route path='branding' element={<Branding />} />
          <Route path='branding/new' element={<AddBranding />} />
          <Route path='branding/edit/:id' element={<EditBranding />} />
          <Route path='sizes' element={<Sizes />} />
          <Route path='sizes/new' element={<AddSize />} />
          <Route path='sizes/edit/:id' element={<EditSize />} />
          <Route path='orders' element={<Orders />} />
          <Route path='orders/edit/:id' element={<EditOrder />} />
        </Route>
      </Route>
      <Route path='*' element={<p>404 Not Found</p>} />
    </Routes>
  </BrowserRouter>
);

export default App;
