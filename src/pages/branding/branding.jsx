/* eslint-disable no-nested-ternary */
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Alert, Button, Box, Typography } from '@mui/material';
import { useFetch } from '../../hooks';
import { LinearLoader } from '../../components';
import { BrandingForm } from '../../modules';

const CenteredBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '80vh',
});

const MessageText = styled(Typography)({
  fontSize: '1.5rem',
  marginBottom: '20px',
});

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(2)};
  top: ${theme.spacing(14)};
  z-index: 1;
`,
);

const Branding = () => {
  const navigate = useNavigate();
  const [id, setId] = useState(null);
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
    if (response && response.length > 0) {
      setId(response[0].id);
    }
  }, [response]);

  const handleAddDesign = () => navigate('/branding/new');

  return (
    <Suspense fallback={<LinearLoader />}>
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}
      {!isLoading && !error ? (
        response && Object.keys(response).length > 0 ? (
          <BrandingForm title='Editar Marca' id={id} data={response[0]} />
        ) : (
          <CenteredBox>
            <MessageText>No tiene diseño de marca agregado.</MessageText>
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddDesign}
              size='large'
            >
              Crear Marca
            </Button>
          </CenteredBox>
        )
      ) : (
        <LinearLoader />
      )}
    </Suspense>
  );
};

export default Branding;
