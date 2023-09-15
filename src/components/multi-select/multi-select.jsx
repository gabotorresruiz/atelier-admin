import React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';

const MultiSelect = ({
  disabled,
  fullWidth,
  inputLabel,
  label,
  margin,
  onChange,
  value,
  options,
  required,
}) => (
  <div>
    <FormControl
      margin={margin}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
    >
      <InputLabel id='multiple-chip-label' required={required}>
        {inputLabel}
      </InputLabel>
      <Select
        labelId='multiple-chip-label'
        id='multiple-chip'
        multiple
        value={value}
        onChange={onChange}
        label={label}
        required={required}
        input={<OutlinedInput id='select-multiple-chip' label={label} />}
        renderValue={selected => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map(s => (
              <Chip key={s} label={s} />
            ))}
          </Box>
        )}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
);

export default MultiSelect;
