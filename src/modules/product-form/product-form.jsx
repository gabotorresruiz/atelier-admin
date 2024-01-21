/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { LinearLoader, MultiSelect } from '../../components';
import { useFetch } from '../../hooks';
import schema from './schema';

const getColor = props => {
  if (props.isDragAccept) return '#00e676';
  if (props.isDragReject) return '#ff1744';
  if (props.isFocused) return '#2196f3';

  return '#eeeeee';
};

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

const StyledImageWrapper = styled('div')`
  height: 300px;
  width: 100%;
  margin-bottom: 25px;
`;

const StyledImg = styled('img')`
  object-fit: scale-down;
  height: 100%;
  width: 100%;
`;

const StyledTitle = styled('h1')`
  text-align: center;
  margin-bottom: 20px;
`;

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
  color: #bdbdbd;
  outline: none;
  cursor: pointer;

  &:hover {
    border-color: #212121;
  }
`;

const ProductForm = ({ title, id = 0, data = {} }) => {
  const [hasTintometricColors, setHasTintometricColors] = useState(
    data.withTintometric ?? false,
  );
  useEffect(() => {
    setHasTintometricColors(data.withTintometric ?? false);
  }, [data.withTintometric]);

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

  const [
    {
      error: getErrorSizes,
      isLoading: getIsLoadingSizes,
      response: getResponseSizes,
    },
  ] = useFetch({
    entity: 'sizes',
    fetchMethod: 'GET',
  });

  const isEmptyData = Object.keys(data).length === 0;

  const fetchMethod = isEmptyData ? 'POST' : 'PUT';

  const [{ error, isLoading, response }, doFetch, resetFetch] = useFetch({
    entity: 'products',
    fetchMethod,
    id,
  });

  const defaultproductName = data.name ? data.name : '';
  const defaultSubCategories = data.subcategories ? data.subcategories : [];
  const defaultSizes = data.sizes ? data.sizes : [];
  const defaultCode = data.code ? data.code : [];

  const [loadingImg, setLoadingImg] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedImg] = useState(data.imageUrl ?? '');

  const onDrop = useCallback(acceptedFiles => {
    if (typeof acceptedFiles[0] === 'undefined') return;
    setImage(acceptedFiles[0]);
    const file = new FileReader();

    file.onloadstart = () => setLoadingImg(true);
    file.onload = () => {
      setPreview(file.result);
      setLoadingImg(false);
    };

    file.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop, accept: { 'image/*': [] } });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      productName: defaultproductName,
      productCode: defaultCode,
    },
    resolver: yupResolver(schema),
  });

  const selectedSizes = watch('sizes');

  useEffect(() => {
    console.log('cambia selectedSizes a ::::', selectedSizes);
  }, [selectedSizes]);

  const onSubmit = ({ productName, subCategories, ...rest }) => {
    try {
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

      const sizesData = selectedSizes.map(quantity => {
        const size = getResponseSizes.find(s => s.quantity === quantity);
        return {
          sizeId: size.id,
          basePrice: rest[`price_${quantity}`],
        };
      });
      console.log('sizesData:', sizesData);

      const formData = new FormData();

      formData.append('name', productName);
      formData.append('subcategories', JSON.stringify(selectedSubCategories));
      formData.append('image', image);
      formData.append('sizes', JSON.stringify(sizesData));
      formData.append('withTintometric', hasTintometricColors);
      console.log('productName', productName);
      console.log('subcategories', JSON.stringify(selectedSubCategories));
      console.log('sizesData', JSON.stringify(sizesData));
      console.log('withTintometric', hasTintometricColors);
      doFetch({ body: formData });
    } catch (err) {
      console.error('Error al procesar el formulario', err);
    }
  };

  const closeAlert = () => {
    setAlert(false);
  };

  const handleBack = () => {
    navigate(-1);
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
        setPreview(null);
        resetFetch();
      }

      if (fetchResponse.status === 200)
        message = 'Producto editado satisfactoriamente!';

      setAlert({
        isVisible: true,
        message,
        severity: 'success',
      });
    },
    [reset, resetFetch],
  );

  useEffect(() => {
    if (error) return handleError();

    if (response && (response.status === 201 || response.status === 200))
      return postSuccess(response);
  }, [postSuccess, error, response, handleError, loadingImg]);

  return (
    <>
      {loadingImg ?? <LinearLoader />}
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
          <Grid container spacing={2}>
            {selectedImg ? (
              <Grid item xs={12}>
                <StyledImageWrapper>
                  <StyledImg src={selectedImg} alt='Upload preview' />
                </StyledImageWrapper>
              </Grid>
            ) : null}
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
                name='productCode'
                id='productCode'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Código del Producto'
                    name='productCode'
                    onChange={onChange}
                    type='text'
                    value={value}
                    variant='outlined'
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='productCode'
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
                    inputLabel='Subcategorías'
                    label='Subcategorías'
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
          <Grid item xs={12}>
            <Controller
              control={control}
              name='sizes'
              defaultValue={defaultSizes.map(size => size.quantity)}
              render={({ field }) => (
                <MultiSelect
                  fullWidth
                  name='sizes'
                  inputLabel='Capacidades'
                  label='Capacidades'
                  disabled={getIsLoadingSizes}
                  onChange={field.onChange}
                  value={Array.isArray(field.value) ? field.value : []}
                  options={
                    getResponseSizes && !getErrorSizes
                      ? getResponseSizes.map(option => ({
                          value: option.id,
                          label: option.quantity,
                        }))
                      : []
                  }
                  variant='outlined'
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name='sizes'
              render={({ message }) => (
                <StyledErrorMessage>{message}</StyledErrorMessage>
              )}
            />
          </Grid>

          {selectedSizes &&
            selectedSizes.map(quantity => (
              <Grid item xs={12} key={quantity}>
                <Controller
                  control={control}
                  name={`price_${quantity}`}
                  defaultValue=''
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor={`price_${quantity}`}
                        required
                      >{`Precio base para ${quantity} litros`}</InputLabel>
                      <OutlinedInput
                        {...field}
                        type='number'
                        required
                        startAdornment={
                          <InputAdornment position='start'>$</InputAdornment>
                        }
                        label={`Precio base para ${quantity} litros`}
                      />
                    </FormControl>
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name={`price_${quantity}`}
                  render={({ message }) => (
                    <StyledErrorMessage>{message}</StyledErrorMessage>
                  )}
                />
              </Grid>
            ))}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={hasTintometricColors}
                  onChange={event =>
                    setHasTintometricColors(event.target.checked)
                  }
                />
              }
              label='Tiene colores del sistema tintométrico'
            />
          </Grid>
          <StyledDropzoneContainer
            {...getRootProps({ isFocused, isDragAccept, isDragReject })}
          >
            <input {...getInputProps()} />
            <p>
              Arrastra una image, o haz click para seleccionar desde tus
              archivos
            </p>
          </StyledDropzoneContainer>
          {preview && (
            <StyledImageWrapper>
              <StyledImg src={preview} alt='Preview' />
            </StyledImageWrapper>
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
              onClick={handleSubmit(onSubmit)}
              variant='contained'
              // disabled={!isValid}
              // loading={isLoading}
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
