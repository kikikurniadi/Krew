import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as wagmi from 'wagmi';
import VoucherDetailPage from '../pages/VoucherDetailPage';
import { contractAddress, contractAbi } from '../utils/contract';
import { WagmiProvider } from 'wagmi'
import { config } from '../test/setup'

const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const notOwnerAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

// Mock useParams
vi.mock('react-router-dom', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        useParams: () => ({ tokenId: '1' }),
    };
});

describe('VoucherDetailPage Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Mocking useAccount hook
        vi.spyOn(wagmi, 'useAccount').mockReturnValue({ address: ownerAddress, isConnected: true });
    });

    const setupMocks = (currentOwner) => {
        vi.spyOn(wagmi, 'useReadContract')
            .mockReturnValueOnce({ data: currentOwner, isSuccess: true })
            .mockReturnValueOnce({ data: 'ipfs://testhash', isSuccess: true });
    };

    it('Skenario A: TIDAK menampilkan tombol transfer jika pengguna bukan pemilik', async () => {
        setupMocks(notOwnerAddress); // Voucher dimiliki oleh orang lain
        render(
            <WagmiProvider config={config}>
                <VoucherDetailPage />
            </WagmiProvider>
        );
        
        await waitFor(() => {
            // VoucherCard seharusnya muncul
            expect(screen.getByTestId('voucher-card')).toBeInTheDocument();
        });

        expect(screen.queryByText('Transfer Voucher')).not.toBeInTheDocument();
    });

    it('Skenario B: MENAMPILKAN tombol transfer jika pengguna adalah pemilik', async () => {
        setupMocks(ownerAddress); // Voucher dimiliki oleh pengguna saat ini
        render(
            <WagmiProvider config={config}>
                <VoucherDetailPage />
            </WagmiProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Transfer Voucher')).toBeInTheDocument();
        });
    });

    it('Skenario C: Membuka dialog transfer saat tombol diklik oleh pemilik', async () => {
        setupMocks(ownerAddress);
        render(
            <WagmiProvider config={config}>
                <VoucherDetailPage />
            </WagmiProvider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByText('Transfer Voucher'));
        });
        
        await waitFor(() => {
            expect(screen.getByText('Transfer Voucher NFT')).toBeInTheDocument();
            expect(screen.getByLabelText('Alamat Penerima')).toBeInTheDocument();
        });
    });
});
