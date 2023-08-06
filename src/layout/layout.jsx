import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/system';
import { LinearLoader } from '../components';
import { Sidebar, Navbar } from '../modules';

const StyledMain = styled('main')`
  margin: 64px 0 0 240px;
  padding: 35px 25px;
`;

const Layout = React.memo(() => (
  <>
    <Navbar />
    <Sidebar />
    <StyledMain>
      <Suspense fallback={<LinearLoader />}>
        <Outlet />
      </Suspense>
    </StyledMain>
  </>
));

export default Layout;
