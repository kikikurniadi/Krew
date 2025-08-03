import React from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Grid, Typography, CircularProgress, Alert } from '@mui/material';
import VoucherCard from './VoucherCard';
import VoucherKopiABI from '../VoucherKopi.json';

const CONTRACT_ADDRESS = '0xB9DA7A95eE0A0ac87638F81EA45aa0BB53aC1BbA';

function VoucherGallery() {
  const { address, isConnected } = useAccount();

  const { data: allVouchers, isLoading, isError, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VoucherKopiABI.abi,
    functionName: 'getAllVouchers',
    // Watch for changes, so it automatically updates when a new voucher is minted
    watch: true, 
  });

  if (!isConnected) {
    return <Alert severity="info">Please connect your wallet to see available vouchers.</Alert>;
  }
  
  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error fetching vouchers: {error.shortMessage || error.message}</Alert>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        All Vouchers in Circulation
      </Typography>
      <Grid container spacing={3}>
        {allVouchers && allVouchers.length > 0 ? (
          allVouchers.map((voucher) => (
            <Grid item xs={12} sm={6} md={4} key={Number(voucher.tokenId)}>
              {/* Pass the owner information to the card */}
              <VoucherCard tokenId={Number(voucher.tokenId)} initialOwner={voucher.owner} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No vouchers have been minted yet.</Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default VoucherGallery;
