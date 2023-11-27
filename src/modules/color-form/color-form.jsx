import React, { useState } from 'react';
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

const ColorForm = () => {
  const [colorantFile, setColorantFile] = useState(null);
  const [systemColorFile, setSystemColorFile] = useState(null);

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
    await uploadFile(colorantFile);
    await uploadFile(systemColorFile);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container component='div' maxWidth='sm'>
      <StyledTitle>Agregar Colores</StyledTitle>

      <StyledBox component='form' onSubmit={onSubmit}>
        <Alert severity='info'>
          <AlertTitle>Info</AlertTitle>
          Se debe subir primero los colorantes y luego los colores del sistema
          tintométrico
        </Alert>

        <CSVUploader
          onFileUpload={handleColorantFileUpload}
          onFileRemove={handleColorantFileRemove}
          file={colorantFile}
          label='Colorantes'
          disabled={false}
        />

        <CSVUploader
          onFileUpload={handleSystemColorFileUpload}
          onFileRemove={handleSystemColorFileRemove}
          file={systemColorFile}
          label='Colores del Sistema Tintométrico'
          disabled={!colorantFile}
        />

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
            disabled={!colorantFile || !systemColorFile}
            loading={false}
          >
            Guardar
          </StyledButton>
        </StyledBoxWrapper>
      </StyledBox>
    </Container>
  );
};

export default ColorForm;
