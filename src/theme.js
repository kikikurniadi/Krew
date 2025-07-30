import { createTheme } from '@mui/material/styles';

// Impor font Roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    mode: 'dark', // Menggunakan tema gelap
    primary: {
      main: '#6a4bff', // Warna ungu dari CSS kita sebelumnya
    },
    secondary: {
      main: '#ffc107', // Warna kuning dari CSS kita sebelumnya
    },
    background: {
      default: '#1a1a1a', // Warna latar belakang utama
      paper: '#2a2a2a', // Warna untuk kartu dan permukaan lainnya
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 'bold',
          padding: '10px 20px',
        },
      },
    },
  },
});

export default theme;
