/** next line will be removed */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingButton from '@mui/lab/LoadingButton';

import { Alert, Box, Button, Container, Grid, TextField } from '@mui/material';
import { useFetch } from '../../hooks';
import schema from './schema';
import { MultiSelect } from '../../components';

const StyledBoxWrapper = styled(Box)(
  ({ theme }) => `
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing(1)};
`,
);

const StyledButton = styled(LoadingButton)(
  ({ theme }) => `
  margin-left: ${theme.spacing(1)};
  margin-top: ${theme.spacing(3)};
`,
);

const StyledErrorMessage = styled('span')`
  color: ${({ theme }) => theme.palette.error.dark};
`;

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(3)};
`,
);
const StyledBox = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${theme.spacing(2)};
`,
);

const fakeMacroCategories = [
  { value: 1, label: 'Superficie' },
  { value: 2, label: 'Tipo' },
  { value: 3, label: 'Utilidad' },
  { value: 4, label: 'Interior' },
  { value: 5, label: 'Exterior' },
];

const CategoryForm = ({ title, id = 0, data = {} }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const fetchMethod = Object.keys(data).length === 0 ? 'POST' : 'PUT';

  const defaultCategoryName = Object.keys(data).length === 0 ? '' : data.name;

  const defaultMacroCategories =
    Object.keys(data).length === 0 ? [] : data.macrocategories;

  const [{ response, error, isLoading }, doFetch] = useFetch({
    entity: 'categories',
    fetchMethod,
    id,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      categoryName: defaultCategoryName,
      macroCategories: defaultMacroCategories,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = formData => {
    const body = {
      name: formData.name,
    };
    doFetch({ body });
  };

  const closeAlert = () => {
    setAlert(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleError = useCallback(() => {
    setAlert({
      isVisible: true,
      message: 'Algo salió mal... Por favor intente nuevamente',
      severity: 'error',
    });
  }, []);

  const postSuccess = useCallback(
    fetchResponse => {
      let message = '';

      if (fetchResponse.status === 201) {
        message = 'Categoría agregado satisfactoriamente!';
        reset();
      }

      if (fetchResponse.status === 204)
        message = 'Cateogría editado satisfactoriamente!';

      setAlert({
        isVisible: true,
        message,
        severity: 'success',
      });
    },
    [reset],
  );

  useEffect(() => {
    if (error) return handleError();

    if (response && (response.status === 201 || response.status === 204))
      return postSuccess(response);
  }, [postSuccess, error, response, handleError]);

  return (
    <>
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}
      <Container component='div' maxWidth='sm'>
        <h1>{title}</h1>
        <StyledBox component='form' onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name='categoryName'
                id='categoryName'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Nombre Categoría'
                    name='categoryName'
                    onChange={onChange}
                    required
                    type='text'
                    value={value}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='categoryName'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name='macroCategories'
                render={({ field }) => (
                  <MultiSelect
                    fullWidth
                    name='macroCategories'
                    inputLabel='Macro Categoría'
                    label='Macro Categoría'
                    onChange={field.onChange}
                    value={Array.isArray(field.value) ? field.value : []}
                    options={fakeMacroCategories}
                  />
                )}
              />

              <ErrorMessage
                errors={errors}
                name='macroCategories'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
          </Grid>

          <StyledBoxWrapper>
            <Button
              startIcon={<ArrowBackIosIcon />}
              onClick={handleBack}
              variant='outlined'
            >
              Volver
            </Button>
            <StyledButton
              component='label'
              onClick={handleSubmit(onSubmit)}
              variant='contained'
              disabled={!isValid}
              loading={false}
            >
              Guardar
            </StyledButton>
          </StyledBoxWrapper>
        </StyledBox>
      </Container>
    </>
  );
};

export default CategoryForm;
