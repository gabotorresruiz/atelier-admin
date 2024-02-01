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
  TextareaAutosize,
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

const TrendsForm = ({ title, id = 0, data = {} }) => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const [
    {
      error: getProductsError,
      isLoading: getProductIsLoading,
      response: getProductsResponse,
    },
  ] = useFetch({
    entity: 'products',
    fetchMethod: 'GET',
  });

  const isEmptyData = Object.keys(data).length === 0;

  const defaultTrendName = data.name ? data.name : '';
  const defaultTrendDescription = data.description ? data.description : '';
  const defaultProducts = data.products ? data.products : [];

  const fetchMethod = isEmptyData ? 'POST' : 'PUT';

  const [{ error, isLoading, response }, doFetch, resetFetch] = useFetch({
    entity: 'trends',
    fetchMethod,
    id,
  });

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
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      trendName: defaultTrendName,
      trendDescription: defaultTrendDescription,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = ({ trendName, products, trendDescription }) => {
    const selectedProducts = products
      .map(product => {
        const matchingOption = getProductsResponse.find(
          option => option.name === product,
        );
        if (matchingOption) {
          return {
            id: matchingOption.id,
          };
        }
        return null;
      })
      .filter(Boolean);

    const formData = new FormData();

    formData.append('name', trendName);
    formData.append('description', trendDescription);
    formData.append('image', image);
    formData.append('products', JSON.stringify(selectedProducts));
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
        message = 'Tendencia agregado satisfactoriamente!';
        reset();
        setPreview(null);
        resetFetch();
      }

      if (fetchResponse.status === 200)
        message = 'Tendencia editado satisfactoriamente!';

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
                name='trendName'
                id='trendName'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Nombre Tendencia'
                    name='trendName'
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
                name='trendName'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='trendDescription'
                id='trendDescription'
                control={control}
                required
                render={({ field: { onChange, value } }) => (
                  <StyledTextareaAutosize
                    fullWidth
                    name='trendDescription'
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
                name='trendDescription'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name='products'
                defaultValue={defaultProducts.map(product => product.name)}
                render={({ field }) => (
                  <MultiSelect
                    fullWidth
                    name='products'
                    inputLabel='Productos'
                    label='Productos'
                    required
                    disabled={getProductIsLoading}
                    onChange={field.onChange}
                    value={Array.isArray(field.value) ? field.value : []}
                    options={
                      getProductsResponse && !getProductsError
                        ? getProductsResponse.map(option => ({
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
                name='products'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
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

export default TrendsForm;
