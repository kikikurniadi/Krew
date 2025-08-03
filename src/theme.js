import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a3f35',
    },
    secondary: {
      main: '#a4978e',
    },
    background: {
      default: '#f0eada',
      paper: '#fff8e1',
    },
  },
  typography: {
    fontFamily: '"Silkscreen", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Press Start 2P", "Arial", sans-serif',
      fontSize: '3rem',
    },
    h2: {
      fontFamily: '"Press Start 2P", "Arial", sans-serif',
      fontSize: '2.5rem',
    },
    h3: {
      fontFamily: '"Press Start 2P", "Arial", sans-serif',
      fontSize: '2rem',
    },
    h4: {
      fontFamily: '"Press Start 2P", "Arial", sans-serif',
      fontSize: '1.5rem',
    },
    h5: {
      fontFamily: '"Press Start 2P", "Arial", sans-serif',
      fontSize: '1.2rem',
    },
    h6: {
      fontFamily: '"Press Start 2P", "Arial", sans-serif',
      fontSize: '1rem',
    },
    button: {
      fontFamily: '"Press Start 2P", "Arial", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: '2px solid black',
          borderRadius: 0,
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.75)',
          '&:hover': {
            boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.75)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '2px solid black',
          borderRadius: 0,
          padding: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '& fieldset': {
            borderWidth: '2px',
          },
        },
      },
    },
  },
});

export default theme;
