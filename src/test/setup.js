import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Membersihkan jsdom setelah setiap tes
afterEach(() => {
  cleanup();
});

// --- Mocking Terpusat ---

// 1. Mock 'react-router-dom'
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ tokenId: '1' }), // Selalu gunakan tokenId '1'
    useNavigate: () => vi.fn(),
  };
});

// 2. Mock 'wagmi' dengan kontrol eksternal
const mockAccount = vi.fn();
const mockReadContract = vi.fn();
const mockWriteContract = vi.fn(() => ({ writeContract: vi.fn(), isPending: false, error: null }));

vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    useAccount: mockAccount,
    useReadContract: mockReadContract,
    useWriteContract: mockWriteContract,
    useWaitForTransactionReceipt: () => ({ isLoading: false, isSuccess: false }),
  };
});

// 3. Ekspor fungsi untuk mengontrol mock dari dalam file tes
export const setMockAccount = (account) => mockAccount.mockReturnValue(account);
export const setMockReadContract = (implementation) => mockReadContract.mockImplementation(implementation);
export const setMockWriteContract = (implementation) => mockWriteContract.mockImplementation(implementation);

// 4. Mock global 'fetch'
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
        name: 'Kopi Uji Coba',
        description: 'Deskripsi untuk tes.',
        image: 'test.jpg'
    }),
  })
);
