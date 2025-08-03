
import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  LinearProgress,
} from '@mui/material';
import { contractAddress, contractAbi, mintVoucher } from '../utils/contract';
import ConnectWalletButton from '../components/ConnectWalletButton';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// !!! PERINGATAN KEAMANAN !!!
// Kunci API Pinata ini seharusnya TIDAK disimpan di frontend dalam aplikasi produksi.
// Ini hanya untuk tujuan demonstrasi. Gunakan backend proxy atau serverless function
// untuk mengelola kunci API Anda secara aman.
const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMzZmZGRhYi00M2I4LTRlYjAtOWI3YS03MGI4MGM2OGMwYjQiLCJlbWFpbCI6ImZ1YWRoYWZpZHphbjAxNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMWExN2U5MDBjMTA5MjhhZWU5NTciLCJzY29wZWRLZXlTZWNyZXQiOiI1MTQ1YmYxOTRjY2YzNjliZmM0YjBjYmU2YmZkNmY1NjllMjk5MGIxYTZmOTY2OGViMGUzMGE0YWE5NmI4MmM0IiwiaWF0IjoxNzE2ODg5ODQ2fQ.yY2o1sXn70AAY_0wXN5N0qM2r1F0iHq4DkuyGWWq5WQ';

function OwnerDashboard() {
  const { address, isConnected } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [loadingOwnerCheck, setLoadingOwnerCheck] = useState(true);

  // Form state
  const [recipient, setRecipient] = useState('');
  const [voucherType, setVoucherType] = useState(0);
  const [voucherName, setVoucherName] = useState('');
  const [voucherDescription, setVoucherDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // UI state
  const [uploading, setUploading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Wagmi hook untuk mendapatkan pemilik kontrak
  const { data: ownerAddress } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'owner',
  });

  // Efek untuk memeriksa apakah pengguna saat ini adalah pemilik kontrak
  useEffect(() => {
    if (isConnected && ownerAddress) {
      setIsOwner(address.toLowerCase() === ownerAddress.toLowerCase());
      setLoadingOwnerCheck(false);
    } else {
        setLoadingOwnerCheck(false);
    }
  }, [address, ownerAddress, isConnected]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleMint = async () => {
    if (!selectedFile || !recipient || !voucherName || !voucherDescription) {
      setNotification({ open: true, message: 'Harap isi semua kolom dan pilih gambar.', severity: 'warning' });
      return;
    }

    try {
      setUploading(true);
      setNotification({ open: true, message: 'Mengunggah gambar ke IPFS via Pinata...', severity: 'info' });
      
      // 1. Unggah gambar ke IPFS
      const fileData = new FormData();
      fileData.append('file', selectedFile);
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: fileData,
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
      });
      const imageUri = `ipfs://${resFile.data.IpfsHash}`;
      
      setNotification({ open: true, message: 'Mengunggah metadata ke IPFS...', severity: 'info' });

      // 2. Unggah metadata JSON ke IPFS
      const metadata = {
        name: voucherName,
        description: voucherDescription,
        image: imageUri
      };
      const resJson = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: metadata,
        headers: {
            'Authorization': `Bearer ${PINATA_JWT}`,
        },
      });
      const metadataUri = `ipfs://${resJson.data.IpfsHash}`;
      
      setUploading(false);
      setMinting(true);
      setNotification({ open: true, message: 'Menunggu konfirmasi dompet untuk minting...', severity: 'info' });

      // 3. Panggil fungsi mintVoucher di smart contract
      const tx = await mintVoucher(recipient, metadataUri, voucherType);
      
      setNotification({ open: true, message: `Transaksi minting dikirim! Hash: ${tx.hash}`, severity: 'info' });

      // Menunggu transaksi selesai
      // Di aplikasi nyata, Anda bisa menggunakan `useWaitForTransactionReceipt`
      await tx.wait();

      setNotification({ open: true, message: 'Voucher berhasil di-mint!', severity: 'success' });
      // Reset form
      setRecipient('');
      setVoucherName('');
      setVoucherDescription('');
      setSelectedFile(null);

    } catch (error) {
      console.error('Gagal saat minting:', error);
      const errorMessage = error.response?.data?.error || error.shortMessage || error.message || "Terjadi kesalahan.";
      setNotification({ open: true, message: `Gagal: ${errorMessage}`, severity: 'error' });
    } finally {
      setUploading(false);
      setMinting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: '', severity: 'info' });
  };

  // Tampilan awal saat memeriksa status kepemilikan
  if (loadingOwnerCheck) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  // Tampilan jika dompet tidak terhubung
  if (!isConnected) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 5 }}>
        <Alert severity="warning">Harap hubungkan dompet Anda untuk mengakses dasbor pemilik.</Alert>
        <ConnectWalletButton />
      </Container>
    );
  }

  // Tampilan jika pengguna bukan pemilik
  if (!isOwner) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 5 }}>
        <Alert severity="error">Akses Ditolak. Halaman ini hanya untuk pemilik smart contract.</Alert>
      </Container>
    );
  }

  // Tampilan utama dasbor pemilik
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Dasbor Pemilik
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Selamat datang, pemilik. Gunakan alat di bawah ini untuk mencetak (mint) voucher kopi baru sebagai NFT.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Alamat Dompet Penerima"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Jenis Voucher</InputLabel>
              <Select
                value={voucherType}
                label="Jenis Voucher"
                onChange={(e) => setVoucherType(e.target.value)}
              >
                <MenuItem value={0}>Espresso</MenuItem>
                <MenuItem value={1}>Cappuccino</MenuItem>
                <MenuItem value={2}>Luwak</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: '100%' }}
              startIcon={<UploadFileIcon />}
            >
              Pilih Gambar
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
            {selectedFile && <Typography variant="caption" sx={{mt:1}}>{selectedFile.name}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nama Voucher"
              value={voucherName}
              onChange={(e) => setVoucherName(e.target.value)}
              placeholder="Contoh: Kopi Spesial Edisi Terbatas"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Deskripsi Voucher"
              multiline
              rows={4}
              value={voucherDescription}
              onChange={(e) => setVoucherDescription(e.target.value)}
              placeholder="Deskripsikan keunikan voucher ini..."
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleMint}
              disabled={uploading || minting}
            >
              {uploading ? 'Mengunggah...' : (minting ? 'Minting...' : 'Mint Voucher Baru')}
            </Button>
            {(uploading || minting) && <LinearProgress sx={{ mt: 1 }} />}
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default OwnerDashboard;
