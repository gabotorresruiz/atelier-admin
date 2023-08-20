import React, { useState } from 'react';
import { styled } from '@mui/system';
import {
  Box,
  Paper,
  Table as MuiTable,
  TableContainer,
  TablePagination,
} from '@mui/material';
// eslint-disable-next-line import/no-cycle
import { Body, Head, Toolbar } from './elements';

const StyledBox = styled(Box)`
  width: 100%;
`;

const StyledPaper = styled(Paper)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

const StyledLoadingBackground = styled('div')`
  width: 100%;
  position: absolute;
  height: 100%;
  background-color: #ffffffd1;
  z-index: 10;
`;

const StyledTableContainer = styled(TableContainer)`
  position: relative;
`;

const Table = ({
  entity,
  headColumns,
  refreshData,
  data = [],
  isLoading = false,
  tableTitle = '',
}) => {
  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <StyledBox>
      <StyledPaper>
        <Toolbar
          entity={entity}
          refreshData={refreshData}
          rowSelected={selected}
          tableTitle={tableTitle}
        />
        <StyledTableContainer>
          {isLoading && <StyledLoadingBackground />}
          <MuiTable aria-labelledby='table-title' size='medium'>
            <Head headColumns={headColumns} />
            {Boolean(data.length) && (
              <Body
                data={data}
                headColumns={headColumns}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </MuiTable>
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage]}
          component='div'
          count={data?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>
    </StyledBox>
  );
};

export default Table;
