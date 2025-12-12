import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface WalletAccount {
  address: string;
  publicKey: string;
  path: string;
  index: number;
  name: string;
}

interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  symbol: string;
  blockExplorer: string;
}

interface WalletContextType {
  isLocked: boolean;
  isInitialized: boolean;
  currentAccount: WalletAccount | null;
  accounts: WalletAccount[];
  currentNetwork: Network | null;
  balance: string;
  loading: boolean;
  
  createWallet: (password: string) => Promise<{ mnemonic: string; address: string }>;
  importWallet: (mnemonic: string, password: string) => Promise<string>;
  unlockWallet: (password: string) => Promise<boolean>;
  lockWallet: () => Promise<void>;
  switchAccount: (index: number) => Promise<void>;
  createNewAccount: (password: string) => Promise<WalletAccount>;
  switchNetwork: (chainId: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
  sendTransaction: (to: string, amount: string, password: string) => Promise<string>;
  signMessage: (message: string, password: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<WalletAccount | null>(null);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);

  // Initialize wallet state
  useEffect(() => {
    initializeWallet();
  }, []);

  // Refresh balance when account or network changes
  useEffect(() => {
    if (currentAccount && currentNetwork && !isLocked) {
      refreshBalance();
    }
  }, [currentAccount, currentNetwork, isLocked]);

  const sendMessage = async (type: string, data?: any): Promise<any> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type, data }, (response) => {
        resolve(response);
      });
    });
  };

  const initializeWallet = async () => {
    try {
      // Check if wallet exists
      const existsRes = await sendMessage('WALLET_EXISTS');
      setIsInitialized(existsRes.data);

      if (existsRes.data) {
        // Check if locked
        const lockedRes = await sendMessage('IS_LOCKED');
        setIsLocked(lockedRes.data);

        if (!lockedRes.data) {
          await loadWalletData();
        }
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWalletData = async () => {
    try {
      // Get accounts
      const accountsRes = await sendMessage('GET_ACCOUNTS');
      setAccounts(accountsRes.data || []);

      // Get current account
      const currentRes = await sendMessage('GET_CURRENT_ACCOUNT');
      setCurrentAccount(currentRes.data);

      // Get current network
      const networkRes = await sendMessage('GET_CURRENT_NETWORK');
      setCurrentNetwork(networkRes.data);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  };

  const createWallet = async (password: string): Promise<{ mnemonic: string; address: string }> => {
    setLoading(true);
    try {
      const response = await sendMessage('CREATE_WALLET', { password });
      if (response.success) {
        setIsInitialized(true);
        setIsLocked(false);
        await loadWalletData();
        return response.data;
      }
      throw new Error(response.error || 'Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const importWallet = async (mnemonic: string, password: string): Promise<string> => {
    setLoading(true);
    try {
      const response = await sendMessage('IMPORT_WALLET', { mnemonic, password });
      if (response.success) {
        setIsInitialized(true);
        setIsLocked(false);
        await loadWalletData();
        return response.data.address;
      }
      throw new Error(response.error || 'Failed to import wallet');
    } finally {
      setLoading(false);
    }
  };

  const unlockWallet = async (password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await sendMessage('UNLOCK_WALLET', { password });
      if (response.success) {
        setIsLocked(false);
        await loadWalletData();
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const lockWallet = async (): Promise<void> => {
    await sendMessage('LOCK_WALLET');
    setIsLocked(true);
    setCurrentAccount(null);
    setAccounts([]);
    setBalance('0');
  };

  const switchAccount = async (index: number): Promise<void> => {
    const response = await sendMessage('SWITCH_ACCOUNT', { index });
    if (response.success) {
      await loadWalletData();
    }
  };

  const createNewAccount = async (password: string): Promise<WalletAccount> => {
    const response = await sendMessage('CREATE_NEW_ACCOUNT', { password });
    if (response.success) {
      await loadWalletData();
      return response.data;
    }
    throw new Error(response.error || 'Failed to create account');
  };

  const switchNetwork = async (chainId: number): Promise<void> => {
    const response = await sendMessage('SWITCH_NETWORK', { chainId });
    if (response.success) {
      const networkRes = await sendMessage('GET_CURRENT_NETWORK');
      setCurrentNetwork(networkRes.data);
    }
  };

  const refreshBalance = async (): Promise<void> => {
    if (!currentAccount || !currentNetwork) return;

    try {
      const response = await sendMessage('GET_BALANCE', {
        address: currentAccount.address,
        network: currentNetwork
      });
      if (response.success) {
        setBalance(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const sendTransaction = async (to: string, amount: string, password: string): Promise<string> => {
    if (!currentNetwork) {
      throw new Error('No network selected');
    }

    const response = await sendMessage('SEND_TRANSACTION', {
      password,
      to,
      amount,
      network: currentNetwork
    });

    if (response.success) {
      await refreshBalance();
      return response.data;
    }
    throw new Error(response.error || 'Transaction failed');
  };

  const signMessage = async (message: string, password: string): Promise<string> => {
    const response = await sendMessage('SIGN_MESSAGE', { password, message });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to sign message');
  };

  const value: WalletContextType = {
    isLocked,
    isInitialized,
    currentAccount,
    accounts,
    currentNetwork,
    balance,
    loading,
    createWallet,
    importWallet,
    unlockWallet,
    lockWallet,
    switchAccount,
    createNewAccount,
    switchNetwork,
    refreshBalance,
    sendTransaction,
    signMessage
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
