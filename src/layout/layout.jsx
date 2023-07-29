import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/system';

import { LinearLoader } from '../components';

const StyledMain = styled('main')`
  margin: 64px 0 0 240px;
  padding: 35px 25px;
`;

const Layout = React.memo(() => (
  <StyledMain>
    <Suspense fallback={<LinearLoader />}>
      <Outlet />
    </Suspense>
  </StyledMain>
));

export default Layout;
