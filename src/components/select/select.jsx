import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect } from '@mui/material';

const Select = ({
  children,
  disabled,
  fullWidth,
  inputLabel,
  label,
  margin,
  onChange,
  required,
  value,
}) => (
  <FormControl margin={margin} fullWidth={fullWidth} disabled={disabled}>
    <InputLabel required={required}>{inputLabel}</InputLabel>
    <MuiSelect defaultValue='' value={value} label={label} onChange={onChange}>
      {children}
    </MuiSelect>
  </FormControl>
);

export default Select;
