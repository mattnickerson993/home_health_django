import { blue, teal, red } from "@mui/material/colors";
import { createTheme } from "@mui/material";
import { palette } from "@mui/system";

const colors = {
  primary: blue[500],
  secondary: teal[500],
  error: red[500],
};
export const darkTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    error: {
      main: colors.error,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            borderLeft: `5px solid ${colors.primary}`,
          },
        },
      },
    },
  },
});
