
import React, { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Collapse,
} from '@mui/material';
import { contractAddress, contractAbi } from '../utils/contract';
import VoucherCard from '../components/VoucherCard';
import ConnectWalletButton from '../components/ConnectWalletButton';

function DappPage() {
  const { isConnected } = useAccount();

  // Wagmi hook untuk mengambil semua data voucher dengan satu panggilan
  const { data: vouchers, isLoading, isError, error } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getAllVouchers',
    enabled: isConnected, // Hanya aktifkan jika dompet terhubung
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          Galeri Voucher Kopi
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
          Jelajahi koleksi voucher kopi eksklusif kami. Hubungkan dompet Anda untuk melihat detail, mentransfer, atau menukarkan NFT Anda.
        </Typography>
      </Box>

      {!isConnected ? (
        <Collapse in={!isConnected}>
          <Alert
            severity="info"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Dompet Anda belum terhubung.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Silakan hubungkan dompet Anda untuk melihat dan mengelola voucher kopi NFT Anda.
            </Typography>
            <ConnectWalletButton />
          </Alert>
        </Collapse>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress size={50} />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ my: 4 }}>
          Gagal memuat data dari smart contract. Pastikan Anda terhubung ke jaringan yang benar (Lisk Sepolia).
          <br />
          <small>{error?.shortMessage || error?.message}</small>
        </Alert>
      ) : (
        <>
          <Grid container spacing={4}>
            {vouchers && vouchers.map((voucher) => (
              <Grid item key={voucher.tokenId} xs={12} sm={6} md={4}>
                <VoucherCard tokenId={Number(voucher.tokenId)} />
              </Grid>
            ))}
          </Grid>
          {(!vouchers || vouchers.length === 0) && (
              <Typography sx={{ textAlign: 'center', mt: 5, fontStyle: 'italic' }}>
                Saat ini belum ada voucher yang di-mint.
              </Typography>
          )}
        </>
      )}
    </Container>
  );
}

export default DappPage;
