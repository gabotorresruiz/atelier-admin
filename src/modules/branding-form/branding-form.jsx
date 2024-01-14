import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, Button, Container, Grid, TextField } from '@mui/material';
import { LinearLoader } from '../../components';
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

const BrandingForm = ({ title, id = 0, data = {} }) => {
  // main image states
  const [loadingImg, setLoadingImg] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedImg] = useState(data.imageUrl ?? '');

  // logo states
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [logoImage, setLogoImage] = useState(null);

  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const fetchMethod = Object.keys(data).length === 0 ? 'POST' : 'PUT';

  const defaultBrandingName = Object.keys(data).length === 0 ? '' : data.name;
  const defaultBrandingTitle = Object.keys(data).length === 0 ? '' : data.title;
  const defaultBrandingSubtitle =
    Object.keys(data).length === 0 ? '' : data.subtitle;
  const defaultBrandingEmail = Object.keys(data).length === 0 ? '' : data.email;
  const defaultBrandingPhone = Object.keys(data).length === 0 ? '' : data.phone;
  const defaultBrandingAdress =
    Object.keys(data).length === 0 ? '' : data.adress;

  const [{ response, error, isLoading }, doFetch] = useFetch({
    entity: 'brandings',
    fetchMethod,
    id,
  });

  const onDropMain = useCallback(acceptedFiles => {
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

  const onDropLogo = useCallback(acceptedFiles => {
    if (typeof acceptedFiles[0] === 'undefined') return;
    setLogoImage(acceptedFiles[0]);
    const file = new FileReader();

    file.onloadstart = () => setLoadingLogo(true);
    file.onload = () => {
      setPreviewLogo(file.result);
      setLoadingLogo(false);
    };

    file.readAsDataURL(acceptedFiles[0]);
  }, []);

  const {
    getRootProps: getRootPropsMain,
    getInputProps: getInputPropsMain,
    isFocused: isFocusedMain,
    isDragAccept: isDragAcceptMain,
    isDragReject: isDragRejectMain,
  } = useDropzone({ onDrop: onDropMain, accept: { 'image/*': [] } });

  const {
    getRootProps: getRootPropsLogo,
    getInputProps: getInputPropsLogo,
    isFocused: isFocusedLogo,
    isDragAccept: isDragAcceptLogo,
    isDragReject: isDragRejectLogo,
  } = useDropzone({ onDrop: onDropLogo, accept: { 'image/*': [] } });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: defaultBrandingName,
      title: defaultBrandingTitle,
      subtitle: defaultBrandingSubtitle,
      email: defaultBrandingEmail,
      phone: defaultBrandingPhone,
      adress: defaultBrandingAdress,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = formValues => {
    const formData = new FormData();

    formData.append('name', formValues.name);
    formData.append('title', formValues.title);
    formData.append('subtitle', formValues.subtitle);
    formData.append('email', formValues.email);
    formData.append('phone', formValues.phone);
    formData.append('address', formValues.address);
    if (image) formData.append('image', image);
    console.log('formData', formData);
    // if (logoImage) formData.append('logoImage', logoImage);

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
        message = 'Marca agregada satisfactoriamente!';
        reset();
      }

      if (fetchResponse.status === 200) {
        message = 'Marca editada satisfactoriamente!';
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
      {loadingImg ?? <LinearLoader />}
      {loadingLogo ?? <LinearLoader />}
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}
      <Container component='div' maxWidth='sm'>
        <h1>{title}</h1>
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
                name='name'
                id='name'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Nombre Marca'
                    name='name'
                    onChange={onChange}
                    required
                    type='text'
                    value={value}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='name'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='title'
                id='title'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Título'
                    name='title'
                    onChange={onChange}
                    required
                    type='text'
                    value={value}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='title'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='subtitle'
                id='subtitle'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    label='Subítulo'
                    name='subtitle'
                    onChange={onChange}
                    required
                    type='text'
                    value={value}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='subtitle'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='email'
                id='email'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    label='email'
                    name='email'
                    onChange={onChange}
                    required
                    type='email'
                    value={value}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='email'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='address'
                id='address'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    label='Dirección'
                    name='address'
                    onChange={onChange}
                    required
                    type='text'
                    value={value}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='address'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='phone'
                id='phone'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    label='Celular'
                    name='phone'
                    onChange={onChange}
                    required
                    type='number'
                    value={value}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name='phone'
                render={({ message }) => (
                  <StyledErrorMessage>{message}</StyledErrorMessage>
                )}
              />
            </Grid>
          </Grid>

          {/* Dropzone for the main image */}
          <StyledDropzoneContainer
            {...getRootPropsMain({
              isFocusedMain,
              isDragAcceptMain,
              isDragRejectMain,
            })}
          >
            <input {...getInputPropsMain()} />
            <p>
              Arrastra la imagen principal para el home aquí, o haz click para
              seleccionar desde tus archivos
            </p>
          </StyledDropzoneContainer>
          {preview && (
            <StyledImageWrapper>
              <StyledImg src={preview} alt='Preview' />
            </StyledImageWrapper>
          )}

          {/* Dropzone for the logo */}
          <StyledDropzoneContainer
            {...getRootPropsLogo({
              isFocusedLogo,
              isDragAcceptLogo,
              isDragRejectLogo,
            })}
          >
            <input {...getInputPropsLogo()} />
            <p>Arrastra el logo aquí, o haz click para seleccionarlo</p>
          </StyledDropzoneContainer>
          {previewLogo && (
            <StyledImageWrapper>
              <StyledImg src={previewLogo} alt='Preview Logo' />
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

export default BrandingForm;
