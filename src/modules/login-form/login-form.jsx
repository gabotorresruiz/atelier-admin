/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  Avatar,
  Box,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import schema from './schema';

const StyledAlert = styled(Alert)`
  left: 0;
  position: absolute;
  right: 0;
`;

const StyledContainer = styled(Container)`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100vh;
`;

const StyledBoxWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledErrorMessage = styled('span')`
  color: ${({ theme }) => theme.palette.error.dark};
`;

const StyledAvatar = styled(Avatar)(
  ({ theme }) => `
  background-color: ${theme.palette.primary.dark};
  margin:${theme.spacing(0, 0, 1)};
`,
);

const StyledButton = styled(LoadingButton)(
  ({ theme }) => `
  margin:${theme.spacing(2, 0)};
`,
);

const LoginForm = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = body => {
    // TO DO
  };

  const logginSuccess = useCallback(
    data => {
      localStorage.setItem('loggedUser', JSON.stringify(data));
      return navigate('/dashboard');
    },
    [navigate],
  );

  const closeAlert = () => {
    setAlert(false);
  };

  return (
    <>
      {alert && (
        <StyledAlert onClose={closeAlert} severity='error'>
          Email y/o contraseña incorrectos. Por favor intente nuevamente
        </StyledAlert>
      )}
      <StyledContainer component='div' maxWidth='xs'>
        <StyledBoxWrapper>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography align='center' component='h1' variant='h5'>
            Iniciar Sesión
          </Typography>
          <Box component='form' onSubmit={onSubmit}>
            <Controller
              name='email'
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  autoComplete='email'
                  autoFocus
                  fullWidth
                  label='Email'
                  margin='normal'
                  name='email'
                  required
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name='email'
              render={({ message }) => (
                <StyledErrorMessage>{message}</StyledErrorMessage>
              )}
            />

            <Controller
              name='password'
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  autoComplete='current-password'
                  fullWidth
                  label='Contraseña'
                  margin='normal'
                  name='password'
                  type='password'
                  required
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name='password'
              render={({ message }) => (
                <StyledErrorMessage>{message}</StyledErrorMessage>
              )}
            />

            <Grid container justifyContent='flex-end'>
              <Grid item>
                <StyledButton
                  component='label'
                  disabled={!isValid}
                  onClick={handleSubmit(onSubmit)}
                  type='submit'
                  variant='contained'
                >
                  Iniciar Sesión
                </StyledButton>
              </Grid>
            </Grid>
          </Box>
        </StyledBoxWrapper>
      </StyledContainer>
    </>
  );
};

export default LoginForm;
