import React, { useCallback, useEffect, useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
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

const Toolbar = ({
  entity,
  refreshData,
  rowSelected,
  tableTitle,
  onSearch,
  enableUpload = false,
  enableOnlyUpload = false,
  setHasSearched,
}) => {
  const [{ error, isLoading }, doFetch] = useFetch({
    entity,
    fetchMethod: 'DELETE',
    id: rowSelected,
  });

  const [localSearchValue, setLocalSearchValue] = useState('');

  const handleSearchChange = event => {
    setLocalSearchValue(event.target.value);
  };

  const handleSearch = () => {
    onSearch(localSearchValue);
    setHasSearched(true); // not working
  };

  useEffect(() => {}, [error, isLoading]);
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
        spacing={2}
      >
        {!rowSelected && (
          <>
            <Grid item>
              <StyledTextField
                placeholder='Buscar...'
                variant='outlined'
                size='small'
                value={localSearchValue}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {!enableOnlyUpload && (
              <Grid item>
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
              </Grid>
            )}
            {enableUpload && (
              <Grid item>
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
              </Grid>
            )}
          </>
        )}

        {rowSelected !== null && (
          <>
            <Grid item>
              <Tooltip title='Editar' placement='top'>
                <Fab
                  component={Link}
                  size='small'
                  to={`/${entity}/edit/${rowSelected}`}
                >
                  <EditIcon />
                </Fab>
              </Tooltip>
            </Grid>

            <Grid item>
              <Tooltip title='Eliminar' placement='top'>
                <Fab onClick={handleDelete} size='small' color='error'>
                  <DeleteIcon />
                </Fab>
              </Tooltip>
            </Grid>
          </>
        )}
      </Grid>
    </StyledMuiToolbar>
  );
};

export default Toolbar;
