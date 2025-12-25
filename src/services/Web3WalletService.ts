import { BrowserProvider, formatEther } from 'ethers';
import { useWeb3Store } from '../store/web3-wallet-store';

/**
 * Web3 Wallet Service for MetaMask Integration
 */
class Web3WalletService {
  private provider: BrowserProvider | null = null;

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  /**
   * Get network name from chain ID
   */
  getNetworkName(chainId: number): string {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      56: 'BSC Mainnet',
      97: 'BSC Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
      43114: 'Avalanche C-Chain',
      43113: 'Avalanche Fuji Testnet',
      250: 'Fantom Opera',
      4002: 'Fantom Testnet',
      42161: 'Arbitrum One',
      421613: 'Arbitrum Goerli',
      10: 'Optimism',
      420: 'Optimism Goerli',
    };

    return networks[chainId] || `Chain ID: ${chainId}`;
  }

  /**
   * Connect to MetaMask wallet
   */
  async connect(): Promise<{ address: string; chainId: number }> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install it to continue.');
    }

    try {
      this.provider = new BrowserProvider(window.ethereum);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please check your MetaMask.');
      }

      const address = accounts[0];

      // Get chain ID
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);

      // Setup event listeners
      this.setupEventListeners();

      return { address, chainId };
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      throw new Error(error.message || 'Failed to connect to MetaMask');
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized. Please connect first.');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get wallet balance');
    }
  }

  /**
   * Setup event listeners for account and network changes
   */
  private setupEventListeners(): void {
    if (!window.ethereum) return;

    // Handle account changes
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        useWeb3Store.getState().disconnect();
      } else {
        // Account changed
        const newAddress = accounts[0];
        const currentChainId = useWeb3Store.getState().chainId;
        if (currentChainId) {
          useWeb3Store.getState().connect(newAddress, currentChainId);
          this.updateBalance(newAddress);
        }
      }
    });

    // Handle chain changes
    window.ethereum.on('chainChanged', (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      const address = useWeb3Store.getState().address;
      
      if (address) {
        useWeb3Store.getState().setChainId(chainId);
        useWeb3Store.getState().setNetwork(this.getNetworkName(chainId));
        this.updateBalance(address);
      }
    });

    // Handle disconnection
    window.ethereum.on('disconnect', () => {
      useWeb3Store.getState().disconnect();
    });
  }

  /**
   * Update balance in store
   */
  private async updateBalance(address: string): Promise<void> {
    try {
      const balance = await this.getBalance(address);
      useWeb3Store.getState().setBalance(balance);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.provider = null;
    useWeb3Store.getState().disconnect();
  }

  /**
   * Switch to a specific network
   */
  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        throw new Error('This network is not available in your MetaMask. Please add it first.');
      }
      throw error;
    }
  }

  /**
   * Get current provider
   */
  getProvider(): BrowserProvider | null {
    return this.provider;
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Export singleton instance
export const web3WalletService = new Web3WalletService();
export default web3WalletService;
