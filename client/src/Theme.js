import { blue, teal, red} from '@mui/material/colors';
import { createTheme } from '@mui/material'
 
export const darkTheme = createTheme({
      palette: {
          type: "dark",
          primary: {
              main: blue[500],
          },
          secondary:{
            main: teal[500],
          },
          error:{
            main: red[500],
          },
      }
    })