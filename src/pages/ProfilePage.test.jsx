import React from 'react';
import { render, screen, waitFor } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as wagmi from 'wagmi';
import ProfilePage from '../pages/ProfilePage';
import { contractAddress, contractAbi } from '../utils/contract';
import { WagmiProvider } from 'wagmi'
import { config } from '../test/setup'

// Mock data
const mockAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// Mocking hooks from wagmi
vi.mock('wagmi', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        useAccount: vi.fn(),
        useReadContracts: vi.fn(),
    };
});

describe('ProfilePage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('seharusnya menampilkan alamat pengguna dan saldo saat terhubung', () => {
        wagmi.useAccount.mockReturnValue({ address: mockAddress, isConnected: true });
        wagmi.useReadContracts.mockReturnValue({ data: [ { result: 2n }, { result: 1n } ], isLoading: false }); // [balance, totalSupply]

        render(
            <WagmiProvider config={config}>
                <ProfilePage />
            </WagmiProvider>
        );

        expect(screen.getByText(`Alamat: ${mockAddress}`)).toBeInTheDocument();
        expect(screen.getByText(/Jumlah Voucher Anda: 2/)).toBeInTheDocument();
    });

    it('seharusnya menampilkan pesan "Tidak ada voucher" jika pengguna tidak memiliki voucher', () => {
        wagmi.useAccount.mockReturnValue({ address: mockAddress, isConnected: true });
        wagmi.useReadContracts.mockReturnValue({ data: [ { result: 0n }, { result: 0n } ], isLoading: false });

        render(
            <WagmiProvider config={config}>
                <ProfilePage />
            </WagmiProvider>
        );

        expect(screen.getByText('Anda belum memiliki voucher.')).toBeInTheDocument();
    });

    it('seharusnya menampilkan daftar voucher jika pengguna memilikinya', async () => {
        wagmi.useAccount.mockReturnValue({ address: mockAddress, isConnected: true });
        wagmi.useReadContracts.mockReturnValueOnce({ 
            data: [ { result: 1n }, { result: 1n } ], // [balance, totalSupply]
            isLoading: false,
        }).mockReturnValueOnce({
            data: [ { result: 1n } ], // [tokenOfOwnerByIndex] -> tokenId = 1
            isLoading: false
        });

        render(
            <WagmiProvider config={config}>
                <ProfilePage />
            </WagmiProvider>
        );

        await waitFor(() => {
            // Harusnya ada 1 VoucherCard yang dirender
            expect(screen.getAllByTestId('voucher-card')).toHaveLength(1);
        });
    });

    it('seharusnya menampilkan pesan "Menunggu..." saat data sedang dimuat', () => {
        wagmi.useAccount.mockReturnValue({ address: mockAddress, isConnected: true });
        wagmi.useReadContracts.mockReturnValue({ isLoading: true });

        render(
            <WagmiProvider config={config}>
                <ProfilePage />
            </WagmiProvider>
        );

        expect(screen.getByText(/Menunggu.../)).toBeInTheDocument();
    });
});
