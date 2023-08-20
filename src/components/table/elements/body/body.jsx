import React, { useMemo } from 'react';
import { styled } from '@mui/system';
import { TableBody, TableCell, TableRow } from '@mui/material';
import Row from '../row';

const StyledEmptyRow = styled(TableRow)`
  height: ${({ emptyrows }) => `${53 * emptyrows}px`};
`;

const Body = ({
  data,
  headColumns,
  page,
  rowsPerPage,
  selected,
  setSelected,
}) => {
  const dataToShow = useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage],
  );

  const emptyRows = useMemo(
    () => (page > 0 ? rowsPerPage - dataToShow.length : 0),
    [dataToShow.length, page, rowsPerPage],
  );

  return (
    <TableBody>
      {dataToShow.map((row, index) => (
        <Row
          data={row}
          headColumns={headColumns}
          index={index}
          key={row.id}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
      {emptyRows > 0 && (
        <StyledEmptyRow emptyrows={emptyRows}>
          <TableCell colSpan={5} />
        </StyledEmptyRow>
      )}
    </TableBody>
  );
};

export default Body;
