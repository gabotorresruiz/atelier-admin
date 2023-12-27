import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/system';
import {
  Box,
  Paper,
  Table as MuiTable,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

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
  enableOnlyUpload = false,
  enableDelete = true,
  tableTitle = '',
}) => {
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const prevSearchQueryRef = useRef();

  useEffect(() => {
    if (hasSearched && data.length === 0) {
      setOpenDialog(true);
    }
  }, [hasSearched, data]);

  useEffect(() => {
    if (searchQuery !== '' && prevSearchQueryRef.current !== searchQuery) {
      refreshData(searchQuery);
    }
    prevSearchQueryRef.current = searchQuery;
  }, [hasSearched, refreshData, searchQuery]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    refreshData('');
    setHasSearched(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    handleResetSearch();
  };

  return (
    <StyledBox>
      <StyledPaper>
        <Toolbar
          entity={entity}
          refreshData={refreshData}
          rowSelected={selected}
          tableTitle={tableTitle}
          enableOnlyUpload={enableOnlyUpload}
          enableDelete={enableDelete}
          onSearch={setSearchQuery}
          setHasSearched={setHasSearched}
        />
        <StyledTableContainer>
          {isLoading && <StyledLoadingBackground />}
          <MuiTable aria-labelledby='table-title' size='medium'>
            <Head headColumns={headColumns} />

            <Body
              data={data}
              headColumns={headColumns}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={selected}
              setSelected={setSelected}
              onResetSearch={handleResetSearch}
            />
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>No se encontraron resultados</DialogTitle>
          <DialogContent>
            <DialogContentText>
              No se han encontrado resultados para tu búsqueda.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </StyledBox>
  );
};

export default Table;
