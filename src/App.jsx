import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from 'wagmi';
import { injected } from 'wagmi/connectors';

// MUI Components
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

import VoucherKopiABI from './VoucherKopi.json';
import VoucherGallery from './components/VoucherGallery.jsx';
import './App.css';

const CONTRACT_ADDRESS = '0xFf687ac2B8858681A58ec2aF6D4e143d20f449Cf';
const VOUCHER_METADATA_URI =
  'https://gateway.pinata.cloud/ipfs/QmaS5p6WkVeJk3j2VpSwD8r2h4a4J1Y3vPwaHhWterK1sH';

// Komponen Tombol Koneksi Kustom dengan MUI
const ConnectWalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '6px 12px',
            borderRadius: '20px',
          }}
        >
          {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      onClick={() => connect({ connector: injected() })}
    >
      Connect Wallet
    </Button>
  );
};

function App() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const {
    data: hash,
    error: writeError,
    isPending,
    writeContract,
  } = useWriteContract();

  const [userVouchers, setUserVouchers] = useState([]);
  const [isFetchingVouchers, setIsFetchingVouchers] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSeverity, setMessageSeverity] = useState('info');

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VoucherKopiABI.abi,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: isConnected },
  });

  useEffect(() => {
    const fetchVouchers = async () => {
      if (
        !isConnected ||
        !publicClient ||
        balanceData === undefined ||
        Number(balanceData) === 0
      ) {
        setUserVouchers([]);
        return;
      }

      setIsFetchingVouchers(true);
      try {
        const balance = Number(balanceData);
        const voucherPromises = [];

        for (let i = 0; i < balance; i++) {
          const promise = async () => {
            const tokenId = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: VoucherKopiABI.abi,
              functionName: 'tokenOfOwnerByIndex',
              args: [address, i],
            });
            const tokenURI = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: VoucherKopiABI.abi,
              functionName: 'tokenURI',
              args: [tokenId],
            });
            const metadataResponse = await fetch(
              tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
            );
            const metadata = await metadataResponse.json();
            const isRedeemed = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: VoucherKopiABI.abi,
              functionName: 'isRedeemed',
              args: [tokenId],
            });
            return { tokenId: Number(tokenId), ...metadata, isRedeemed };
          };
          voucherPromises.push(promise());
        }
        const resolvedVouchers = await Promise.all(voucherPromises);
        setUserVouchers(resolvedVouchers.reverse());
      } catch (e) {
        console.error('Gagal mengambil detail voucher:', e);
        setMessage('Gagal memuat detail voucher.');
        setMessageSeverity('error');
      } finally {
        setIsFetchingVouchers(false);
      }
    };
    fetchVouchers();
  }, [balanceData, isConnected, address, publicClient]);

  const mintVoucher = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VoucherKopiABI.abi,
      functionName: 'mintVoucher',
      args: [address, VOUCHER_METADATA_URI],
    });
  };

  const redeemVoucher = (tokenId) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VoucherKopiABI.abi,
      functionName: 'redeemVoucher',
      args: [BigInt(tokenId)],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      setMessage('Transaksi berhasil! Koleksi Anda akan diperbarui.');
      setMessageSeverity('success');
      refetchBalance();
      setTimeout(() => setMessage(''), 5000);
    }
    if (writeError) {
      const errorMessage = writeError.shortMessage || writeError.message;
      setMessage(`Error: ${errorMessage.split('(')[0]}`);
      setMessageSeverity('error');
      setTimeout(() => setMessage(''), 5000);
    }
  }, [isConfirmed, writeError, refetchBalance]);

  const isLoading = isPending || isConfirming || isFetchingVouchers;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            Voucher Kopi ☕
          </Typography>
          <ConnectWalletButton />
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {isConnected ? (
          <main>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={mintVoucher}
                disabled={isLoading}
              >
                {isPending
                  ? 'Menunggu...'
                  : isConfirming
                    ? 'Konfirmasi...'
                    : 'Buat Voucher Baru'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => refetchBalance()}
                disabled={isLoading}
              >
                Segarkan Koleksi
              </Button>
            </Box>

            {message && (
              <Alert severity={messageSeverity} sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            {isLoading && (
              <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
            )}

            <VoucherGallery
              vouchers={userVouchers}
              onRedeem={redeemVoucher}
              isLoading={isLoading}
            />
          </main>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h5">
              Silakan sambungkan dompet Anda untuk memulai.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
