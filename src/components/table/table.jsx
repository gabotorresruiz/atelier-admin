import React, { useMemo, useState } from 'react';
import { styled } from '@mui/system';
import {
  Box,
  Paper,
  Table as MuiTable,
  TableContainer,
  TablePagination,
} from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item =>
      headColumns.some(column =>
        String(item[column.id])
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    );
  }, [data, searchQuery, headColumns]);

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
          onSearch={setSearchQuery}
        />
        <StyledTableContainer>
          {isLoading && <StyledLoadingBackground />}
          <MuiTable aria-labelledby='table-title' size='medium'>
            <Head headColumns={headColumns} />
            {filteredData.length ? (
              <Body
                data={filteredData}
                headColumns={headColumns}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={selected}
                setSelected={setSelected}
              />
            ) : (
              <tbody style={{ height: 'calc(100% - 56px)' }}>
                <tr>
                  <td
                    colSpan={headColumns.length}
                    style={{
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      height: 'calc(100% - 56px)',
                      color: '#b5b5b5',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>
                      <SearchOffIcon
                        color='info'
                        style={{ fontSize: '50px' }}
                      />
                    </div>
                    <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                      No se encontraron resultados para {searchQuery}
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </MuiTable>
        </StyledTableContainer>
        {filteredData.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[rowsPerPage]}
            component='div'
            count={data?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </StyledPaper>
    </StyledBox>
  );
};

export default Table;
