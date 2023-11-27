import React from 'react';

export const LoginForm = React.lazy(() => import('./login-form'));
export const MacroCategoryForm = React.lazy(
  () => import('./macro-category-form'),
);
export const CategoryForm = React.lazy(() => import('./category-form'));
export const SubCategoryForm = React.lazy(() => import('./sub-category-form'));
export const ProductForm = React.lazy(() => import('./product-form'));
export const Sidebar = React.lazy(() => import('./sidebar'));
export const Navbar = React.lazy(() => import('./navbar'));
export const CustomizedTable = React.lazy(() => import('./customized-table'));
export const ColorForm = React.lazy(() => import('./color-form'));
