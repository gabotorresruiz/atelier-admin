/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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

const ColorantForm = ({ title, id = 0, data = {} }) => {
  const defaultColorantName = data.name ? data.name : '';
  const defualtPrice = data.price ? data.price : '';

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
    // TODO
    console.log('colorantName', colorantName);
    console.log('price', price);
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

export default ColorantForm;
