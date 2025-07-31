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

// Komponen lokal yang sudah direfaktor
import VoucherKopiABI from '../VoucherKopi.json';
import VoucherGallery from '../components/VoucherGallery.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

// Hapus import MUI, ganti dengan CSS kustom jika perlu
import './DappPage.css';

const CONTRACT_ADDRESS = '0xFf687ac2B8858681A58ec2aF6D4e143d20f449Cf';
const VOUCHER_METADATA_URI =
  'https://gateway.pinata.cloud/ipfs/QmaS5p6WkVeJk3j2VpSwD8r2h4a4J1Y3vPwaHhWterK1sH';

// Komponen Tombol Koneksi Kustom dengan NES.css
const ConnectWalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="wallet-info">
        <span className="nes-text is-success account-address">
          {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
        </span>
        <button type="button" className="nes-btn is-error" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }
  return (
    <button type="button" className="nes-btn is-primary" onClick={() => connect({ connector: injected() })}>
      Connect Wallet
    </button>
  );
};

function DappPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: hash, error: writeError, isPending, writeContract, reset } = useWriteContract();

  const [userVouchers, setUserVouchers] = useState([]);
  const [isFetchingVouchers, setIsFetchingVouchers] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ text: '', severity: 'info' });
  const [voucherToRedeem, setVoucherToRedeem] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: VoucherKopiABI.abi,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: isConnected },
  });

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!isConnected || !publicClient || balanceData === undefined || Number(balanceData) === 0) {
        setUserVouchers([]); return;
      }
      setIsFetchingVouchers(true);
      try {
        const balance = Number(balanceData);
        const voucherPromises = Array.from({ length: balance }, (_, i) => async () => {
            const tokenId = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi: VoucherKopiABI.abi, functionName: 'tokenOfOwnerByIndex', args: [address, i] });
            const tokenURI = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi: VoucherKopiABI.abi, functionName: 'tokenURI', args: [tokenId] });
            const metadataResponse = await fetch(tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'));
            const metadata = await metadataResponse.json();
            const isRedeemed = await publicClient.readContract({ address: CONTRACT_ADDRESS, abi: VoucherKopiABI.abi, functionName: 'isRedeemed', args: [tokenId] });
            return { tokenId: Number(tokenId), ...metadata, isRedeemed };
        });
        const resolvedVouchers = await Promise.all(voucherPromises.map(p => p()));
        setUserVouchers(resolvedVouchers.reverse());
      } catch (e) {
        console.error('Gagal mengambil detail voucher:', e);
        setInfoMessage({ text: 'Gagal memuat detail voucher.', severity: 'error' });
      } finally {
        setIsFetchingVouchers(false);
      }
    };
    fetchVouchers();
  }, [balanceData, isConnected, address, publicClient]);

  const mintVoucher = () => {
    setPendingAction('minting');
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VoucherKopiABI.abi,
      functionName: 'mintVoucher',
      args: [address, VOUCHER_METADATA_URI],
    });
  };

  const handleRedeemClick = (tokenId) => {
    const voucher = userVouchers.find(v => v.tokenId === tokenId);
    setVoucherToRedeem(voucher);
  };

  const confirmRedeemVoucher = () => {
    if (!voucherToRedeem) return;
    setPendingAction('redeeming');
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: VoucherKopiABI.abi,
      functionName: 'redeemVoucher',
      args: [BigInt(voucherToRedeem.tokenId)],
    });
    setVoucherToRedeem(null);
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      setInfoMessage({ text: 'Transaksi berhasil! Koleksi diperbarui.', severity: 'success' });
      refetchBalance();
      setPendingAction(null);
      reset();
      setTimeout(() => setInfoMessage({ text: '', severity: 'info' }), 5000);
    }
    if (writeError) {
      const errorMessage = writeError.shortMessage || writeError.message;
      setInfoMessage({ text: `Error: ${errorMessage.split('(')[0]}`, severity: 'error' });
      setPendingAction(null);
      reset();
      setTimeout(() => setInfoMessage({ text: '', severity: 'info' }), 5000);
    }
  }, [isConfirmed, writeError, refetchBalance, reset]);

  const isLoading = isPending || isConfirming || isFetchingVouchers;
  
  let loadingMessage = '';
  if (isFetchingVouchers) loadingMessage = 'Memuat koleksi voucher...';
  else if (isPending) loadingMessage = 'Buka dompet untuk konfirmasi...';
  else if (isConfirming) loadingMessage = 'Memproses transaksi...';

  const getInfoMessageClass = (severity) => {
    if (severity === 'success') return 'is-success';
    if (severity === 'error') return 'is-error';
    return 'is-primary';
  }

  return (
    <div>
      <header className="app-header">
        <h1><i className="nes-icon cup is-small"></i> Voucher Kopi dApp</h1>
        <ConnectWalletButton />
      </header>

      <main className="app-main">
        {isConnected ? (
          <>
            <section className="nes-container with-title">
              <h2 className="title">Aksi</h2>
              <div className="action-buttons">
                <button type="button" className={`nes-btn is-primary ${isLoading ? 'is-disabled' : ''}`} onClick={mintVoucher} disabled={isLoading}>
                  {isPending && pendingAction === 'minting' ? 'Menunggu...' : 'Buat Voucher Baru'}
                </button>
                <button type="button" className={`nes-btn ${isLoading ? 'is-disabled' : ''}`} onClick={() => refetchBalance()} disabled={isLoading}>
                  Segarkan Koleksi
                </button>
              </div>
            </section>
            
            {(loadingMessage || infoMessage.text) && (
              <div className={`info-message nes-text ${getInfoMessageClass(infoMessage.severity)}`}>
                {isLoading && <progress className="nes-progress is-pattern" value="100" max="100"></progress>}
                <p>{loadingMessage || infoMessage.text}</p>
              </div>
            )}

            <VoucherGallery
              vouchers={userVouchers}
              onRedeem={handleRedeemClick}
              isLoading={isLoading}
            />

            <ConfirmDialog
              open={!!voucherToRedeem}
              onClose={() => setVoucherToRedeem(null)}
              onConfirm={confirmRedeemVoucher}
              title="Konfirmasi Penggunaan"
              message={`Gunakan voucher "${voucherToRedeem?.name}"?`}
            />
          </>
        ) : (
          /* DIUBAH: Hapus is-dark */
          <div className="nes-container is-centered connect-prompt">
            <p>Silakan sambungkan dompet Anda untuk memulai petualangan kopi digital!</p>
            <ConnectWalletButton />
          </div>
        )}
      </main>
    </div>
  );
}

export default DappPage;
