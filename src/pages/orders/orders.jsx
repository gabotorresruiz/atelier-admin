import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/system';
import Alert from '@mui/material/Alert';
import { useFetch } from '../../hooks';
import { LinearLoader } from '../../components';
import { CustomizedTable } from '../../modules';

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(2)};
  top: ${theme.spacing(14)};
  z-index: 1;
`,
);

const columns = [
  {
    id: 'id',
    label: '# Orden',
    type: 'text',
  },
  {
    id: 'status',
    label: 'Estatus',
    type: 'status',
  },
  {
    id: 'totalAmount',
    label: 'Monto Total',
    type: 'number',
  },
  {
    id: 'createdAt',
    label: 'Creado',
    type: 'date',
  },
];

const Orders = () => {
  const [{ error, isLoading, response }, doFetch] = useFetch({
    entity: 'orders',
    fetchMethod: 'GET',
  });

  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const refreshData = () => {
    doFetch({
      refresh: true,
    });
  };

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
      {!isLoading && response !== null && !error ? (
        <CustomizedTable
          data={response}
          disabledAdd={false}
          headColumns={columns}
          refreshData={refreshData}
          tableTitle='Órdenes'
          entity='orders'
        />
      ) : (
        <LinearLoader />
      )}
    </Suspense>
  );
};

export default Orders;
