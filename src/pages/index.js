import React from 'react';

export const Login = React.lazy(() => import('./login'));
export const Dashboard = React.lazy(() => import('./dashboard'));
export const MacroCategories = React.lazy(() => import('./macro-categories'));
export const SubCategories = React.lazy(() => import('./sub-categories'));
export const Categories = React.lazy(() => import('./categories'));
export const UserSettings = React.lazy(() => import('./user-settings'));
export const InviteUser = React.lazy(() => import('./invite-user'));
