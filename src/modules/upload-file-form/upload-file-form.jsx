import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, Box, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingButton from '@mui/lab/LoadingButton';
import Papa from 'papaparse';
import { CSVUploader } from '../../components';

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

const UploadFileForm = ({ title, entity }) => {
  const navigate = useNavigate();
  const [colorantFile, setColorantFile] = useState(null);
  const [systemColorFile, setSystemColorFile] = useState(null);

  const hasColorants = true; // TODO:  CHECK IF THE COLORANTS IS NOT NULL

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

  const uploadFile = async uploadedFile => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = async () => {
        const csvData = reader.result;
        // El parámetro { header: true } indica que la primera fila del CSV contiene los encabezados de columna.
        const parsedData = Papa.parse(csvData, { header: true }).data;
        // parsedData es un objeto que contiene los datos del CSV en formato JSON.
        try {
          // TODO
          // await axios.post('URL_DEL_BACKEND', { data: parsedData });
          console.log('parsedData', parsedData);
          console.log('Datos enviados exitosamente al backend.');
        } catch (error) {
          console.error('Error al enviar los datos al backend:', error);
        }
      };
      reader.readAsText(uploadedFile);
    }
  };

  const onSubmit = async () => {
    if (entity === 'colorants') await uploadFile(colorantFile);
    else await uploadFile(systemColorFile);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
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
          <CSVUploader
            onFileUpload={handleColorantFileUpload}
            onFileRemove={handleColorantFileRemove}
            file={colorantFile}
            disabled={false}
          />
        )}

        {entity === 'colors' && (
          <CSVUploader
            onFileUpload={handleSystemColorFileUpload}
            onFileRemove={handleSystemColorFileRemove}
            file={systemColorFile}
            disabled={!hasColorants}
          />
        )}

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
            onClick={onSubmit()}
            variant='contained'
            disabled={!systemColorFile || colorantFile}
            loading={false}
          >
            Guardar
          </StyledButton>
        </StyledBoxWrapper>
      </StyledBox>
    </Container>
  );
};

export default UploadFileForm;
