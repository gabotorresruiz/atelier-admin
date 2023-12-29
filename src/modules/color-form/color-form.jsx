/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  TextField,
} from '@mui/material';
import { useFetch } from '../../hooks';
import schema from './schema';

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

const StyledTitle = styled('h1')`
  text-align: center;
  margin-bottom: 20px;
`;

const disabledStyle = {
  backgroundColor: '#f0f0f0',
};

const ColorForm = ({ title, id = 0, data = {} }) => {
  const [showColorants, setShowColorants] = useState(false);
  const defaultName = data.name ? data.name : '';
  const defualtPrice = data.price ? data.price : '';
  const defaultCode = data.code ? data.code : '';
  const defaultFamilyColor = data.familyColor ? data.familyColor : '';
  const colorantKeys = Object.keys(data).filter(key =>
    key.startsWith('colorant'),
  );

  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const isEmptyData = Object.keys(data).length === 0;

  const fetchMethod = isEmptyData ? 'POST' : 'PUT';

  const [{ error, isLoading, response }, doFetch] = useFetch({
    entity: 'tintometric-colors',
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
      name: defaultName,
      price: defualtPrice,
      code: defaultCode,
      familyColor: defaultFamilyColor,
    },
    resolver: yupResolver(schema),
  });
  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = ({ name, price }) => {
    doFetch({
      body: JSON.stringify({ name, price }),
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
  const toggleColorants = () => {
    setShowColorants(prev => !prev);
  };

  return (
    <>
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
                name='name'
                id='name'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Nombre Color'
                    name='name'
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
                name='name'
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
                    label='Precio Color'
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
            <Grid item xs={12}>
              <Controller
                name='code'
                id='code'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      style: disabledStyle,
                    }}
                    label='Código Color'
                    name='code'
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
                name='code'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='familyColor'
                id='familyColor'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      style: disabledStyle,
                    }}
                    label='Familia Color'
                    name='familyColor'
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
                name='familyColor'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                style={{
                  backgroundColor: data.hex,
                  height: '50px',
                  width: '100%',
                }}
              />
            </Grid>
          </Grid>
          <Button variant='outlined' onClick={toggleColorants}>
            {showColorants ? 'Ocultar Colorantes' : 'Ver Colorantes'}
          </Button>

          {showColorants &&
            colorantKeys.map((key, index) => (
              <Grid item xs={12} key={key}>
                <TextField
                  fullWidth
                  label={key}
                  value={data[key]}
                  InputProps={{
                    readOnly: true,
                    style: disabledStyle,
                  }}
                  variant='outlined'
                />
              </Grid>
            ))}

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
              loading={isLoading}
            >
              Guardar
            </StyledButton>
          </StyledBoxWrapper>
        </StyledBox>
      </Container>
    </>
  );
};

export default ColorForm;
