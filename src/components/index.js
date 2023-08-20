import React from 'react';

export const Link = React.lazy(() => import('./link'));
export const LinearLoader = React.lazy(() => import('./linear-loader'));
export const ListItemLink = React.lazy(() => import('./list-item-link'));
export const UserMenu = React.lazy(() => import('./user-menu'));
export const MultiSelect = React.lazy(() => import('./multi-select'));
export const Select = React.lazy(() => import('./select'));
// eslint-disable-next-line import/no-cycle
export const Table = React.lazy(() => import('./table'));
