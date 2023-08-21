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

export const UserSettings = React.lazy(() => import('./user-settings'));
export const InviteUser = React.lazy(() => import('./invite-user'));
