import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { liskSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';
import { BrowserRouter } from 'react-router-dom'; // 1. Impor BrowserRouter

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import App from './App.jsx';
import './index.css';

const config = createConfig({
  chains: [liskSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [liskSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();
const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter> {/* 2. Bungkus App */}
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
