import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Web3WalletState {
  // State
  address: string | null;
  balance: string;
  network: string;
  isConnected: boolean;
  chainId: number | null;
  error: string | null;

  // Actions
  connect: (address: string, chainId: number) => void;
  disconnect: () => void;
  setBalance: (balance: string) => void;
  setNetwork: (network: string) => void;
  setChainId: (chainId: number) => void;
  setError: (error: string | null) => void;
}

const initialState = {
  address: null,
  balance: '0',
  network: 'Unknown',
  isConnected: false,
  chainId: null,
  error: null,
};

export const useWeb3Store = create<Web3WalletState>()(
  persist(
    (set) => ({
      ...initialState,

      connect: (address, chainId) =>
        set({
          address,
          chainId,
          isConnected: true,
          error: null,
        }),

      disconnect: () => set(initialState),

      setBalance: (balance) => set({ balance }),

      setNetwork: (network) => set({ network }),

      setChainId: (chainId) => set({ chainId }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'web3-wallet-storage',
      partialize: (state) => ({
        address: state.address,
        chainId: state.chainId,
        isConnected: state.isConnected,
      }),
    }
  )
);
