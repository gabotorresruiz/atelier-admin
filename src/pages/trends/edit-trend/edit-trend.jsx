import React, { useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { TrendsForm } from '../../../modules';
import { useFetch } from '../../../hooks';
import { LinearLoader } from '../../../components';

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(2)};
  top: ${theme.spacing(14)};
  z-index: 1;
`,
);

const EditTrend = () => {
  const { id } = useParams();
  const [{ error, isLoading, response }] = useFetch({
    entity: 'trends', // to check endpoint
    fetchMethod: 'GET',
    id,
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

  useEffect(() => {
    if (error) return handleError();
  }, [error, handleError]);

  return (
    <>
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}
      {!isLoading && response !== null && !error ? (
        <TrendsForm title='Editar Tendencia' id={id} data={response} />
      ) : (
        <LinearLoader />
      )}
    </>
  );
};

export default EditTrend;
