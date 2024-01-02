import React, { Suspense, useState, useCallback, useEffect } from 'react';
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
const colorsColumns = [
  {
    id: 'name',
    label: 'Nombre',
    type: 'text',
  },
  {
    id: 'hex',
    label: 'Color',
    type: 'colorBox',
  },
  {
    id: 'code',
    label: 'Código',
    type: 'text',
  },
  {
    id: 'price',
    label: 'Precio',
    type: 'number',
  },
  {
    id: 'createdAt',
    label: 'Creado',
    type: 'date',
  },
];
const Colors = () => {
  const [{ error, isLoading, response }, doFetch] = useFetch({
    entity: 'tintometric-colors',
    fetchMethod: 'GET',
  });

  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const refreshData = useCallback(() => {
    doFetch({ refresh: true });
  }, [doFetch]);

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
          refreshData={refreshData}
          tableTitle='Colores'
          entity='colors'
          headColumns={colorsColumns}
          enableOnlyUpload
          enableDelete={false}
        />
      ) : (
        <LinearLoader />
      )}
    </Suspense>
  );
};

export default Colors;
