import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  FormControl,
  InputLabel,
  Grid,
  MenuItem,
  Select,
  Typography,
  Fade,
} from '@mui/material';
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

const StyledSampleColor = styled('div')`
  border-radius: 5px;
  height: 35px;
  width: 35%;
`;

const StyledTitle = styled('h1')`
  text-align: center;
  margin-bottom: 20px;
  margin-top: 0;
`;

const formatter = new Intl.NumberFormat('es-UY', {
  style: 'currency',
  currency: 'UYU',
});

const paymentMethod = {
  cash: 'Efectivo',
  'credit-card': 'Tarjeta de Crédito',
};

const statusArr = [
  {
    label: 'En proceso',
    value: 'PENDING',
  },
  {
    label: 'Pagada',
    value: 'PAID',
  },
  {
    label: 'Enviada',
    value: 'DELIVERED',
  },
];

const OrderForm = ({ title, id = 0, data = {} }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const entity = 'orders';
  const fetchMethod = 'PUT';

  const [{ error, isLoading, response }, doFetch] = useFetch({
    entity,
    fetchMethod,
    id,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const onSubmit = formData => {
    doFetch({
      body: JSON.stringify({ status: formData.status }),
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

  const responseSuccess = useCallback(fetchResponse => {
    let message = '';

    if (fetchResponse.status === 200)
      message = '¡Orden editada satisfactoriamente!';

    setAlert({
      isVisible: true,
      message,
      severity: 'success',
    });
  }, []);

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
        <Divider />
        <Grid item xs={12}>
          <h2>Datos de la Orden</h2>
        </Grid>
        <StyledBox component='form' onSubmit={onSubmit}>
          <Card sx={{ padding: '25px 30px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '100px',
                  }}
                >
                  <Typography variant='heading' component='h4'>
                    # Orden
                  </Typography>
                  <Typography variant='subtitle1' component='div'>
                    {data.id}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '100px',
                  }}
                >
                  <Typography variant='heading' component='h4'>
                    Comprador
                  </Typography>
                  <Typography variant='subtitle1' component='div'>
                    {data.buyer.name} {data.buyer.lastname}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '100px',
                  }}
                >
                  <Typography variant='heading' component='h4'>
                    Email
                  </Typography>
                  <Typography variant='subtitle1' component='div'>
                    {data.buyer.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '100px',
                  }}
                >
                  <Typography variant='heading' component='h4'>
                    Método de pago
                  </Typography>
                  <Typography variant='subtitle1' component='div'>
                    {paymentMethod[data.paymentMethod]}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '100px',
                  }}
                >
                  <Typography variant='heading' component='h4'>
                    Código postal
                  </Typography>
                  <Typography variant='subtitle1' component='div'>
                    {data.buyer.zipCode}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    alignItems: 'flex-start',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '100px',
                  }}
                >
                  <Typography variant='heading' component='h4'>
                    Dirección
                  </Typography>
                  <Typography variant='subtitle1' component='div'>
                    {data.buyer.address}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h2>Estatus de la Orden</h2>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='status'
                defaultValue={data.status}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                      Estatus
                    </InputLabel>
                    <Select
                      name='status'
                      value={field.value}
                      inputLabel='Estatus'
                      label='Estatus'
                      onChange={field.onChange}
                      variant='outlined'
                    >
                      {statusArr.map(item => (
                        <MenuItem key={item.label} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <ErrorMessage
                errors={errors}
                name='status'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h2>Productos</h2>
            </Grid>
            <Grid item xs={12}>
              {data.orders_products.map(product => (
                <Card
                  sx={{
                    alignItmes: 'flex-start',
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '10px 15px',
                    gap: '15px',
                    marginBottom: '25px',
                  }}
                  key={product.id}
                >
                  <CardMedia
                    component='img'
                    sx={{ width: 130, objectFit: 'scale-down' }}
                    image={product.product.imageUrl}
                    alt=''
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '30px',
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography variant='heading' component='h3'>
                            {product.product.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: '15px' }}>
                            <Typography variant='subtitle1' component='div'>
                              Cantidad: <strong>{product.quantity}</strong>
                            </Typography>
                            {product.products_size &&
                            product.products_size.size ? (
                              <Typography variant='subtitle1' component='div'>
                                Tamaño:{' '}
                                <strong>
                                  {product.products_size.size.quantity}L
                                </strong>
                              </Typography>
                            ) : null}
                          </Box>
                          {product.product.withTintometric &&
                          product.tintometric_color ? (
                            <>
                              <Box sx={{ display: 'flex', gap: '15px' }}>
                                <Typography variant='subtitle1' component='div'>
                                  Color:{' '}
                                  <strong>
                                    {product.tintometric_color.name}
                                  </strong>
                                </Typography>
                                <Typography variant='subtitle1' component='div'>
                                  Código:{' '}
                                  <strong>
                                    {product.tintometric_color.code}
                                  </strong>
                                </Typography>
                              </Box>
                              <StyledSampleColor
                                style={{
                                  backgroundColor:
                                    product.tintometric_color.hex,
                                }}
                              />
                            </>
                          ) : null}
                        </Box>
                        <Box>
                          <Typography variant='heading' component='h3'>
                            {formatter.format(product.totalPrice)} x{' '}
                            {product.quantity}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Typography align='right' variant='heading' component='h2'>
                Total: {formatter.format(data.totalAmount)}
              </Typography>
            </Grid>
          </Grid>
        </StyledBox>
      </Container>
    </Box>
  );
};

export default OrderForm;
