import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as LinkMui } from '@mui/material';

const Link = React.forwardRef((props, ref) => (
  <LinkMui ref={ref} component={RouterLink} {...props}>
    {props.children}
  </LinkMui>
));

export default Link;
