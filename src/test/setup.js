import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { mock } from 'vitest-mock-extended';
import { mainnet, sepolia } from 'wagmi/chains';
import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors'

// Mocking wagmi connector
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

// Mocking axios
vi.mock('axios');

// Mocking html5-qrcode
vi.mock('html5-qrcode', () => ({
  Html5QrcodeScanner: vi.fn().mockImplementation(() => ({
    render: vi.fn(),
    clear: vi.fn(),
  })),
}));

// Mocking matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});


// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
