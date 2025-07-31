import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

import VoucherKopiABI from '../VoucherKopi.json';
// DIUBAH: Path impor diperbaiki
import TransferDialog from '../components/TransferDialog.jsx'; 
import './VoucherDetailPage.css';

const PIXEL_ART_COFFEE_CUP = "https://art.pixilart.com/sr244b76e199d26.png";
const CONTRACT_ADDRESS = '0xFf687ac2B8858681A58ec2aF6D4e143d20f449Cf';

const VoucherDetailPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();

  const [metadata, setMetadata] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [isTransferDialogOpen, setTransferDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', severity: 'info' });

  const { data: hash, error: writeError, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  
  const { data: tokenURI, error: uriError, isLoading: isLoadingURI } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VoucherKopiABI.abi,
    functionName: 'tokenURI',
    args: [BigInt(tokenId)],
  });

  const { data: isRedeemed } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VoucherKopiABI.abi,
    functionName: 'isRedeemed',
    args: [BigInt(tokenId)],
  });

  const { data: ownerOfToken } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VoucherKopiABI.abi,
    functionName: 'ownerOf',
    args: [BigInt(tokenId)],
  });
  
  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI) {
        setFetchError('');
        try {
          const response = await fetch(tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'));
          if (!response.ok) throw new Error('Gagal mengambil metadata.');
          const data = await response.json();
          setMetadata(data);
        } catch (error) {
          console.error(error); setFetchError(error.message);
        }
      }
    };
    fetchMetadata();
  }, [tokenURI]);

  const handleConfirmTransfer = (recipientAddress) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VoucherKopiABI.abi,
      functionName: 'safeTransferFrom',
      args: [address, recipientAddress, BigInt(tokenId)],
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      setNotification({ show: true, message: 'Transfer berhasil! Kembali ke galeri...', severity: 'success' });
      setTimeout(() => navigate('/app'), 3000);
    }
    if (writeError) {
      setNotification({ show: true, message: `Transfer gagal: ${writeError.shortMessage || writeError.message}`, severity: 'error' });
      setTransferDialogOpen(false);
    }
  }, [isConfirmed, writeError, navigate]);

  const isLoading = isLoadingURI || isPending || isConfirming;
  const isOwner = isConnected && ownerOfToken && address === ownerOfToken;
  
  const getNotificationClass = (severity) => {
    if (severity === 'success') return 'is-success';
    if (severity === 'error') return 'is-error';
    return 'is-primary';
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <p>Memuat detail voucher...</p>
          <progress className="nes-progress is-pattern" value="100" max="100"></progress>
        </div>
      );
    }
    const error = uriError || fetchError;
    if (error) {
      return <div className="nes-container"><p className="nes-text is-error">Error: {error.message || error}</p></div>;
    }
    if (!metadata) {
      return <div className="nes-container"><p>Tidak ada data untuk ditampilkan.</p></div>;
    }

    return (
      <div className="nes-container with-title">
        <p className="title">{metadata.name}</p>
        <div className="detail-content">
          <img src={PIXEL_ART_COFFEE_CUP} alt={metadata.name} className="detail-image"/>
          <div className="detail-info">
            <span className={`nes-badge ${isRedeemed ? 'is-error' : 'is-success'}`}>
              <span className={isRedeemed ? 'is-error' : 'is-success'}>{isRedeemed ? 'Telah Digunakan' : 'Aktif'}</span>
            </span>
            <p className="description">{metadata.description}</p>
            <div className="nes-container is-rounded owner-info">
              <p>Pemilik: <span className="nes-text is-primary">{ownerOfToken}</span></p>
            </div>
            {isOwner && (
              <button 
                type="button" 
                className={`nes-btn is-warning ${isRedeemed || isLoading ? 'is-disabled' : ''}`}
                onClick={() => setTransferDialogOpen(true)}
                disabled={isRedeemed || isLoading}
              >
                Kirim / Transfer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
        <button type="button" className="nes-btn" onClick={() => navigate('/app')}>
          &lt; Kembali
        </button>

        {notification.show && (
          <div className={`nes-text ${getNotificationClass(notification.severity)} notification-bar`}>
            {notification.message}
          </div>
        )}

        <div className="content-wrapper">
          {renderContent()}
        </div>

        <TransferDialog
          open={isTransferDialogOpen}
          onClose={() => !isLoading && setTransferDialogOpen(false)}
          onConfirm={handleConfirmTransfer}
          isLoading={isPending || isConfirming}
        />
    </div>
  );
};

export default VoucherDetailPage;
