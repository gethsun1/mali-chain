import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF3B30', // a bold red accent
    },
    background: {
      default: '#000000', // pure black background
      paper: '#111111',   // dark gray for card/paper elements
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
});
