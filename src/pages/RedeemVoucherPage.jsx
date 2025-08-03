
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { redeemVoucherByOwner } from '../utils/contract';
import { ethers } from 'ethers';

const RedeemVoucherPage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [redeeming, setRedeeming] = useState(false);
    const [redeemStatus, setRedeemStatus] = useState('');

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'qr-reader', 
            {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 5,
            },
            false // verbose
        );

        let isScanning = true;

        function onScanSuccess(decodedText, decodedResult) {
            if (isScanning) {
                isScanning = false; // Prevent multiple triggers
                scanner.clear();
                setScanResult(decodedText);
                handleRedeem(decodedText);
            }
        }

        function onScanFailure(error) {
            // console.warn(`Code scan error = ${error}`);
        }

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            if (scanner) {
                scanner.clear().catch(err => {
                    console.error("Failed to clear html5-qrcode-scanner.", err);
                });
            }
        };
    }, []);

    const handleRedeem = async (qrData) => {
        setRedeeming(true);
        setError(null);
        setRedeemStatus('Mencoba menukarkan voucher...');

        try {
            // Asumsi data QR adalah JSON string: {"tokenId": "1", "signature": "0x..."}
            const { tokenId, signature } = JSON.parse(qrData);

            if (!tokenId || !signature) {
                throw new Error("Data Kode QR tidak valid.");
            }
            
            console.log(`Menukarkan Token ID: ${tokenId} dengan Tanda Tangan: ${signature}`);

            const tx = await redeemVoucherByOwner(tokenId, signature);
            await tx.wait();

            setRedeemStatus(`Voucher dengan Token ID ${tokenId} berhasil ditukarkan!`);

        } catch (err) {
            console.error("Gagal menukarkan voucher:", err);
            const errorMessage = err.reason || err.message || "Terjadi kesalahan yang tidak diketahui.";
            setError(`Gagal menukarkan voucher: ${errorMessage}`);
            setRedeemStatus('');
        } finally {
            setRedeeming(false);
        }
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Pindai Kode QR Voucher</h1>
            <div id="qr-reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
            {scanResult && <p>Data Terpindai: {scanResult}</p>}
            {redeeming && <p>{redeemStatus}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {redeemStatus && !redeeming && <p style={{ color: 'green' }}>{redeemStatus}</p>}
        </div>
    );
};

export default RedeemVoucherPage;
