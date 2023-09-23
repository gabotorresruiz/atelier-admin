import React from 'react';

export const Login = React.lazy(() => import('./login'));
export const Dashboard = React.lazy(() => import('./dashboard'));
export const MacroCategories = React.lazy(() => import('./macro-categories'));
export const AddMacroCategory = React.lazy(() =>
  import('./macro-categories/add-macro-category'),
);
export const EditMacroCategory = React.lazy(() =>
  import('./macro-categories/edit-macro-category'),
);
export const Categories = React.lazy(() => import('./categories'));
export const AddCategory = React.lazy(() =>
  import('./categories/add-category'),
);
export const EditCategory = React.lazy(() =>
  import('./categories/edit-category'),
);
export const SubCategories = React.lazy(() => import('./sub-categories'));
export const AddSubCategory = React.lazy(() =>
  import('./sub-categories/add-sub-category'),
);
export const EditSubCategory = React.lazy(() =>
  import('./sub-categories/edit-sub-category'),
);
export const Products = React.lazy(() => import('./products'));
export const AddProduct = React.lazy(() => import('./products/add-product'));
export const EditProduct = React.lazy(() => import('./products/edit-product'));
export const UserSettings = React.lazy(() => import('./user-settings'));
export const InviteUser = React.lazy(() => import('./invite-user'));
