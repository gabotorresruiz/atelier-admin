import React, { useMemo } from 'react';
import { styled } from '@mui/system';
import { TableBody, TableCell, TableRow, IconButton } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Row from '../row';

const StyledEmptyRow = styled(TableRow)`
  height: ${({ emptyrows }) => `${53 * emptyrows}px`};
`;

const StyledMessageContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Body = ({
  data,
  headColumns,
  page,
  rowsPerPage,
  selected,
  setSelected,
  onResetSearch,
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
      {dataToShow.length === 0 ? (
        <StyledEmptyRow>
          <TableCell
            colSpan={headColumns.length}
            style={{ textAlign: 'center' }}
          >
            <StyledMessageContainer>
              <SearchOffIcon color='info' style={{ fontSize: '50px' }} />
              <div>No se encontraron resultados</div>
              <IconButton onClick={onResetSearch}>Volver a la lista</IconButton>
            </StyledMessageContainer>
          </TableCell>
        </StyledEmptyRow>
      ) : (
        <>
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
        </>
      )}
    </TableBody>
  );
};

export default Body;
