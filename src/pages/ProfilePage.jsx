
import React, { useState, useEffect } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { contractAddress, contractAbi } from '../utils/contract';
import VoucherCard from '../components/VoucherCard';
import ConnectWalletButton from '../components/ConnectWalletButton';

function ProfilePage() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  const [userVouchers, setUserVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Dapatkan total supply untuk mengetahui berapa banyak voucher yang ada
  const { data: totalSupplyData } = useReadContracts({
    contracts: [{
      address: contractAddress,
      abi: contractAbi,
      functionName: 'totalSupply',
    }],
  });
  const totalSupply = totalSupplyData?.[0]?.result ? Number(totalSupplyData[0].result) : 0;

  // 2. Buat daftar panggilan untuk mendapatkan pemilik setiap voucher
  const ownerCalls = Array.from({ length: totalSupply }, (_, i) => ({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'ownerOf',
    args: [BigInt(i + 1)],
  }));
  
  // 3. Panggil `ownerOf` untuk semua voucher
  const { data: ownersData } = useReadContracts({
    contracts: ownerCalls,
    query: {
        enabled: totalSupply > 0,
    }
  });
  
  // 4. Filter untuk menemukan voucher milik pengguna saat ini
  useEffect(() => {
    if (!isConnected) {
      setIsLoading(false);
      return;
    }
    if (totalSupply === 0) {
        setIsLoading(false);
        setUserVouchers([]);
        return;
    }
    if (ownersData) {
      try {
        const ownedTokenIds = ownersData
          .map((ownerResult, index) => ({
            tokenId: index + 1,
            owner: ownerResult.result,
          }))
          .filter(voucher => voucher.owner && voucher.owner.toLowerCase() === address.toLowerCase());
        
        // Sekarang, dapatkan detail untuk voucher yang dimiliki
        const voucherDetailCalls = ownedTokenIds.map(v => ({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'getVoucherDetails',
            args: [BigInt(v.tokenId)]
        }));

        // Wagmi tidak mengizinkan useReadContracts dipanggil secara kondisional, jadi kita akan handle ini secara manual
        // Dalam aplikasi nyata, ini lebih baik ditangani oleh backend atau subgraph
        // Untuk saat ini, kita akan menandai voucher ini dan membiarkan VoucherCard mengambil detailnya sendiri
        setUserVouchers(ownedTokenIds);
        setIsLoading(false);

      } catch (err) {
        console.error("Error filtering vouchers:", err);
        setError("Gagal memproses data voucher.");
        setIsLoading(false);
      }
    }
  }, [ownersData, address, isConnected, totalSupply]);
  
  if (!isConnected) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 5 }}>
        <Alert severity="warning" sx={{p:3, borderRadius: 2}}>
          <Typography variant="h6">Harap hubungkan dompet Anda</Typography>
          <Typography sx={{ my: 2 }}>Anda perlu menghubungkan dompet untuk melihat profil dan koleksi voucher Anda.</Typography>
          <ConnectWalletButton />
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }
  
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const activeVouchers = userVouchers; // Di masa mendatang, kita akan memfilter berdasarkan status 'isRedeemed'
  const redeemedVouchers = []; // Sama seperti di atas

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: 'linear-gradient(to right, #f3f4f6, #e5e7eb)' }}>
        <Typography variant="h3" component="h1" fontWeight="bold">Profil Saya</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', mt: 1 }}>
          {address}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip label={`${userVouchers.length} Total Voucher`} color="primary" />
            {/* <Chip label={`${redeemedVouchers.length} Telah Ditebus`} color="success" /> */}
        </Box>
      </Paper>

      <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
        Voucher Aktif
      </Typography>
      {activeVouchers.length > 0 ? (
        <Grid container spacing={4}>
          {activeVouchers.map(({ tokenId }) => (
            <Grid key={tokenId} xs={12} sm={6} md={4}>
              <VoucherCard tokenId={tokenId} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Anda belum memiliki voucher aktif.</Typography>
      )}

      {/* Bagian untuk voucher yang sudah ditebus (jika ada) */}
      {/* 
      <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mt: 6, mb: 3 }}>
        Riwayat Penukaran
      </Typography>
      {redeemedVouchers.length > 0 ? (
        <Grid container spacing={4}>
          {redeemedVouchers.map(({ tokenId }) => (
            <Grid key={tokenId} xs={12} sm={6} md={4}>
              <VoucherCard tokenId={tokenId} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>Anda belum pernah menukarkan voucher.</Typography>
      )} 
      */}
    </Container>
  );
}

export default ProfilePage;
