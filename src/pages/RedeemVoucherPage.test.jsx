import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Html5QrcodeScanner } from 'html5-qrcode';
import * as wagmi from 'wagmi';
import RedeemVoucherPage from '../pages/RedeemVoucherPage';
import { WagmiProvider } from 'wagmi'
import { config } from '../test/setup'

const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// Menyiapkan mock untuk fungsi render dari scanner
let mockOnScanSuccess;
const mockRender = vi.fn((onScanSuccess, onScanError) => {
    mockOnScanSuccess = onScanSuccess;
});
Html5QrcodeScanner.mockImplementation(() => ({
    render: mockRender,
    clear: vi.fn(),
}));

vi.mock('wagmi', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        useAccount: vi.fn(() => ({ address: ownerAddress, isConnected: true })),
        useWriteContract: vi.fn(() => ({ writeContract: vi.fn(), isSuccess: false, isError: false })),
    };
});

describe('RedeemVoucherPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('seharusnya merender pemindai QR pada awalnya', () => {
        render(
            <WagmiProvider config={config}>
                <RedeemVoucherPage />
            </WagmiProvider>
        );
        expect(mockRender).toHaveBeenCalled();
        expect(screen.getByText('Pindai Kode QR Voucher')).toBeInTheDocument();
    });
    
    it('seharusnya memanggil fungsi redeem pada kontrak saat kode QR berhasil dipindai', async () => {
        const { writeContract } = wagmi.useWriteContract();
        render(
            <WagmiProvider config={config}>
                <RedeemVoucherPage />
            </WagmiProvider>
        );

        const decodedText = '1'; 
        mockOnScanSuccess(decodedText, {});

        await waitFor(() => {
            expect(screen.getByText(`Konfirmasi Penukaran Voucher #${decodedText}`)).toBeInTheDocument();
        });
        
        fireEvent.click(screen.getByText('Konfirmasi'));

        await waitFor(() => {
            expect(writeContract).toHaveBeenCalled();
        });
    });
    
    it('seharusnya menampilkan pesan sukses setelah penukaran berhasil', async () => {
        wagmi.useWriteContract.mockReturnValue({ writeContract: vi.fn(), isSuccess: true, isError: false });
        render(
            <WagmiProvider config={config}>
                <RedeemVoucherPage />
            </WagmiProvider>
        );

        mockOnScanSuccess('1', {});

        await waitFor(() => {
            fireEvent.click(screen.getByText('Konfirmasi'));
        });
        
        await waitFor(() => {
            expect(screen.getByText('Voucher berhasil ditukarkan!')).toBeInTheDocument();
        });
    });
    
    it('seharusnya menampilkan pesan error jika terjadi kesalahan saat penukaran', async () => {
        wagmi.useWriteContract.mockReturnValue({ writeContract: vi.fn(), isSuccess: false, isError: true });
        render(
            <WagmiProvider config={config}>
                <RedeemVoucherPage />
            </WagmiProvider>
        );

        mockOnScanSuccess('1', {});

        await waitFor(() => {
            fireEvent.click(screen.getByText('Konfirmasi'));
        });
        
        await waitFor(() => {
            expect(screen.getByText(/Gagal menukarkan voucher./)).toBeInTheDocument();
        });
    });
});
