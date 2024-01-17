import React from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

const StyledFileUploader = styled.div`
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

const UploadText = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
`;

const SelectedFileText = styled.p`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #7a7a7a;
`;
const SelectedFileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Espacio entre el texto y el botón */
`;

const getColor = ({ disabled, isDragAccept, isDragReject, isFocused }) => {
  if (disabled) return '#cccccc';
  if (isDragAccept) return '#00e676';
  if (isDragReject) return '#ff1744';
  if (isFocused) return '#2196f3';

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

const FileUploader = ({
  onFileUpload,
  onFileRemove,
  file,
  label,
  disabled,
  fileType = 'csv',
  uploadText,
}) => {
  const onDrop = acceptedFiles => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      onFileUpload(uploadedFile);
    }
  };

  const acceptedFileTypes = {
    csv: { 'text/csv': ['.csv'] },
    image: { 'image/*': [] },
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes[fileType],
      disabled,
    });

  const removeFile = () => {
    onFileRemove();
  };

  return (
    <StyledFileUploader>
      {label && <UploadLabel>{`Subir ${label}`}</UploadLabel>}
      <StyledDropzoneContainer
        {...getRootProps()}
        isFocused={isFocused}
        isDragAccept={isDragAccept}
        isDragReject={isDragReject}
        disabled={disabled}
      >
        <input {...getInputProps()} />
        <UploadText>{uploadText}</UploadText>
      </StyledDropzoneContainer>
      {file && (
        <SelectedFileContainer>
          <SelectedFileText>Archivo seleccionado: {file.name}</SelectedFileText>
          <Tooltip title='Quitar archivo' placement='top'>
            <DeleteIcon onClick={removeFile} />
          </Tooltip>
        </SelectedFileContainer>
      )}
    </StyledFileUploader>
  );
};

export default FileUploader;
