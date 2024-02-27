import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Alert } from '@mui/material';
import { useFetch } from '../../hooks';
import { LinearLoader } from '../../components';
import { BrandingForm } from '../../modules';

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(2)};
  top: ${theme.spacing(14)};
  z-index: 1;
`,
);

const Branding = () => {
  const [brandingId, setBrandingId] = useState(null);
  const [{ error, isLoading, response }] = useFetch({
    entity: 'brandings',
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

  useEffect(() => {
    if (error) return handleError();
  }, [error, handleError]);

  useEffect(() => {
    if (response && response.length > 0) setBrandingId(response[0].id);
  }, [response]);

  return (
    <Suspense fallback={<LinearLoader />}>
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}
      {!isLoading && !error ? (
        <BrandingForm
          title='Editar Marca'
          id={brandingId}
          data={response ? response[0] : {}}
        />
      ) : (
        <LinearLoader />
      )}
    </Suspense>
  );
};

export default Branding;
