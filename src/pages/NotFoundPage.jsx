import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Container>
      <Box
        sx={{
          py: 12,
          minHeight: '90vh',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
        <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Halaman Tidak Ditemukan
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '400px' }}>
          Oops! Halaman yang Anda cari tidak ada. Mungkin telah dipindahkan, dihapus, atau Anda salah mengetik alamat.
        </Typography>
        <Button
          component={RouterLink}
          to="/app"
          variant="contained"
          size="large"
        >
          Kembali ke Aplikasi
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
