import { createTheme } from '@mui/material/styles';
import '@fontsource/nunito';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f7f3ef',
      paper: '#ffffff',
    },
    primary: {
      main: '#8d6e63',
    },
    secondary: {
      main: '#d7ccc8',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Nunito, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#623a2cff',
    },
    primary: {
      main: '#bcaaa4',
    },
    secondary: {
      main: '#a1887f',
    },
    text: {
      primary: '#f5f5f5',
      secondary: '#bdbdbd',
    },
  },
  typography: {
    fontFamily: 'Nunito, sans-serif',
  },
});
