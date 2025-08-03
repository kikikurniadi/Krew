
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadContract } from 'wagmi';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box, CircularProgress, Alert, Chip, Grow } from '@mui/material';
import axios from 'axios';
import { contractAddress, contractAbi } from '../utils/contract';

const VOUCHER_TYPES = {
  0: { name: 'Espresso', color: 'warning' },
  1: { name: 'Cappuccino', color: 'success' },
  2: { name: 'Luwak', color: 'primary' },
};
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1511920183234-2b215447e8b1?w=500&q=80";

function VoucherCard({ tokenId }) {
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState('');

  // Hook untuk mendapatkan URI token dari smart contract
  const { data: tokenURI, isLoading: isLoadingURI } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  });

  // Hook untuk mendapatkan detail voucher (jenis, status tebus)
  const { data: voucherDetails, isLoading: isLoadingDetails } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getVoucherDetails',
    args: [BigInt(tokenId)],
  });

  // Efek untuk mengambil metadata dari IPFS setelah tokenURI didapatkan
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenURI) return;
      // Mengganti prefix IPFS dengan gateway HTTP yang publik dan cepat
      const ipfsGatewayUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
      try {
        const response = await axios.get(ipfsGatewayUrl);
        setMetadata(response.data);
      } catch (err) {
        console.error("Gagal mengambil metadata:", err);
        setError("Tidak dapat memuat detail voucher.");
      }
    };
    fetchMetadata();
  }, [tokenURI]);

  const isLoading = isLoadingURI || isLoadingDetails;

  const handleCardClick = () => {
    navigate(`/voucher/${tokenId}`);
  };

  if (isLoading) {
    return (
      <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!metadata || !voucherDetails) {
    // Tampilan jika data belum siap tapi tidak loading/error
    return (
      <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, opacity: 0.5 }}>
        <Typography>Memuat...</Typography>
      </Card>
    );
  }

  const [voucherType, isRedeemed] = voucherDetails;
  const typeInfo = VOUCHER_TYPES[voucherType] || { name: 'Unknown', color: 'default' };

  return (
    <Grow in={true}>
      <Card
        sx={{
          borderRadius: 2,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
        }}
      >
        <CardActionArea onClick={handleCardClick} disabled={!metadata}>
          <CardMedia
            component="img"
            height="200"
            image={metadata.image || FALLBACK_IMAGE}
            alt={metadata.name || 'Voucher Kopi'}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" noWrap>
              {metadata.name || `Voucher #${tokenId}`}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip label={typeInfo.name} color={typeInfo.color || 'default'} size="small" />
              <Chip
                label={isRedeemed ? 'Ditebus' : 'Aktif'}
                color={isRedeemed ? 'default' : 'success'}
                variant={isRedeemed ? 'outlined' : 'filled'}
                size="small"
              />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grow>
  );
}

export default VoucherCard;
