import React, { useState } from 'react';
import { styled } from '@mui/system';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { EntityForm } from '../../../modules';

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(2)};
  top: ${theme.spacing(14)};
  z-index: 1;
`,
);

const EditCategory = () => {
  const { id } = useParams();

  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const closeAlert = () => {
    setAlert(false);
  };

  return (
    <>
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}

      <EntityForm title='Editar Categoría' id={id} entity='categoría' />
    </>
  );
};

export default EditCategory;
