import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OwnerDashboard from '../pages/OwnerDashboard';
import { useAccount, useReadContract } from 'wagmi';
import { render } from '../test/test-utils'; // Corrected path
import { WagmiProvider } from 'wagmi'
import { config } from '../test/setup'

// Mock wagmi hooks
vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAccount: vi.fn(),
    useReadContract: vi.fn(),
    useWriteContract: vi.fn(() => ({
      writeContract: vi.fn(),
    })),
  };
});


// Mock contract utilities
vi.mock('../utils/contract', () => ({
  contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  contractAbi: [],
  mintVoucher: vi.fn(),
}));

describe('OwnerDashboard', () => {
  const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Alamat owner default hardhat

  it('harus menampilkan form pembuatan voucher jika pengguna terhubung adalah pemilik', () => {
    // Arrange
    useAccount.mockReturnValue({ address: ownerAddress, isConnected: true });
    useReadContract.mockReturnValue({ data: ownerAddress, isSuccess: true });

    // Act
    render(
      <WagmiProvider config={config}>
        <OwnerDashboard />
      </WagmiProvider>
    );

    // Assert
    expect(screen.getByText(/Dasbor Pemilik/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Alamat Dompet Penerima/i)).toBeInTheDocument();
  });

  it('harus menampilkan "Akses Ditolak" jika pengguna terhubung bukan pemilik', () => {
    // Arrange
    const notOwnerAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    useAccount.mockReturnValue({ address: notOwnerAddress, isConnected: true });
    useReadContract.mockReturnValue({ data: ownerAddress, isSuccess: true });

    // Act
    render(
      <WagmiProvider config={config}>
        <OwnerDashboard />
      </WagmiProvider>
    );

    // Assert
    expect(screen.getByText(/Akses Ditolak/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dasbor Pemilik/i)).not.toBeInTheDocument();
  });

  it('harus meminta untuk menghubungkan dompet jika tidak terhubung', () => {
    // Arrange
    useAccount.mockReturnValue({ address: undefined, isConnected: false });
    useReadContract.mockReturnValue({ data: ownerAddress, isSuccess: true });

    // Act
    render(
      <WagmiProvider config={config}>
        <OwnerDashboard />
      </WagmiProvider>
    );

    // Assert
    expect(screen.getByText(/Harap hubungkan dompet Anda/i)).toBeInTheDocument();
  });
});
