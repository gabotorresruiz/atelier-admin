import React, { Suspense, useState } from 'react';
import { styled } from '@mui/system';
import Alert from '@mui/material/Alert';
import { LinearLoader } from '../../components';
import { CustomizedTable } from '../../modules';

const StyledAlert = styled(Alert)(
  ({ theme }) => `
  position: absolute;
  right: ${theme.spacing(2)};
  top: ${theme.spacing(14)};
  z-index: 1;
`,
);

const Trends = () => {
  const response = [];
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
    severity: '',
  });

  const closeAlert = () => {
    setAlert(false);
  };

  return (
    <Suspense fallback={<LinearLoader />}>
      {alert.isVisible && (
        <StyledAlert onClose={closeAlert} severity={alert.severity}>
          {alert.message}
        </StyledAlert>
      )}

      <CustomizedTable
        data={response}
        // refreshData={refreshData}
        tableTitle='Tendencias'
        entity='trends'
      />
    </Suspense>
  );
};

export default Trends;
