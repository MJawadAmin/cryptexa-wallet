import { useCallback, useEffect, useState } from 'react';
import { useWeb3Store } from '../store/web3-wallet-store';
import { web3WalletService } from '../services/Web3WalletService';

/**
 * Custom hook for Web3 wallet connection
 */
export const useWeb3Wallet = () => {
  const {
    address,
    balance,
    network,
    isConnected,
    chainId,
    error: storeError,
    connect: storeConnect,
    disconnect: storeDisconnect,
    setBalance,
    setNetwork,
    setError,
  } = useWeb3Store();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  /**
   * Connect wallet
   */
  const connect = useCallback(async () => {
    if (!web3WalletService.isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install it to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const { address: walletAddress, chainId: chain } = await web3WalletService.connect();
      storeConnect(walletAddress, chain);

      // Set network name
      const networkName = web3WalletService.getNetworkName(chain);
      setNetwork(networkName);

      // Get balance
      const walletBalance = await web3WalletService.getBalance(walletAddress);
      setBalance(walletBalance);
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [storeConnect, setBalance, setNetwork, setError]);

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback(() => {
    web3WalletService.disconnect();
    storeDisconnect();
  }, [storeDisconnect]);

  /**
   * Refresh balance
   */
  const refreshBalance = useCallback(async () => {
    if (!address) return;

    setIsLoadingBalance(true);
    try {
      const newBalance = await web3WalletService.getBalance(address);
      setBalance(newBalance);
    } catch (err: any) {
      console.error('Error refreshing balance:', err);
      setError('Failed to refresh balance');
    } finally {
      setIsLoadingBalance(false);
    }
  }, [address, setBalance, setError]);

  /**
   * Switch network
   */
  const switchNetwork = useCallback(
    async (targetChainId: number) => {
      try {
        await web3WalletService.switchNetwork(targetChainId);
      } catch (err: any) {
        console.error('Error switching network:', err);
        setError(err.message || 'Failed to switch network');
      }
    },
    [setError]
  );

  /**
   * Auto-reconnect on mount if previously connected
   */
  useEffect(() => {
    if (isConnected && address && !isConnecting) {
      // Verify connection is still valid
      refreshBalance();
    }
  }, []);

  /**
   * Format address for display (shortened)
   */
  const formatAddress = useCallback((addr: string | null): string => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  return {
    // State
    address,
    balance,
    network,
    isConnected,
    chainId,
    error: storeError,
    isConnecting,
    isLoadingBalance,

    // Actions
    connect,
    disconnect,
    refreshBalance,
    switchNetwork,
    formatAddress,

    // Utilities
    isMetaMaskInstalled: web3WalletService.isMetaMaskInstalled(),
  };
};
