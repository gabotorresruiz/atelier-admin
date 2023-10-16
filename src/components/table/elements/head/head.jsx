import React from 'react';
import { TableCell, TableHead, TableRow } from '@mui/material';

const Head = ({ headColumns = [] }) => (
  <TableHead>
    <TableRow>
      <TableCell padding='checkbox' />
      {headColumns.map(headColumn => (
        <TableCell
          key={headColumn.id || ''}
          align={
            headColumn.type === 'numeric' || headColumn.type === 'date'
              ? 'right'
              : 'left'
          }
          padding='normal'
        >
          {headColumn.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);
export default Head;
