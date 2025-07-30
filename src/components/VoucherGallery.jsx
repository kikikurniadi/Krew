import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import VoucherCard from './VoucherCard.jsx';

const VoucherGallery = ({ vouchers, onRedeem, isLoading }) => {
  if (!isLoading && vouchers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="body1" color="text.secondary">
          Anda belum memiliki voucher. Coba buat satu!
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      {vouchers.map((voucher) => (
        <Grid item xs={12} sm={6} md={4} key={voucher.tokenId.toString()}>
          <VoucherCard
            voucher={voucher}
            onRedeem={onRedeem}
            isLoading={isLoading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default VoucherGallery;
