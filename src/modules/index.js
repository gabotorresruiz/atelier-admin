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
export const UploadFileForm = React.lazy(() => import('./upload-file-form'));
export const ColorantForm = React.lazy(() => import('./colorant-form'));
export const ColorForm = React.lazy(() => import('./color-form'));
export const TrendsForm = React.lazy(() => import('./trends-form'));
export const BrandingForm = React.lazy(() => import('./branding-form'));
export const SizeForm = React.lazy(() => import('./size-form'));
export const OrderForm = React.lazy(() => import('./order-form'));
