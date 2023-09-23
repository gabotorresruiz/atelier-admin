/** next line will be removed */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingButton from '@mui/lab/LoadingButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { MultiSelect } from '../../components';
import schema from './schema';
import convertToBase64 from './constants';

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

const StyledErrorMessage = styled('span')`
  color: ${({ theme }) => theme.palette.error.dark};
`;

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(3)};
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

const StyledImg = styled('img')`
  object-fit: scale-down;
  height: 100%;
  width: 100%;
`;

// const StyledButtonImg = styled(Button)`
//   width: 165px;
// `;
const StyledButtonImg = styled(Button)`
  width: auto;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const StyledTitle = styled('h1')`
  text-align: center;
  margin-bottom: 20px;
`;

const StyledStack = styled(Stack)(
  ({ theme }) => `
  gap: ${theme.spacing(2)};
`,
);

const StyledImgWrapper = styled('div')`
  width: 100%;
  height: 250px;
`;

const fakeSubCategories = [
  { value: 1, label: 'Pintura Plástica' },
  { value: 2, label: 'Pintura Esmalte' },
  { value: 3, label: 'Pintura Decorativa' },
  { value: 4, label: 'Pintura Brillante' },
];

const ProductForm = ({ title, id = 0, data = {} }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const [selectedImg, setSelectedImg] = useState(
    data.image ? `data:image/jpeg;base64,${data.image}` : '',
  );
  const [base64Img, setBase64Img] = useState(data.image ? data.image : '');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      productName: '',
      subCategories: [],
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = formData => {
    // TODO
    const body = {
      ...formData,
      image: base64Img,
    };
  };

  const closeAlert = () => {
    setAlert(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleOnchangeImg = e => {
    const uploadImg = e.currentTarget.files[0];

    // Image to base64 to send to the backend
    convertToBase64(uploadImg).then(dataImg => {
      setBase64Img(dataImg);
    });

    // Image to show in the form
    const url = URL.createObjectURL(uploadImg);
    setSelectedImg(url);
  };

  return (
    <>
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}
      <Container component='div' maxWidth='sm'>
        <StyledTitle>{title}</StyledTitle>
        <StyledBox component='form' onSubmit={onSubmit}>
          <StyledStack direction='column' alignItems='center' spacing={2}>
            <StyledButtonImg component='label' variant='contained'>
              Subir Imagen
              <input
                hidden
                accept='image/*'
                multiple
                type='file'
                onChange={handleOnchangeImg}
              />
            </StyledButtonImg>
            <StyledStack direction='row' alignItems='center' spacing={2}>
              <IconButton
                aria-label='upload picture'
                color='primary'
                component='label'
                disabled
              >
                <PhotoCamera />
              </IconButton>
              {selectedImg && (
                <StyledImgWrapper>
                  <StyledImg alt='imagen-categoria' src={selectedImg} />
                </StyledImgWrapper>
              )}
            </StyledStack>
          </StyledStack>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name='productName'
                id='productName'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Nombre Producto'
                    name='productName'
                    onChange={onChange}
                    required
                    type='text'
                    value={value}
                    variant='outlined'
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='productName'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name='subCategories'
                render={({ field }) => (
                  <MultiSelect
                    fullWidth
                    name='subCategories'
                    inputLabel='Sub Categorías'
                    label='Sub Categorías'
                    required
                    onChange={field.onChange}
                    value={Array.isArray(field.value) ? field.value : []}
                    options={fakeSubCategories}
                    variant='outlined'
                  />
                )}
              />

              <ErrorMessage
                errors={errors}
                name='subCategories'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
          </Grid>

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
              onClick={handleSubmit(onSubmit)}
              variant='contained'
              disabled={!isValid}
              loading={false}
            >
              Guardar
            </StyledButton>
          </StyledBoxWrapper>
        </StyledBox>
      </Container>
    </>
  );
};

export default ProductForm;
