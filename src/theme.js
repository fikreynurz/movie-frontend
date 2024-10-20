import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0d47a1', // Dark Blue color for primary
    },
    secondary: {
      main: '#2196f3', // Lighter blue for secondary elements
    },
    background: {
      default: '#121212', // Dark mode background
      paper: '#1d1d1d',   // Slightly lighter background for cards, etc.
    },
    text: {
      primary: '#ffffff', // White text for better contrast
      secondary: '#90caf9', // Light blue for secondary text
    },
    action: {
      hover: '#1e88e5', // Dark blue hover effect
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

export default theme;
