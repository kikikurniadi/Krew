
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, ThemeProvider } from '@mui/material';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import DappPage from './pages/DappPage';
import ProfilePage from './pages/ProfilePage';
import OwnerDashboard from './pages/OwnerDashboard';
import VoucherDetailPage from './pages/VoucherDetailPage';
import RedeemVoucherPage from './pages/RedeemVoucherPage';
import NotFoundPage from './pages/NotFoundPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = 'e898f8a8b1323f6563e41427215c4c1a';


// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  themeMode: 'light',
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dapp" element={<DappPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/owner-dashboard" element={<OwnerDashboard />} />
                <Route path="/voucher/:tokenId" element={<VoucherDetailPage />} />
                <Route path="/redeem-voucher" element={<RedeemVoucherPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Container>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
