import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import {
  Alert,
  Box,
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
  TextareaAutosize,
} from '@mui/material';
import { FormButtons, LinearLoader, MultiSelect } from '../../components';
import { useFetch } from '../../hooks';
import schema from './schema';

const getColor = props => {
  if (props.isDragAccept) return '#00e676';
  if (props.isDragReject) return '#ff1744';
  if (props.isFocused) return '#2196f3';

  return '#eeeeee';
};

const StyledErrorMessage = styled('span')`
  color: ${({ theme }) => theme.palette.error.dark};
`;

const StyledAlert = styled(Alert)`
  position: fixed;
  right: 25px;
`;

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
  margin-top: 0;
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
  margin-top: 15px;

  &:hover {
    border-color: #212121;
  }
`;

const StyledTextareaAutosize = styled(TextareaAutosize)(
  () => `
  box-sizing: border-box;
  width: 100%;
  font-family: "Roboto","Helvetica","Arial",sans-serif;;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 16.5px 14px;
  border-radius: 4px;
  border: 1px solid #B0B8C4;
  box-shadow: 0px 2px 2px #F3F6F9;

  &:hover {
    border-color: #434D5B;
  }

  &:focus {
    border-color: #1976D2;
    border-width: 2px;
  }

  &:focus-visible {
    outline: 0;
  }
`,
);

const ProductForm = ({ title, id = 0, data = {} }) => {
  const [productBasePrice, setProductBasePrice] = useState(data.price ?? null);
  const [hasProductSize, setHasProductSize] = useState(
    !!(data.products_sizes && data.products_sizes.length > 0),
  );
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
    shouldReload: true,
    entity: 'products',
    fetchMethod,
    id,
  });

  const defaultProductName = data.name ? data.name : '';
  const defaultProductDescription = data.description ? data.description : '';
  const defaultSubCategories = data.subcategories ? data.subcategories : [];
  const defaultPrice = data.price ? data.price : '';

  const defaultSizes = data.products_sizes
    ? data.products_sizes.map(({ size, basePrice }) => ({
        quantity: size.quantity,
        basePrice,
      }))
    : [];

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
      productName: defaultProductName,
      productDescription: defaultProductDescription,
      productCode: defaultCode,
      productPrice: defaultPrice,
    },
    resolver: yupResolver(schema),
  });

  const selectedSizes = watch('sizes');

  const generateRandomNumber = () => {
    const min = 10 ** 15;
    const max = 10 ** 16 - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const onSubmit = ({
    productName,
    productDescription,
    subCategories,
    productCode,
    productPrice,
    ...rest
  }) => {
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

    const sizesData = hasProductSize
      ? JSON.stringify(
          selectedSizes.map(sizeName => {
            const size = getResponseSizes.find(s => s.quantity === sizeName);

            const formattedSizeName = sizeName.toString().replace('.', '_');

            return {
              sizeId: size.id,
              basePrice: parseFloat(rest[`price_${formattedSizeName}`]),
            };
          }),
        )
      : null;

    const formData = new FormData();

    formData.append('name', productName);
    formData.append('description', productDescription);
    formData.append('code', productCode);
    formData.append('price', !hasProductSize ? productPrice : null);
    formData.append('sku', generateRandomNumber()); // harcoded sku for now
    formData.append('subcategories', JSON.stringify(selectedSubCategories));
    formData.append('image', image);
    formData.append('sizes', sizesData);
    formData.append('withTintometric', hasTintometricColors);

    doFetch({ body: formData });
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
    <Box mb={5} sx={{ position: 'relative' }}>
      <FormButtons
        handleBack={handleBack}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        disabled={!isValid || (!hasProductSize && !productBasePrice)}
        isLoading={isLoading}
      />
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
            <Grid mb='25px' item xs={12}>
              {preview && (
                <StyledImageWrapper>
                  <StyledImg src={preview} alt='Preview' />
                </StyledImageWrapper>
              )}
              <StyledDropzoneContainer
                {...getRootProps({ isFocused, isDragAccept, isDragReject })}
              >
                <input {...getInputProps()} />
                <p>
                  Arrastra una image, o haz click para seleccionar desde tus
                  archivos
                </p>
              </StyledDropzoneContainer>
            </Grid>
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
                    label='Nombre Producto (único)'
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
                name='productDescription'
                id='productDescription'
                control={control}
                required
                render={({ field: { onChange, value } }) => (
                  <StyledTextareaAutosize
                    fullWidth
                    name='productDescription'
                    minRows={3}
                    placeholder='Descripción *'
                    onChange={e => {
                      // Enforce character limit
                      const truncatedValue = e.target.value.slice(0, 255);
                      onChange(truncatedValue);
                    }}
                    type='text'
                    value={value}
                    variant='outlined'
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='productDescription'
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
                    label='Código del Producto (único)'
                    name='productCode'
                    required
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
          {!hasProductSize ? (
            <Grid item xs={12}>
              <Controller
                name='productPrice'
                id='productPrice'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControl fullWidth>
                    <InputLabel>Precio</InputLabel>
                    <OutlinedInput
                      type='number'
                      value={value}
                      onChange={e => {
                        onChange(e);
                        setProductBasePrice(e.target.value);
                      }}
                      startAdornment={
                        <InputAdornment position='start'>$</InputAdornment>
                      }
                      label='Precio'
                    />
                  </FormControl>
                )}
              />
              <ErrorMessage
                errors={errors}
                name='productPrice'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={hasProductSize}
                  onChange={event => setHasProductSize(event.target.checked)}
                />
              }
              label='Tiene capacidades'
            />
          </Grid>
          {hasProductSize ? (
            <Grid item xs={12}>
              <Controller
                control={control}
                name='sizes'
                defaultValue={defaultSizes.map(({ quantity }) => quantity)}
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
          ) : null}
          {hasProductSize &&
            selectedSizes &&
            selectedSizes.map(sizeName => (
              <Grid item xs={12} key={sizeName}>
                <Controller
                  control={control}
                  name={`price_${sizeName.toString().replace('.', '_')}`}
                  defaultValue={
                    defaultSizes.find(e => e.quantity === sizeName)
                      ?.basePrice || ''
                  }
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor={`price_${sizeName.toString().replace('.', '_')}`}
                        required
                      >{`Precio base para ${sizeName} litros`}</InputLabel>
                      <OutlinedInput
                        {...field}
                        type='number'
                        required
                        startAdornment={
                          <InputAdornment position='start'>$</InputAdornment>
                        }
                        label={`Precio base para ${sizeName} litros`}
                      />
                    </FormControl>
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name={`price_${sizeName.toString().replace('.', '_')}`}
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
        </StyledBox>
      </Container>
    </Box>
  );
};

export default ProductForm;
