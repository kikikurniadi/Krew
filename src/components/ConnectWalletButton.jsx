
import React from 'react';
import { Button } from '@mui/material';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';

function ConnectWalletButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    open();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (isConnected) {
    return (
      <Button variant="contained" color="secondary" onClick={handleDisconnect}>
        {`Disconnect ${truncateAddress(address)}`}
      </Button>
    );
  }

  return (
    <Button variant="contained" color="primary" onClick={handleConnect}>
      Connect Wallet
    </Button>
  );
}

export default ConnectWalletButton;
