/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import { Alert, Box, Container, Fade, Grid, TextField } from '@mui/material';
import { FormButtons } from '../../components';
import { useFetch } from '../../hooks';
import schema from './schema';

const StyledErrorMessage = styled('span')`
  color: ${({ theme }) => theme.palette.error.dark};
`;

const StyledAlert = styled(Alert)`
  position: fixed;
  right: 25px;
`;

const StyledBox = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${theme.spacing(2)};
`,
);

const StyledTitle = styled('h1')`
  text-align: center;
  margin-bottom: 20px;
  margin-top: 0;
`;

const ColorantForm = ({ title, id = 0, data = {} }) => {
  const defaultColorantName = data.name ? data.name : '';
  const defualtPrice = data.price ? data.price : '';

  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const isEmptyData = Object.keys(data).length === 0;
  const fetchMethod = isEmptyData ? 'POST' : 'PUT';

  const [{ error, isLoading, response }, doFetch] = useFetch({
    entity: 'colorants',
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
      colorantName: defaultColorantName,
      price: defualtPrice,
    },
    resolver: yupResolver(schema),
  });
  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = ({ colorantName, price }) => {
    doFetch({
      body: JSON.stringify({ name: colorantName, price }),
      contentType: 'application/json',
    });
  };

  const handleError = useCallback(() => {
    setAlert({
      isVisible: true,
      message: 'Algo salió mal... Por favor intente nuevamente',
      severity: 'error',
    });
  }, []);

  const responseSuccess = useCallback(
    fetchResponse => {
      let message = '';

      if (fetchResponse.status === 201) {
        message = 'Colorante agregado satisfactoriamente!';
        reset();
      }

      if (fetchResponse.status === 200) {
        message = 'Colorante editado satisfactoriamente!';
      }

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
    if (response && (response.status === 201 || response.status === 200))
      return responseSuccess(response);
  }, [responseSuccess, error, handleError, response]);

  const closeAlert = () => {
    setAlert(false);
  };

  return (
    <Box mb={5} sx={{ position: 'relative' }}>
      <FormButtons
        handleBack={handleBack}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        disabled={!isValid}
        isLoading={isLoading}
      />
      {alert.isVisible && (
        <Fade
          in={alert.isVisible}
          addEndListener={() => {
            setTimeout(() => {
              setAlert(false);
            }, 5000);
          }}
        >
          <StyledAlert onClose={closeAlert} severity={alert.severity}>
            {alert.message}
          </StyledAlert>
        </Fade>
      )}
      <Container component='div' maxWidth='sm'>
        <StyledTitle>{title}</StyledTitle>
        <StyledBox component='form' onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name='colorantName'
                id='colorantName'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Nombre Colorante'
                    name='colorantName'
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
                name='colorantName'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='price'
                id='price'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Precio Colorante'
                    name='price'
                    onChange={onChange}
                    required
                    type='number'
                    value={value}
                    variant='outlined'
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='price'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
          </Grid>
        </StyledBox>
      </Container>
    </Box>
  );
};

export default ColorantForm;
