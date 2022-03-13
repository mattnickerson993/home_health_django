import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { darkTheme } from "./Theme";
import { AuthProvider } from "./context";

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CssBaseline>
  </ThemeProvider>,
  document.getElementById("root")
);
