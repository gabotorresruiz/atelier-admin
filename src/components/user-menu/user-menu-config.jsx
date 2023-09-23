import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const userMenuConfig = [
  {
    element: 'menuItem',
    href: '/settings',
    icon: <SettingsIcon fontSize='small' />,
    label: 'Ajustes',
  },
  {
    element: 'divider',
  },
  {
    element: 'logout',
    icon: <LogoutIcon fontSize='small' />,
    label: 'Cerrar Sesión',
  },
];

export default userMenuConfig;
