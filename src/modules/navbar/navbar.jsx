import React from 'react';
import { styled } from '@mui/system';
import { AppBar, Toolbar } from '@mui/material';
import { UserMenu } from '../../components';

const StyledAppBar = styled(AppBar)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: flex-end;
`;

const Navbar = React.memo(() => (
  <StyledAppBar position='fixed'>
    <StyledToolbar>
      <UserMenu />
    </StyledToolbar>
  </StyledAppBar>
));

export default Navbar;
