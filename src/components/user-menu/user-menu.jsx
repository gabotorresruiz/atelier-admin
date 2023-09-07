import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import {
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import { getLoggedUser, isAdmin } from '../../utils';
import userMenuConfig from './user-menu-config';

const StyledIconButton = styled(IconButton)`
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

const StyledAvatar = styled(Avatar)`
  width: 36px;
  height: 36px;
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    overflow: visible;
    filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.32));
    margin-top: ${({ theme }) => theme.spacing(1)};
    z-index: 2000;

    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: ${({ theme }) => theme.spacing(2.2)};
      width: ${({ theme }) => theme.spacing(1.5)};
      height: ${({ theme }) => theme.spacing(1.5)};
      background-color: ${({ theme }) => theme.palette.background.paper};
      transform: translateY(-50%) rotate(45deg);
    }
  }
`;

const UserMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const { user } = getLoggedUser();
  const isUserAdmin = isAdmin();
  const open = Boolean(anchorEl);

  const handleClickUser = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    return navigate('/login');
  };

  return (
    <>
      <StyledIconButton
        onClick={handleClickUser}
        size='small'
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
      >
        <StyledAvatar>{user.email.charAt(0).toUpperCase()}</StyledAvatar>
      </StyledIconButton>
      <StyledMenu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{ elevation: 0 }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {userMenuConfig(isUserAdmin).map(item => {
          const { element, href = '', icon = null, label = '' } = item;

          switch (element) {
            case 'menuItem':
              return (
                <MenuItem key={label} component={Link} to={href}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  {label}
                </MenuItem>
              );
            case 'logout':
              return (
                <MenuItem key={label} onClick={handleLogout}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  {label}
                </MenuItem>
              );
            case 'divider':
              return <Divider key='' />;
            default:
              return null;
          }
        })}
      </StyledMenu>
    </>
  );
};

export default UserMenu;
