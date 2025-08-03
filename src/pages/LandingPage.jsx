
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CoffeeIcon from '@mui/icons-material/Coffee';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

// Ganti dengan path ke gambar latar belakang Anda
const heroBackgroundImage = 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';

const FeatureCard = ({ icon, title, description }) => (
  <Paper 
    elevation={4}
    sx={{
      p: 4,
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    }}
  >
    {icon}
    <Typography variant="h5" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Paper>
);

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          color: 'white',
          position: 'relative',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroBackgroundImage})`,
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, letterSpacing: '1px' }}>
            Revolusi Voucher Kopi Anda
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, maxWidth: '80%', margin: 'auto' }}>
            Miliki, tukarkan, dan kirim voucher kopi Anda sebagai NFT yang aman di blockchain.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/dapp')}
            sx={{ 
              py: 1.5, 
              px: 4, 
              borderRadius: '50px', 
              fontWeight: 'bold',
              boxShadow: '0px 8px 25px rgba(255, 167, 38, 0.4)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 12px 30px rgba(255, 167, 38, 0.6)',
              }
            }}
          >
            Masuk ke Aplikasi
          </Button>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
          Bagaimana Cara Kerjanya?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<CoffeeIcon color="primary" sx={{ fontSize: 50 }} />}
              title="1. Dapatkan Voucher"
              description="Beli atau terima voucher kopi edisi terbatas sebagai NFT unik langsung ke dompet digital Anda."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<QrCodeScannerIcon color="primary" sx={{ fontSize: 50 }} />}
              title="2. Gunakan & Tukarkan"
              description="Tukarkan voucher Anda dengan mudah di kedai kopi favorit dengan memindai Kode QR yang aman."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<CardGiftcardIcon color="primary" sx={{ fontSize: 50 }} />}
              title="3. Kirim sebagai Hadiah"
              description="Kirim voucher sebagai hadiah kejutan kepada teman atau keluarga, lengkap dengan pesan pribadi."
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;
