import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as wagmi from 'wagmi';
import { contractAddress, contractAbi } from '../utils/contract';
import DappPage from '../pages/DappPage';
import { WagmiProvider } from 'wagmi'
import { config } from '../test/setup'

const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

vi.mock('wagmi', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        useAccount: vi.fn(() => ({ address: ownerAddress, isConnected: true })),
        useReadContracts: vi.fn(),
        useWriteContract: vi.fn(() => ({ writeContract: vi.fn() })),
    };
});


describe('DappPage Component - Redemption Flow', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Skenario Lengkap: Menebus voucher dari klik hingga pemanggilan kontrak', async () => {
        
        wagmi.useReadContracts.mockReturnValue({ 
            data: [ { result: 1n }, { result: 1n } ], // [totalSupply, tokenByIndex]
            isLoading: false,
        });

        render(
            <WagmiProvider config={config}>
                <DappPage />
            </WagmiProvider>
        );
        
        // Tunggu hingga VoucherCard dirender
        await waitFor(() => {
            expect(screen.getAllByTestId('voucher-card').length).toBeGreaterThan(0);
        });

        // Klik tombol "Gunakan" pada kartu voucher pertama
        const redeemButton = screen.getByText('Gunakan');
        fireEvent.click(redeemButton);

        // Dialog konfirmasi akan muncul
        await waitFor(() => {
            expect(screen.getByText('Konfirmasi Penukaran Voucher')).toBeInTheDocument();
        });

        // Klik tombol "Konfirmasi" pada dialog
        const confirmButton = screen.getByText('Konfirmasi');
        fireEvent.click(confirmButton);

        // Verifikasi bahwa fungsi `redeemVoucher` dipanggil
        await waitFor(() => {
            const { writeContract } = wagmi.useWriteContract();
            expect(writeContract).toHaveBeenCalled();
        });
    });
});
