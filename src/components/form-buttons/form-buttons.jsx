import React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { styled } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';

const StyledButtonsWrapper = styled('div')`
  position: absolute;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 37px;
`;

const StyledButtonLeft = styled(Button)`
  position: fixed;
`;

const StyledButtonRight = styled(LoadingButton)`
  position: fixed;
  right: 25px;
`;

const FormButtons = ({
  onSubmit,
  disabled,
  isLoading,
  handleSubmit = null,
  handleBack = null,
}) => (
  <StyledButtonsWrapper>
    {handleBack ? (
      <StyledButtonLeft
        startIcon={<ArrowBackIosIcon />}
        onClick={handleBack}
        variant='outlined'
      >
        Volver
      </StyledButtonLeft>
    ) : null}
    <StyledButtonRight
      component='button'
      onClick={handleSubmit ? handleSubmit(onSubmit) : onSubmit}
      variant='contained'
      disabled={disabled}
      loading={isLoading}
    >
      Guardar
    </StyledButtonRight>
  </StyledButtonsWrapper>
);

export default FormButtons;
