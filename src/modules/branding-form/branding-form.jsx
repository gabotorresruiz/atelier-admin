import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
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
const StyledImageWrapper = styled('div')`
  height: 300px;
  width: 100%;
  margin-bottom: 25px;
  border: 2px dashed #bdbdbd;
  padding: 10px;
  box-sizing: border-box;
`;

const StyledDropzoneWrapper = styled('div')`
  height: 300px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  cursor: pointer;
  border: 2px dashed #bdbdbd;

  p {
    text-align: center;
    width: 100%;
  }

  &:hover {
    border-color: #212121;
  }
`;

const StyledImg = styled('img')`
  object-fit: scale-down;
  height: 100%;
  width: 100%;
`;

const StyledDeleteIconWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const BrandingForm = ({ title, id = 0, data = {} }) => {
  // main image states
  const [loadingImg, setLoadingImg] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedHomeImg] = useState(data.homeImageUrl ?? '');
  const [selectedLogoImg] = useState(data.logoImageUrl ?? '');

  // logo states
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
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
    Object.keys(data).length === 0 ? '' : data.address;

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
      address: defaultBrandingAdress,
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
    if (image) formData.append('homeImage', image);
    if (logoImage) formData.append('logoImage', logoImage);
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

  const removeLogo = () => {
    setLogoImage(null);
    setPreviewLogo(null);
  };

  const removeMainImage = () => {
    setImage(null);
    setPreview(null);
  };

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
                    type='string'
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

          {/* Main image section */}
          <Grid item xs={12}>
            <h3>Imagen Principal</h3>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {selectedHomeImg && (
                  <StyledImageWrapper>
                    <StyledImg src={selectedHomeImg} alt='Current Image' />
                  </StyledImageWrapper>
                )}
              </Grid>
              <Grid item xs={6}>
                {preview ? (
                  <StyledImageWrapper>
                    <StyledImg src={preview} alt='New Image' />
                    <StyledDeleteIconWrapper>
                      <Tooltip title='Remover Imagen Nueva' placement='top'>
                        <DeleteIcon onClick={removeMainImage} />
                      </Tooltip>
                    </StyledDeleteIconWrapper>
                  </StyledImageWrapper>
                ) : (
                  <StyledDropzoneWrapper
                    {...getRootPropsMain({
                      isFocused: isFocusedMain,
                      isDragAccept: isDragAcceptMain,
                      isDragReject: isDragRejectMain,
                    })}
                  >
                    <input {...getInputPropsMain()} />
                    <p>
                      Arrastra o haz click para seleccionar una nueva imagen
                    </p>
                  </StyledDropzoneWrapper>
                )}
              </Grid>
            </Grid>
          </Grid>

          {/* Logo image section */}
          <Grid item xs={12}>
            <h3>Logo</h3>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {selectedLogoImg && (
                  <StyledImageWrapper>
                    <StyledImg src={selectedLogoImg} alt='Current Logo' />
                  </StyledImageWrapper>
                )}
              </Grid>
              <Grid item xs={6}>
                {previewLogo ? (
                  <StyledImageWrapper>
                    <StyledImg src={previewLogo} alt='News logo' />
                    <StyledDeleteIconWrapper>
                      <Tooltip title='Remover Nuevo Logo' placement='top'>
                        <DeleteIcon onClick={removeLogo} />
                      </Tooltip>
                    </StyledDeleteIconWrapper>
                  </StyledImageWrapper>
                ) : (
                  <StyledDropzoneWrapper
                    {...getRootPropsLogo({
                      isFocused: isFocusedLogo,
                      isDragAccept: isDragAcceptLogo,
                      isDragReject: isDragRejectLogo,
                    })}
                  >
                    <input {...getInputPropsLogo()} />
                    <p>Arrastra o haz click para seleccionar un nuevo logo</p>
                  </StyledDropzoneWrapper>
                )}
              </Grid>
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

export default BrandingForm;
