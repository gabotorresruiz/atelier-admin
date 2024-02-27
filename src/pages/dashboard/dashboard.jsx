import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Box, styled } from '@mui/system';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { Alert, Card, CardContent, Grid, Typography } from '@mui/material';
import { useFetch } from '../../hooks';
import { getLoggedUser } from '../../utils';
import { LinearLoader } from '../../components';

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(2)};
  top: ${theme.spacing(14)};
  z-index: 1;
`,
);

const formatter = new Intl.NumberFormat('es-UY', {
  style: 'currency',
  currency: 'UYU',
}).format;

const statusNaming = {
  PENDING: 'En proceso',
  PAID: 'Pagada',
  DELIVERED: 'Enviada',
};

const monthLabels = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const Dashboard = () => {
  const { user } = getLoggedUser();
  const [{ error, isLoading, response }] = useFetch({
    entity: 'metrics',
    fetchMethod: 'GET',
  });

  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const closeAlert = () => {
    setAlert(false);
  };

  const handleError = useCallback(() => {
    setAlert({
      isVisible: true,
      message: 'Algo salió mal... Por favor intente nuevamente',
      severity: 'error',
    });
  }, []);

  const getSalesByMonth = useCallback(
    (value, property) => {
      const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      if (response && !isLoading) {
        response[value].forEach(item => {
          data[parseInt(item.month, 10) - 1] =
            property === 'orderCount'
              ? parseInt(item[property], 10)
              : item[property];
        });
      }

      return data;
    },
    [isLoading, response],
  );

  useEffect(() => {
    if (error) return handleError();
  }, [error, handleError]);

  return (
    <Suspense fallback={<LinearLoader />}>
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}
      {response && !isLoading ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: '700' }} mb={2} variant='h3'>
              ¡Bienvenido, {user.name} {user.lastName}!
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Card variant='outlined'>
              <CardContent>
                <Typography mb={3} variant='h6'>
                  Cantidad ventas totales
                </Typography>
                <Box display='flex' alignItems='center' justifyContent='center'>
                  <Typography sx={{ fontWeight: '700' }} variant='h4'>
                    {response.countOrders}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card variant='outlined'>
              <CardContent>
                <Typography mb={3} variant='h6'>
                  Ventas totales
                </Typography>
                <Box display='flex' alignItems='center' justifyContent='center'>
                  <Typography sx={{ fontWeight: '700' }} variant='h4'>
                    {formatter(response.totalSales)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card variant='outlined'>
              <CardContent>
                <Typography mb={3} variant='h6'>
                  Cantidad ventas del año
                </Typography>
                <Box display='flex' alignItems='center' justifyContent='center'>
                  <Typography sx={{ fontWeight: '700' }} variant='h4'>
                    {response.countOrdersYear}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card variant='outlined'>
              <CardContent>
                <Typography mb={3} variant='h6'>
                  Cantidad ventas del mes
                </Typography>
                <Box display='flex' alignItems='center' justifyContent='center'>
                  <Typography sx={{ fontWeight: '700' }} variant='h4'>
                    {response.countOrdersMonth}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Card variant='outlined'>
              <CardContent>
                <Typography sx={{ fontWeight: '600' }} variant='subtitle1'>
                  Cantidad de ventas mensuales
                </Typography>
                <Box display='flex' alignItems='center'>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: 'band',
                        data: monthLabels,
                      },
                    ]}
                    series={[
                      { data: getSalesByMonth('monthlyOrders', 'orderCount') },
                    ]}
                    height={250}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card variant='outlined'>
              <CardContent>
                <Typography
                  mb={2}
                  sx={{ fontWeight: '600' }}
                  variant='subtitle1'
                >
                  Estatus de las órdenes
                </Typography>
                <Box display='flex' alignItems='center'>
                  <PieChart
                    series={[
                      {
                        data: response.ordersByStatus.map((item, idx) => ({
                          id: idx,
                          value: parseInt(item.orderCount, 10),
                          label: statusNaming[item.status],
                        })),
                      },
                    ]}
                    height={234}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card variant='outlined'>
              <CardContent>
                <Typography sx={{ fontWeight: '600' }} variant='subtitle1'>
                  Ventas por mes
                </Typography>
                <LineChart
                  xAxis={[{ scaleType: 'point', data: monthLabels }]}
                  series={[
                    {
                      data: getSalesByMonth('salesByMonth', 'totalSales'),
                      valueFormatter: formatter,
                    },
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <LinearLoader />
      )}
    </Suspense>
  );
};

export default Dashboard;
