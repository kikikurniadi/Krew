import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom'; // <--- Impor BrowserRouter
import DappPage from './DappPage';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from 'wagmi';

// Mock hooks dari wagmi
vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAccount: vi.fn(),
    useConnect: vi.fn(),
    useDisconnect: vi.fn(),
    useReadContract: vi.fn(),
    useWriteContract: vi.fn(),
    useWaitForTransactionReceipt: vi.fn(),
    usePublicClient: vi.fn(),
  };
});

// Mocking dialog methods
HTMLDialogElement.prototype.showModal = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();

// Setup Wagmi config & QueryClient untuk provider
const queryClient = new QueryClient();
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// PERBAIKAN: Bungkus dengan BrowserRouter
const Wrapper = ({ children }) => (
  <BrowserRouter>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  </BrowserRouter>
);

describe('DappPage Component - Redemption Flow', () => {
  const mockWriteContract = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAccount).mockReturnValue({
      address: '0xTestUser',
      isConnected: true,
    });
    vi.mocked(useConnect).mockReturnValue({ connect: vi.fn() });
    vi.mocked(useDisconnect).mockReturnValue({ disconnect: vi.fn() });

    vi.mocked(useReadContract).mockImplementation(({ functionName }) => {
      if (functionName === 'balanceOf') {
        return { data: 1n, refetch: vi.fn() };
      }
      return { data: undefined };
    });
    
    vi.mocked(usePublicClient).mockReturnValue({
        readContract: vi.fn().mockImplementation(({ functionName, args }) => {
            if (functionName === 'tokenOfOwnerByIndex') return Promise.resolve(1n);
            if (functionName === 'tokenURI') return Promise.resolve('ipfs://dummyhash');
            if (functionName === 'isRedeemed') return Promise.resolve(false);
            return Promise.resolve();
        }),
    });
    
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ name: 'Kopi Enak', description: 'Deskripsi Kopi' }),
      })
    );

    vi.mocked(useWriteContract).mockReturnValue({
      writeContract: mockWriteContract,
      data: null,
      isPending: false,
      error: null,
      reset: vi.fn(),
    });

    vi.mocked(useWaitForTransactionReceipt).mockReturnValue({
      isLoading: false,
      isSuccess: false,
    });
  });

  it('Skenario Lengkap: Menebus voucher dari klik hingga pemanggilan kontrak', async () => {
    render(<DappPage />, { wrapper: Wrapper });

    const voucherName = await screen.findByText('Kopi Enak');
    expect(voucherName).toBeInTheDocument();

    const useButton = screen.getByRole('button', { name: /Gunakan/i });
    fireEvent.click(useButton);

    const dialogTitle = await screen.findByText('Konfirmasi Penggunaan');
    expect(dialogTitle).toBeInTheDocument();
    expect(screen.getByText('Gunakan voucher "Kopi Enak"?')).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /Konfirmasi/i, hidden: true });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockWriteContract).toHaveBeenCalledTimes(1);
      expect(mockWriteContract).toHaveBeenCalledWith({
        address: '0xFf687ac2B8858681A58ec2aF6D4e143d20f449Cf',
        abi: expect.any(Array),
        functionName: 'redeemVoucher',
        args: [1n],
      });
    });
  });
});
