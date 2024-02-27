import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, Box, Container, Fade } from '@mui/material';
import { styled } from '@mui/system';
import { useFetch } from '../../hooks';
import { FileUploader, FormButtons } from '../../components';

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
  margin-top: 0;
`;

const StyledAlert = styled(Alert)`
  position: fixed;
  right: 25px;
`;

const UploadFileForm = ({ title, entity }) => {
  const navigate = useNavigate();
  const [colorantFile, setColorantFile] = useState(null);
  const [systemColorFile, setSystemColorFile] = useState(null);
  const [hasColorants, setHasColorants] = useState(false);

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

  const [{ error: getError, isLoading: getIsLoading, response: getResponse }] =
    useFetch({
      entity: 'colorants',
      fetchMethod: 'GET',
    });

  useEffect(() => {
    if (getError) return handleError();

    if (getResponse !== null && getResponse.length > 0) {
      setHasColorants(true);
    }
  }, [getError, getResponse, handleError]);

  const [{ error, isLoading, response }, doFetch] = useFetch({
    entity: entity === 'colorants' ? 'colorants' : 'tintometric-colors',
    fetchMethod: 'POST',
    fetchParams: {
      csv: true,
    },
  });

  const handleColorantFileUpload = file => {
    setColorantFile(file);
  };

  const handleSystemColorFileUpload = file => {
    setSystemColorFile(file);
  };

  const handleColorantFileRemove = () => {
    setColorantFile(null);
  };

  const handleSystemColorFileRemove = () => {
    setSystemColorFile(null);
  };
  const postSuccess = useCallback(fetchResponse => {
    let message = '';

    if (fetchResponse.status === 201) {
      const entityMessage = entity === 'colorants' ? 'colorantes' : 'colores';
      message = `Archivo de ${entityMessage} agregado satisfactoriamente! `;
      if (entity === 'colorants') handleColorantFileRemove();
      else handleSystemColorFileRemove();
    }

    setAlert({
      isVisible: true,
      message,
      severity: 'success',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) return handleError();

    if (response && response.status === 201) return postSuccess(response);
  }, [postSuccess, error, response, handleError]);

  const onSubmit = async () => {
    const csvToSend = entity === 'colorants' ? colorantFile : systemColorFile;
    const formData = new FormData();
    formData.append('csvFile', csvToSend);
    doFetch({
      body: formData,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box mb={5} sx={{ position: 'relative' }}>
      <FormButtons
        handleBack={handleBack}
        onSubmit={onSubmit}
        disabled={
          (entity === 'colorants' && !colorantFile) ||
          (entity === 'colors' && !hasColorants) ||
          (entity === 'colors' && !systemColorFile) ||
          getIsLoading
        }
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
        <StyledBox component='form' onSubmit={onSubmit}>
          {entity === 'colors' && (
            <Alert severity='info'>
              <AlertTitle>Info</AlertTitle>
              Debe tener colorantes agregados antes de subir colores para el
              sistema tintométrico
            </Alert>
          )}
          {entity === 'colorants' && (
            <FileUploader
              onFileUpload={handleColorantFileUpload}
              onFileRemove={handleColorantFileRemove}
              file={colorantFile}
              disabled={false}
              uploadText='Arrastra y suelta un archivo CSV aquí, o haz click para seleccionar
            desde tus archivos'
              s
            />
          )}
          {entity === 'colors' && (
            <FileUploader
              onFileUpload={handleSystemColorFileUpload}
              onFileRemove={handleSystemColorFileRemove}
              file={systemColorFile}
              disabled={!hasColorants}
              uploadText='Arrastra y suelta un archivo CSV aquí, o haz click para seleccionar
            desde tus archivos'
            />
          )}
        </StyledBox>
      </Container>
    </Box>
  );
};

export default UploadFileForm;
