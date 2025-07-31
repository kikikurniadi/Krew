import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import VoucherDetailPage from './VoucherDetailPage';

// Impor fungsi helper dari file setup tes kita
import { setMockAccount, setMockReadContract, setMockWriteContract } from '../test/setup';

// Mocking a getContext method that is not implemented in JSDOM
HTMLCanvasElement.prototype.getContext = () => {};

// Mocking dialog methods for JSDOM environment
HTMLDialogElement.prototype.showModal = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();

describe('VoucherDetailPage Component', () => {

  const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Contoh alamat nyata
  const nonOwnerAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

  // Atur mock sebelum setiap tes dalam suite ini
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    setMockReadContract(({ functionName }) => {
        if (functionName === 'ownerOf') return { data: ownerAddress, isLoading: false };
        if (functionName === 'tokenURI') return { data: 'ipfs://testhash', isLoading: false };
        if (functionName === 'isRedeemed') return { data: false, isLoading: false };
        return { data: undefined, isLoading: false };
    });
    setMockWriteContract(() => ({ writeContract: () => {}, isPending: false, error: null }));
  });

  const renderForUser = (userAddress) => {
    setMockAccount({ address: userAddress, isConnected: true });
    return render(
      <BrowserRouter>
        <VoucherDetailPage />
      </BrowserRouter>
    );
  };
  
  it('Skenario A: TIDAK menampilkan tombol transfer jika pengguna bukan pemilik', async () => {
    renderForUser(nonOwnerAddress);
    await screen.findByText('Kopi Uji Coba');
    const transferButton = screen.queryByRole('button', { name: /Kirim \/ Transfer/i });
    expect(transferButton).not.toBeInTheDocument();
  });

  it('Skenario B: MENAMPILKAN tombol transfer jika pengguna adalah pemilik', async () => {
    renderForUser(ownerAddress);
    await screen.findByText('Kopi Uji Coba');
    const transferButton = screen.getByRole('button', { name: /Kirim \/ Transfer/i });
    expect(transferButton).toBeInTheDocument();
  });

  it('Skenario C: Membuka dialog transfer saat tombol diklik oleh pemilik', async () => {
    renderForUser(ownerAddress);
    await screen.findByText('Kopi Uji Coba');
    const transferButton = screen.getByRole('button', { name: /Kirim \/ Transfer/i });
    
    fireEvent.click(transferButton);
    
    // Since we mocked showModal, we check if it was called
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    
    // We can also check if the dialog content is rendered
    // The dialog title is "Transfer Voucher NFT" in the component
    const dialogTitle = await screen.findByText('Transfer Voucher');
    expect(dialogTitle).toBeInTheDocument();
  });
});
