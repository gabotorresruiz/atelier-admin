/** next line will be removed */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
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
import { useFetch } from '../../hooks';
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

const ProductForm = ({ title, id = 0, data = {} }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const [{ error: getError, isLoading: getIsLoading, response: getResponse }] =
    useFetch({
      entity: 'sub-categories',
      fetchMethod: 'GET',
    });

  const isEmptyData = Object.keys(data).length === 0;

  const fetchMethod = isEmptyData ? 'POST' : 'PUT';

  const [{ error, isLoading, response }, doFetch] = useFetch({
    entity: 'products',
    fetchMethod,
    id,
  });

  const defaultproductName = data.name ? data.name : '';
  const defaultSubCategories = data.subcategories ? data.subcategories : [];

  const [selectedImg, setSelectedImg] = useState(
    data.image ? `data:image/jpeg;base64,${data.image}` : '',
  );
  const [base64Img, setBase64Img] = useState(data.image ? data.image : '');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      productName: defaultproductName,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ productName, subCategories }) => {
    const selectedSubCategories = subCategories
      .map(subCategoryName => {
        const matchingOption = getResponse.find(
          option => option.name === subCategoryName,
        );
        if (matchingOption) {
          return {
            id: matchingOption.id,
            name: matchingOption.name,
          };
        }
        return null;
      })
      .filter(Boolean);
    const body = {
      name: productName,
      subcategories: selectedSubCategories,
      // image: base64Img,
    };
    doFetch({ body });
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

  const handleError = useCallback(() => {
    setAlert({
      isVisible: true,
      message: 'Algo salió mal... Por favor intente nuevamente',
      severity: 'error',
    });
  }, []);

  const postSuccess = useCallback(
    fetchResponse => {
      let message = '';

      if (fetchResponse.status === 201) {
        message = 'Producto agregado satisfactoriamente!';
        reset();
      }

      if (fetchResponse.status === 200) {
        message = 'Producto editado satisfactoriamente!';
      }

      setAlert({
        isVisible: true,
        message,
        severity: 'success',
      });
    },
    [reset],
  );

  useEffect(() => {
    if (error) return handleError();

    if (response && (response.status === 201 || response.status === 200))
      return postSuccess(response);
  }, [postSuccess, error, response, handleError]);

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
          {/* <StyledStack direction='column' alignItems='center' spacing={2}>
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
          </StyledStack> */}

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
                defaultValue={defaultSubCategories.map(
                  subCategory => subCategory.name,
                )}
                render={({ field }) => (
                  <MultiSelect
                    fullWidth
                    name='subCategories'
                    inputLabel='Sub Categorías'
                    label='Sub Categorías'
                    required
                    disabled={getIsLoading}
                    onChange={field.onChange}
                    value={Array.isArray(field.value) ? field.value : []}
                    options={
                      getResponse && !getError
                        ? getResponse.map(option => ({
                            value: option.id,
                            label: option.name,
                          }))
                        : []
                    }
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
              loading={isLoading}
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
