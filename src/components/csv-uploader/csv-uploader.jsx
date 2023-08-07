import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import Papa from 'papaparse';

const StyledCSVUploader = styled.div`
  text-align: center;
  margin: 2rem auto;
  max-width: 400px;
  padding: 1.5rem;
  border: 2px dashed #cccccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const UploadButton = styled.button`
  background-color: #3498db;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const UploadText = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
`;

const SelectedFileText = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #3498db;
`;

const ErrorMessage = styled.p`
  color: #d63031;
  margin-top: 1rem;
  font-size: 1.2rem;
`;

const CSVUploader = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.csv')) {
      setUploadedFile(file);
      setErrorMessage('');
    } else {
      setUploadedFile(null);
      setErrorMessage('Solo se permiten archivos CSV.');
    }
  };

  const uploadFile = async () => {
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

  return (
    <StyledCSVUploader>
      <Dropzone onDrop={onDrop} accept='.csv'>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className='dropzone'>
            <input {...getInputProps()} />
            <UploadText>
              Arrastra y suelta un archivo CSV aquí, o haz clic para seleccionar
              uno.
            </UploadText>
          </div>
        )}
      </Dropzone>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {uploadedFile && (
        <div>
          <SelectedFileText>
            Archivo seleccionado: {uploadedFile.name}
          </SelectedFileText>
          <UploadButton type='button' onClick={uploadFile}>
            Subir archivo
          </UploadButton>
        </div>
      )}
    </StyledCSVUploader>
  );
};

export default CSVUploader;
