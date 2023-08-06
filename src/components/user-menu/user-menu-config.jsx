import React from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const userMenuConfig = isSuperAdmin =>
  isSuperAdmin
    ? [
        {
          element: 'menuItem',
          href: '/invite-user',
          icon: <PersonAddIcon fontSize='small' />,
          label: 'Agregar otro usuario',
        },
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
      ]
    : [
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
