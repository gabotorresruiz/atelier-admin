import React, { useState } from 'react';
import { styled } from '@mui/system';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { SubCategoryForm } from '../../../modules';

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(2)};
  top: ${theme.spacing(14)};
  z-index: 1;
`,
);

const EditSubCategory = () => {
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

      <SubCategoryForm title='Editar Sub Categoría' id={id} />
    </>
  );
};

export default EditSubCategory;
