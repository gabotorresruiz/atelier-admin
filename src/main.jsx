import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material';
import { ThemeProvider as ScThemeProvider } from 'styled-components';
import { esES } from '@mui/material/locale';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme(esES);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <ScThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ScThemeProvider>
    </ThemeProvider>
  </StyledEngineProvider>,
);
