import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import { Box, Divider, Drawer, List, Toolbar } from '@mui/material';
import {
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { ListItemLink } from '../../components';

const StyledDrawer = styled(Drawer)`
  flex-shrink: 0;
  width: 240px;

  .MuiDrawer-paper {
    box-sizing: border-box;
    width: 240px;
    z-index: 1000;
  }
`;

const StyledBox = styled(Box)`
  overflow: auto;
`;

const Sidebar = React.memo(() => {
  const { pathname } = useLocation();
  const [selectedItem, setSelectedItem] = useState(pathname);

  const handleClick = e => {
    setSelectedItem(e.currentTarget.id);
  };

  return (
    <StyledDrawer variant='permanent'>
      <Toolbar />
      <StyledBox>
        <List>
          <ListItemLink
            icon={<DashboardIcon />}
            id='/dashboard'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Dashboard'
            to='/dashboard'
          />
        </List>
        <Divider />
        <List>
          <ListItemLink
            icon={<CategoryIcon />}
            id='/macro-categories'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Macro Categorías'
            to='/macro-categories'
          />
        </List>
        <Divider />
        <List>
          <ListItemLink
            icon={<CategoryIcon />}
            id='/categories'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Categorías'
            to='/categories'
          />
        </List>
      </StyledBox>
    </StyledDrawer>
  );
});

export default Sidebar;
