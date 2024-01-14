/* eslint-disable no-nested-ternary */
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { Alert, Button } from '@mui/material';
import { useFetch } from '../../hooks';
import { LinearLoader } from '../../components';

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
  const { id } = useParams();
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

  const handleAddDesign = () => navigate('/branding/new');
  const handleEditDesign = () => navigate(`/branding/edit/${id}`);

  return (
    <Suspense fallback={<LinearLoader />}>
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}
      {!isLoading && !error ? (
        response && Object.keys(response).length > 0 ? (
          <div>
            <p>Ya tiene diseño de marca.</p>
            <Button
              variant='contained'
              color='primary'
              onClick={handleEditDesign}
            >
              Editar Diseño
            </Button>
          </div>
        ) : (
          <div>
            <p>No tiene diseño de marca agregado.</p>
            <Button
              variant='contained'
              color='primary'
              onClick={handleAddDesign}
            >
              Diseñar Marca
            </Button>
          </div>
        )
      ) : (
        <LinearLoader />
      )}
    </Suspense>
  );
};

export default Branding;
