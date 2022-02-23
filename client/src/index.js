import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {darkTheme} from './Theme'


ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline>
      <App />
    </CssBaseline>
  </ThemeProvider>,
  document.getElementById('root')
);
