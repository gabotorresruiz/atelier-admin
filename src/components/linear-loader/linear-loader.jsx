import React from 'react';
import { styled } from '@mui/system';
import { LinearProgress, Stack } from '@mui/material';

const StyledStack = styled(Stack)`
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndex.drawer + 2};
`;

const LinearLoader = () => (
  <StyledStack spacing={2}>
    <LinearProgress />
  </StyledStack>
);

export default LinearLoader;
