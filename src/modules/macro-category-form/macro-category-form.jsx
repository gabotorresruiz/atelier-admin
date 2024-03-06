import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import { Alert, Box, Container, Grid, TextField, Fade } from '@mui/material';
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

const MacroCategoryForm = ({ title, id = 0, data = {} }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const entity = 'macro-categories';

  const isEmptyData = Object.keys(data).length === 0;

  const fetchMethod = isEmptyData ? 'POST' : 'PUT';

  const [{ error, isLoading, response }, doFetch] = useFetch({
    entity,
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
      macroCategoryName: data.name ?? '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = formData => {
    doFetch({
      body: JSON.stringify({ name: formData.macroCategoryName }),
      contentType: 'application/json',
    });
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

  const responseSuccess = useCallback(
    fetchResponse => {
      let message = '';

      if (fetchResponse.status === 201) {
        message = 'Macrocategoría agregada satisfactoriamente!';
        reset();
      }

      if (fetchResponse.status === 200) {
        message = '¡Macrocategoría editado satisfactoriamente!';
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
                name='macroCategoryName'
                id='macroCategoryName'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Nombre'
                    name='macroCategoryName'
                    onChange={onChange}
                    required
                    type='text'
                    value={value}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='macroCategoryName'
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

export default MacroCategoryForm;
