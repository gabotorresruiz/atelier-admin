import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import { Box, Divider, Drawer, List, Toolbar } from '@mui/material';
import {
  Category as CategoryIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import PaletteIcon from '@mui/icons-material/Palette';
import ColorizeIcon from '@mui/icons-material/Colorize';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
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
        <List>
          <ListItemLink
            icon={<DesignServicesIcon />}
            id='/branding'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Diseño de Marca'
            to='/branding'
          />
        </List>
        <Divider />
        <List>
          <ListItemLink
            icon={<CategoryIcon />}
            id='/macro-categories'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Macrocategorías'
            to='/macro-categories'
          />
        </List>
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
        <List>
          <ListItemLink
            icon={<CategoryIcon />}
            id='/sub-categories'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Subcategorías'
            to='/sub-categories'
          />
        </List>
        <List>
          <ListItemLink
            icon={<FormatPaintIcon />}
            id='/products'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Productos'
            to='/products'
          />
        </List>
        <List>
          <ListItemLink
            icon={<FormatColorFillIcon />}
            id='/sizes'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Capacidades'
            to='/sizes'
          />
        </List>
        <Divider />
        <List>
          <ListItemLink
            icon={<ColorizeIcon />}
            id='/colorants'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Colorantes'
            to='/colorants'
          />
        </List>
        <List>
          <ListItemLink
            icon={<PaletteIcon />}
            id='/colors'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Sist. Tintométrico'
            to='/tintometric-colors'
          />
        </List>
        <Divider />
        <List>
          <ListItemLink
            icon={<TrendingUpIcon />}
            id='/trends'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Tendencias'
            to='/trends'
          />
        </List>
        <Divider />
        <List>
          <ListItemLink
            icon={<ShoppingCartIcon />}
            id='/orders'
            onClick={handleClick}
            selectedItem={selectedItem}
            text='Órdenes'
            to='/orders'
          />
        </List>
      </StyledBox>
    </StyledDrawer>
  );
});

export default Sidebar;
