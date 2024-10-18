// src/theme.js
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e50914', // Netflix's signature red color for primary elements
    },
    secondary: {
      main: '#ffffff', // White for secondary elements
    },
    background: {
      default: '#141414', // Netflix's background color (dark grey)
      paper: '#1c1c1c', // Slightly lighter grey for cards, paper components
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b3b3b3', // Grey text for secondary elements
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 400,
    },
  },
});

export default darkTheme;
