import React from 'react';
import Box from '@mui/material/Box';
import { TextField as TextFieldMui } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

const TextField = ({ label, required, ...rest }) => (
  <Box>
    <InputLabel>
      {label}
      {required && (
        <Typography variant='inherit' component='span' style={{ color: 'red' }}>
          *
        </Typography>
      )}
    </InputLabel>
    <TextFieldMui {...rest} />
  </Box>
);

export default TextField;
