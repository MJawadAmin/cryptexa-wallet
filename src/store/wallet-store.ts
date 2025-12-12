import { create } from 'zustand';
import {
  NetworkType,
  Asset,
  Transaction,
  VerifiableCredential,
  Message,
  MessageType,
  MessageResponse,
} from '@/types';

/**
 * Zustand store for managing application state
 * Handles communication with background service worker
 */

interface WalletState {
  // Wallet state
  isLocked: boolean;
  address: string | null;
  did: string | null;
  balance: string;
  assets: Asset[];
  transactions: Transaction[];
  network: NetworkType;

  // Credentials state
  credentials: VerifiableCredential[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  createWallet: (password: string) => Promise<{ success: boolean; mnemonic?: string; error?: string }>;
  restoreWallet: (mnemonic: string, password: string) => Promise<{ success: boolean; error?: string }>;
  unlockWallet: (password: string) => Promise<{ success: boolean; error?: string }>;
  lockWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  sendTransaction: (to: string, amount: string, password: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  refreshTransactions: () => Promise<void>;
  switchNetwork: (network: NetworkType) => void;

  // DID actions
  createDID: () => Promise<{ success: boolean; did?: string; error?: string }>;
  resolveDID: (did: string) => Promise<any>;

  // Credential actions
  storeCredential: (credential: VerifiableCredential) => Promise<{ success: boolean; error?: string }>;
  refreshCredentials: () => Promise<void>;
  createPresentation: (
    credentialIds: string[],
    challenge?: string,
    domain?: string
  ) => Promise<{ success: boolean; presentation?: any; error?: string }>;

  // Utility
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Send message to background service worker
 * In localhost preview, returns mock data
 */
async function sendMessage<T>(message: Message): Promise<MessageResponse<T>> {
  // Check if running in extension context
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response: MessageResponse<T>) => {
        resolve(response);
      });
    });
  }
  
  // Mock responses for localhost preview
  console.warn('Running in browser preview mode - using mock data');
  return Promise.resolve({
    success: false,
    error: 'Extension APIs not available in browser preview. Load extension to test functionality.'
  } as MessageResponse<T>);
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // Initial state
  isLocked: true,
  address: null,
  did: null,
  balance: '0',
  assets: [],
  transactions: [],
  network: NetworkType.ETHEREUM_MAINNET,
  credentials: [],
  isLoading: false,
  error: null,

  // Create wallet
  createWallet: async (password: string) => {
    set({ isLoading: true, error: null });

    const response = await sendMessage<{ address: string; mnemonic: string; did: string }>({
      type: MessageType.CREATE_WALLET,
      payload: { password },
    });

    if (response.success && response.data) {
      set({
        isLocked: false,
        address: response.data.address,
        did: response.data.did,
        isLoading: false,
      });

      // Refresh balance
      await get().refreshBalance();

      return {
        success: true,
        mnemonic: response.data.mnemonic,
      };
    } else {
      set({ isLoading: false, error: response.error || 'Failed to create wallet' });
      return {
        success: false,
        error: response.error,
      };
    }
  },

  // Restore wallet
  restoreWallet: async (mnemonic: string, password: string) => {
    set({ isLoading: true, error: null });

    const response = await sendMessage<{ address: string; did: string }>({
      type: MessageType.RESTORE_WALLET,
      payload: { mnemonic, password },
    });

    if (response.success && response.data) {
      set({
        isLocked: false,
        address: response.data.address,
        did: response.data.did,
        isLoading: false,
      });

      await get().refreshBalance();

      return { success: true };
    } else {
      set({ isLoading: false, error: response.error || 'Failed to restore wallet' });
      return {
        success: false,
        error: response.error,
      };
    }
  },

  // Unlock wallet
  unlockWallet: async (password: string) => {
    set({ isLoading: true, error: null });

    const response = await sendMessage<{ address: string; did: string }>({
      type: MessageType.UNLOCK_WALLET,
      payload: { password },
    });

    if (response.success && response.data) {
      set({
        isLocked: false,
        address: response.data.address,
        did: response.data.did,
        isLoading: false,
      });

      await get().refreshBalance();
      await get().refreshTransactions();
      await get().refreshCredentials();

      return { success: true };
    } else {
      set({ isLoading: false, error: response.error || 'Invalid password' });
      return {
        success: false,
        error: response.error,
      };
    }
  },

  // Lock wallet
  lockWallet: async () => {
    await sendMessage({
      type: MessageType.LOCK_WALLET,
    });

    set({
      isLocked: true,
      address: null,
      balance: '0',
      assets: [],
      transactions: [],
      credentials: [],
    });
  },

  // Refresh balance
  refreshBalance: async () => {
    const { address, network } = get();

    if (!address) return;

    const response = await sendMessage<{ balance: string; symbol: string }>({
      type: MessageType.GET_BALANCE,
      payload: { address, network },
    });

    if (response.success && response.data) {
      set({ balance: response.data.balance });
    }
  },

  // Send transaction
  sendTransaction: async (to: string, amount: string, password: string) => {
    set({ isLoading: true, error: null });

    const { network } = get();

    const response = await sendMessage<{ txHash: string }>({
      type: MessageType.SEND_TRANSACTION,
      payload: { to, amount, network, password },
    });

    if (response.success && response.data) {
      set({ isLoading: false });

      // Refresh balance and transactions
      await get().refreshBalance();
      await get().refreshTransactions();

      return {
        success: true,
        txHash: response.data.txHash,
      };
    } else {
      set({ isLoading: false, error: response.error || 'Transaction failed' });
      return {
        success: false,
        error: response.error,
      };
    }
  },

  // Refresh transactions
  refreshTransactions: async () => {
    const { address, network } = get();

    if (!address) return;

    const response = await sendMessage<Transaction[]>({
      type: MessageType.GET_TRANSACTIONS,
      payload: { address, network },
    });

    if (response.success && response.data) {
      set({ transactions: response.data });
    }
  },

  // Switch network
  switchNetwork: (network: NetworkType) => {
    set({ network });
    get().refreshBalance();
    get().refreshTransactions();
  },

  // Create DID
  createDID: async () => {
    set({ isLoading: true, error: null });

    const response = await sendMessage<{ did: string }>({
      type: MessageType.CREATE_DID,
    });

    if (response.success && response.data) {
      set({
        did: response.data.did,
        isLoading: false,
      });

      return {
        success: true,
        did: response.data.did,
      };
    } else {
      set({ isLoading: false, error: response.error || 'Failed to create DID' });
      return {
        success: false,
        error: response.error,
      };
    }
  },

  // Resolve DID
  resolveDID: async (did: string) => {
    const response = await sendMessage({
      type: MessageType.RESOLVE_DID,
      payload: { did },
    });

    return response.data;
  },

  // Store credential
  storeCredential: async (credential: VerifiableCredential) => {
    set({ isLoading: true, error: null });

    const response = await sendMessage({
      type: MessageType.STORE_CREDENTIAL,
      payload: { credential },
    });

    if (response.success) {
      set({ isLoading: false });
      await get().refreshCredentials();

      return { success: true };
    } else {
      set({ isLoading: false, error: response.error || 'Failed to store credential' });
      return {
        success: false,
        error: response.error,
      };
    }
  },

  // Refresh credentials
  refreshCredentials: async () => {
    const response = await sendMessage<VerifiableCredential[]>({
      type: MessageType.GET_CREDENTIALS,
    });

    if (response.success && response.data) {
      set({ credentials: response.data });
    }
  },

  // Create presentation
  createPresentation: async (
    credentialIds: string[],
    challenge?: string,
    domain?: string
  ) => {
    set({ isLoading: true, error: null });

    const response = await sendMessage({
      type: MessageType.CREATE_PRESENTATION,
      payload: { credentialIds, challenge, domain },
    });

    set({ isLoading: false });

    if (response.success) {
      return {
        success: true,
        presentation: response.data,
      };
    } else {
      set({ error: response.error || 'Failed to create presentation' });
      return {
        success: false,
        error: response.error,
      };
    }
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Listen for wallet lock events from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'WALLET_LOCKED') {
    useWalletStore.getState().lockWallet();
  }
});
