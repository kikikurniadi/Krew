
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSignMessage } from 'wagmi';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Chip,
  Divider,
  Stack,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

import { contractAddress, contractAbi } from '../utils/contract';
import TransferDialog from '../components/TransferDialog';

const VOUCHER_TYPES = {
  0: { name: 'Espresso', color: 'warning' },
  1: { name: 'Cappuccino', color: 'success' },
  2: { name: 'Luwak', color: 'primary' },
};
const FALLBACK_IMAGE = "https://via.placeholder.com/300x200.png?text=Voucher+Kopi";

function VoucherDetailPage() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();

  const [metadata, setMetadata] = useState(null);
  const [metadataError, setMetadataError] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '' });

  const { data: signature, isPending: isSigning, error: signError, signMessage } = useSignMessage();

  const { data: voucherDetails, isLoading: isLoadingDetails, isError: isErrorDetails, refetch: refetchDetails } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'getVoucherDetails',
      args: [BigInt(tokenId)],
      enabled: !!tokenId
  });

  const { data: owner, isLoading: isLoadingOwner, isError: isErrorOwner, refetch: refetchOwner } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'ownerOf',
      args: [BigInt(tokenId)],
      enabled: !!tokenId
  });

  const { data: tokenURI, isLoading: isLoadingURI } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
    enabled: !!tokenId,
  });
  
  const { data: hash, isPending: isTransferPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenURI) return;
      const ipfsGatewayUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
      try {
        const response = await axios.get(ipfsGatewayUrl);
        setMetadata(response.data);
      } catch (error) {
        console.error("Failed to fetch metadata from IPFS:", error);
        setMetadataError("Could not load voucher details from IPFS.");
      }
    };
    fetchMetadata();
  }, [tokenURI]);

  useEffect(() => {
    if (isConfirmed) {
        setNotification({ open: true, message: 'Voucher transfer successful!' });
        refetchDetails();
        refetchOwner();
        setTimeout(() => navigate('/profile'), 2000);
    }
  }, [isConfirmed, navigate, refetchDetails, refetchOwner]);

  useEffect(() => {
    if (signature) {
        const dataForQR = JSON.stringify({ tokenId, signature });
        setQrCodeData(dataForQR);
    }
  }, [signature, tokenId]);
  
  const handleTransfer = (recipientAddress, message) => {
    console.log(`Transfering to ${recipientAddress} with message: ${message}`);
    // The message is not stored on-chain, but you could use it for a notification system
    // For now, we just log it and show a success notification.
    writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'transferFrom',
        args: [address, recipientAddress, BigInt(tokenId)],
    });
    setTransferDialogOpen(false);
  };

  const handleGenerateQR = () => {
    if (qrCodeData) {
        setQrCodeData(null);
        return;
    }
    
    const messageToSign = `I authorize the redemption of Coffee Voucher (Token ID: ${tokenId}) at: ${new Date().toUTCString()}`;
    signMessage({ message: messageToSign });
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '' });
  };

  const isLoading = isLoadingDetails || isLoadingOwner || isLoadingURI;
  const isError = isErrorDetails || isErrorOwner || metadataError;
  const isOwner = isConnected && owner && address && owner.toLowerCase() === address.toLowerCase();
  
  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }
  
  if (isError) {
    return <Alert severity="error">{metadataError || 'Failed to load voucher data. The token ID might be invalid.'}</Alert>;
  }

  if (!voucherDetails || !metadata) {
    return <Alert severity="info">Voucher data not found.</Alert>;
  }
  
  const [voucherType, isRedeemed] = voucherDetails;
  const typeInfo = VOUCHER_TYPES[voucherType] || { name: 'Unknown', color: 'default' };

  return (
    <Container maxWidth="md">
      <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/dapp" sx={{ mb: 2 }}>
        Back to Gallery
      </Button>
      
      <Paper sx={{ p: { xs: 2, md: 4 }, border: '1px solid #ddd' }}>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: 2 }}>
                <img src={metadata.image || FALLBACK_IMAGE} alt={metadata.name} style={{ width: '100%', height: 'auto', objectFit: 'cover' }}/>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom>{metadata.name}</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Token ID: {tokenId}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                <Chip label={typeInfo.name} color={typeInfo.color || 'default'} />
                <Chip label={isRedeemed ? 'Redeemed' : 'Active'} color={isRedeemed ? 'error' : 'success'} variant="outlined"/>
            </Stack>
            <Typography paragraph sx={{ my: 2 }}>
              {metadata.description}
            </Typography>
            <Divider sx={{ my: 2 }}/>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                Owner: {owner}
            </Typography>
             {isOwner && !isRedeemed && (
                <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        color="secondary" 
                        startIcon={<QrCode2Icon />}
                        onClick={handleGenerateQR}
                        disabled={isSigning}
                    >
                        {isSigning ? 'Waiting for Signature...' : (qrCodeData ? 'Hide QR Code' : 'Show Redemption QR Code')}
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<CardGiftcardIcon />}
                        onClick={() => setTransferDialogOpen(true)}
                        disabled={isTransferPending || isConfirming}
                    >
                        {isTransferPending || isConfirming ? 'Processing...' : 'Send as Gift'}
                    </Button>
                </Stack>
            )}
          </Grid>
        </Grid>
        {isOwner && qrCodeData && !isRedeemed && (
            <Box sx={{mt: 4, p: 3, textAlign: 'center', border: '1px dashed grey', borderRadius: 2}}>
                <Typography variant="h6" gutterBottom>Scan to Redeem</Typography>
                <QRCodeCanvas
                    value={qrCodeData}
                    size={256}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={true}
                />
                <Typography variant="caption" display="block" sx={{mt: 1}}>
                    Show this code to the barista to redeem your voucher.
                </Typography>
            </Box>
        )}
        {signError && (
            <Alert severity="error" sx={{ mt: 2 }}>
                Failed to get signature: {signError.shortMessage || signError.message}
            </Alert>
        )}
      </Paper>
      
      <TransferDialog
        open={transferDialogOpen}
        onClose={() => setTransferDialogOpen(false)}
        onConfirm={handleTransfer}
        voucherName={metadata.name}
        isPending={isTransferPending || isConfirming}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message={notification.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

export default VoucherDetailPage;
