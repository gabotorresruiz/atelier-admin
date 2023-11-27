import React from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const StyledCSVUploader = styled.div`
  text-align: left;
  width: 100%;
  border-radius: 5px;
  box-sizing: border-box;
`;
const UploadLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-size: 1.2rem;
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
  font-size: 1.1rem;
`;

const SelectedFileText = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #3498db;
`;

const getColor = props => {
  if (props.disabled) return '#cccccc';
  if (props.isDragAccept) return '#00e676';
  if (props.isDragReject) return '#ff1744';
  if (props.isFocused) return '#2196f3';

  return '#eeeeee';
};

const StyledDropzoneContainer = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: ${props => (props.disabled ? '#bdbdbd' : '#bdbdbd')};
  outline: none;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: border-color 0.3s;

  &:hover,
  &:focus {
    border-color: ${props => (props.disabled ? '#cccccc' : '#212121')};
  }

  width: 100%;
`;

const ButtonContainer = styled.div`
  text-align: center;
`;

const CSVUploader = ({ onFileUpload, onFileRemove, file, label, disabled }) => {
  const onDrop = acceptedFiles => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      onFileUpload(uploadedFile);
    }
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: { 'text/csv': ['.csv'] },
      disabled,
    });

  const removeFile = () => {
    onFileRemove();
  };

  return (
    <StyledCSVUploader>
      {label && <UploadLabel>{`Subir ${label}`}</UploadLabel>}
      <StyledDropzoneContainer
        {...getRootProps()}
        isFocused={isFocused}
        isDragAccept={isDragAccept}
        isDragReject={isDragReject}
        disabled={disabled}
      >
        <input {...getInputProps()} />
        <UploadText>
          Arrastra y suelta un archivo CSV aquí, o haz click para seleccionar
          desde tus archivos
        </UploadText>
      </StyledDropzoneContainer>
      {file && (
        <div>
          <SelectedFileText>Archivo seleccionado: {file.name}</SelectedFileText>
          <ButtonContainer>
            <UploadButton type='button' onClick={removeFile}>
              Quitar archivo
            </UploadButton>
          </ButtonContainer>
        </div>
      )}
    </StyledCSVUploader>
  );
};

export default CSVUploader;
