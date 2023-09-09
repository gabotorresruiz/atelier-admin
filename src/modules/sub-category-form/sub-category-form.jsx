/** next line will be removed */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingButton from '@mui/lab/LoadingButton';

import { Alert, Box, Button, Container, Grid, TextField } from '@mui/material';
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

  p {
    color: #c62828;
  }
`,
);

const fakeCategories = [
  { value: 1, label: 'Pintura Plástica' },
  { value: 2, label: 'Pintura Esmalte' },
  { value: 3, label: 'Pintura Decorativa' },
  { value: 4, label: 'Pintura Brillante' },
];
const fakeProducts = [
  { value: 1, label: 'Pintura Blanca Pintelux' },
  { value: 2, label: 'Pintura Rosa Inca' },
  { value: 3, label: 'Pincel' },
  { value: 4, label: 'Incalux Diamente 3 en 1' },
  { value: 5, label: 'Incamate' },
  { value: 6, label: 'Incalex Toque Sublime Sesign Mate' },
  { value: 7, label: 'Incasol' },
  { value: 8, label: 'Enduido Incaplast' },
  { value: 9, label: 'Fijador - Sellador Al Agua' },
];

const SubCategoryForm = ({ title, id = 0, data = {} }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      subCategoryName: '',
      categories: [],
      products: [],
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = formData => {
    // TODO
  };

  const closeAlert = () => {
    setAlert(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

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
          <p>* Indica que el campo es obligatorio</p>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name='subCategoryName'
                id='subCategoryName'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Nombre Sub Categoría'
                    name='subCategoryName'
                    onChange={onChange}
                    required
                    type='text'
                    value={value}
                    variant='outlined'
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='subCategoryName'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name='categories'
                render={({ field }) => (
                  <MultiSelect
                    fullWidth
                    name='categories'
                    inputLabel='Categorías'
                    label='Categorías'
                    required
                    onChange={field.onChange}
                    value={Array.isArray(field.value) ? field.value : []}
                    options={fakeCategories}
                    variant='outlined'
                  />
                )}
              />

              <ErrorMessage
                errors={errors}
                name='categories'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='products'
                render={({ field }) => (
                  <MultiSelect
                    fullWidth
                    name='products'
                    inputLabel='Productos'
                    label='Productos'
                    onChange={field.onChange}
                    value={Array.isArray(field.value) ? field.value : []}
                    options={fakeProducts}
                  />
                )}
              />

              <ErrorMessage
                errors={errors}
                name='products'
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

export default SubCategoryForm;
