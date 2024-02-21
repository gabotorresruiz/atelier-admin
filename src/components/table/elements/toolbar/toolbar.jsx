import React, { useCallback, useEffect } from 'react';
import { styled } from '@mui/system';
import { alpha } from '@mui/material/styles';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  Grid,
  Fab,
  Toolbar as MuiToolbar,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Cached as CachedIcon,
} from '@mui/icons-material';
import { useFetch } from '../../../../hooks';
import { Link } from '../../..';

const swal = withReactContent(Swal);

const StyledMuiToolbar = styled(MuiToolbar)`
  background-color: ${({ rowselected, theme }) =>
    rowselected === 'true'
      ? alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
      : theme.palette.action.activatedOpacity};
  padding: ${({ theme }) => theme.spacing(0, 1, 0, 2)};
`;

const StyledTableTitle = styled('h1')`
  margin: 0;
`;

const StyledTypography = styled(Typography)`
  flex: 1 1 100%;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 25px;
  }

  & .MuiOutlinedInput-notchedOutline {
    border-color: rgba(0, 0, 0, 0.23);
  }

  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: rgba(0, 0, 0, 0.23);
  }

  & .MuiOutlinedInput-input {
    padding-left: 25px;
  }
`;

const StyledItemGrid = styled(Grid)`
  &.MuiGrid-item {
    padding: 0 16px 0 0;
  }
`;

const StyledRefreshFab = styled(Fab)`
  margin-right: 16px;
`;

const Toolbar = ({
  entity,
  refreshData,
  rowSelected,
  tableTitle,
  searchQuery,
  onSearch,
  disabledAdd = true,
  enableOnlyUpload = false,
  enableDelete = true,
  hasSearched,
  setHasSearched,
}) => {
  const [{ error, isLoading }, doFetch] = useFetch({
    entity,
    fetchMethod: 'DELETE',
    id: rowSelected,
  });

  const handleSearchChange = event => {
    onSearch(event.target.value);
  };

  const handleSearch = e => {
    e.preventDefault();

    refreshData(searchQuery);
    setHasSearched(true);
  };

  const refreshTable = () => {
    refreshData('');
    onSearch('');
    setHasSearched(false);
  };

  const doDelete = () => {
    doFetch({});
  };
  const handleError = useCallback(() => {
    swal.showValidationMessage(`Hubo un error al eliminar`);
  }, []);

  const handleDelete = () => {
    swal
      .fire({
        title: '¿Está seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d32f2f',
        cancelButtonColor: '#9e9e9e',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => doDelete(),
        allowOutsideClick: () => !isLoading,
      })
      .then(result => {
        if (result.isConfirmed) {
          if (!error) {
            swal.fire({
              title: '¡Eliminado exitósamente!',
              icon: 'success',
              confirmButtonColor: '#0288d1',
              showLoaderOnConfirm: true,
              preConfirm: () => refreshData(''),
              allowOutsideClick: () => !isLoading,
            });
          }
        }
      });
  };

  useEffect(() => {
    if (error) return handleError();
  }, [error, handleError]);

  return (
    <StyledMuiToolbar rowselected={Boolean(rowSelected).toString()}>
      <Grid
        alignItems='center'
        container
        direction='row'
        justifyContent='space-between'
      >
        <Grid item>
          {rowSelected !== null ? (
            <StyledTypography
              color='inherit'
              variant='subtitle1'
              component='div'
            >
              1 fila seleccionada
            </StyledTypography>
          ) : (
            <StyledTableTitle>{tableTitle}</StyledTableTitle>
          )}
        </Grid>
      </Grid>
      <Grid
        alignItems='center'
        container
        direction='row'
        justifyContent='flex-end'
      >
        {!rowSelected && (
          <>
            {hasSearched ? (
              <Tooltip title='Refrescar' placement='top'>
                <StyledRefreshFab
                  component={Button}
                  size='small'
                  onClick={refreshTable}
                >
                  <CachedIcon />
                </StyledRefreshFab>
              </Tooltip>
            ) : null}
            <StyledItemGrid item>
              <form onSubmit={e => handleSearch(e)}>
                <StyledTextField
                  placeholder={
                    entity === 'orders' ? 'Buscar por # de orden' : 'Buscar...'
                  }
                  variant='outlined'
                  size='small'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          type='submit'
                          onClick={e => handleSearch(e)}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </StyledItemGrid>
            {disabledAdd && !enableOnlyUpload && (
              <StyledItemGrid item>
                <Tooltip title='Agregar' placement='top'>
                  <Fab
                    color='primary'
                    component={Link}
                    size='small'
                    to={`/${entity}/new`}
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
              </StyledItemGrid>
            )}
            {enableOnlyUpload && (
              <StyledItemGrid item>
                <Tooltip title='Subir Archivo' placement='top'>
                  <Fab
                    color='primary'
                    component={Link}
                    size='small'
                    to={`/${entity}/upload`}
                  >
                    <FileUploadIcon />
                  </Fab>
                </Tooltip>
              </StyledItemGrid>
            )}
          </>
        )}

        {rowSelected !== null && (
          <>
            <StyledItemGrid item>
              <Tooltip title='Editar' placement='top'>
                <Fab
                  component={Link}
                  size='small'
                  to={`/${entity}/edit/${rowSelected}`}
                >
                  <EditIcon />
                </Fab>
              </Tooltip>
            </StyledItemGrid>
            {enableDelete && (
              <StyledItemGrid item>
                <Tooltip title='Eliminar' placement='top'>
                  <Fab onClick={handleDelete} size='small' color='error'>
                    <DeleteIcon />
                  </Fab>
                </Tooltip>
              </StyledItemGrid>
            )}
          </>
        )}
      </Grid>
    </StyledMuiToolbar>
  );
};

export default Toolbar;
