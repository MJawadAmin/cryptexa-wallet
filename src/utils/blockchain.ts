import { ethers } from 'ethers';
import { NetworkType, Transaction, Asset } from '@/types';

/**
 * Blockchain interaction utilities for Ethereum and EVM-compatible chains
 */

// Network configurations
export const NETWORK_CONFIGS = {
  [NetworkType.ETHEREUM_MAINNET]: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [NetworkType.ETHEREUM_SEPOLIA]: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  [NetworkType.POLYGON]: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  [NetworkType.BSC]: {
    chainId: 56,
    name: 'Binance Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
};

// ERC-20 ABI (minimal for balance and transfer)
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

/**
 * Get provider for a specific network
 */
export function getProvider(network: NetworkType): ethers.JsonRpcProvider {
  const config = NETWORK_CONFIGS[network];
  return new ethers.JsonRpcProvider(config.rpcUrl);
}

/**
 * Get native currency balance
 */
export async function getNativeBalance(
  address: string,
  network: NetworkType
): Promise<string> {
  const provider = getProvider(network);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

/**
 * Get ERC-20 token balance
 */
export async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string,
  network: NetworkType
): Promise<{ balance: string; decimals: number; symbol: string; name: string }> {
  const provider = getProvider(network);
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

  const [balance, decimals, symbol, name] = await Promise.all([
    contract.balanceOf(walletAddress),
    contract.decimals(),
    contract.symbol(),
    contract.name(),
  ]);

  return {
    balance: ethers.formatUnits(balance, decimals),
    decimals,
    symbol,
    name,
  };
}

/**
 * Send native currency transaction
 */
export async function sendNativeTransaction(
  privateKey: string,
  to: string,
  amount: string,
  network: NetworkType,
  gasLimit?: string
): Promise<string> {
  const provider = getProvider(network);
  const wallet = new ethers.Wallet(privateKey, provider);

  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount),
    gasLimit: gasLimit ? BigInt(gasLimit) : undefined,
  });

  return tx.hash;
}

/**
 * Send ERC-20 token transaction
 */
export async function sendTokenTransaction(
  privateKey: string,
  tokenAddress: string,
  to: string,
  amount: string,
  network: NetworkType,
  decimals: number = 18
): Promise<string> {
  const provider = getProvider(network);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

  const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
  return tx.hash;
}

/**
 * Estimate gas for native transaction
 */
export async function estimateNativeGas(
  from: string,
  to: string,
  amount: string,
  network: NetworkType
): Promise<{ gasLimit: string; gasPrice: string; totalCost: string }> {
  const provider = getProvider(network);

  const gasLimit = await provider.estimateGas({
    from,
    to,
    value: ethers.parseEther(amount),
  });

  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || BigInt(0);

  const totalCost = gasLimit * gasPrice;

  return {
    gasLimit: gasLimit.toString(),
    gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
    totalCost: ethers.formatEther(totalCost),
  };
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(
  txHash: string,
  network: NetworkType
): Promise<ethers.TransactionReceipt | null> {
  const provider = getProvider(network);
  return await provider.getTransactionReceipt(txHash);
}

/**
 * Get transaction history for an address
 */
export async function getTransactionHistory(
  address: string,
  network: NetworkType,
  limit: number = 50
): Promise<Transaction[]> {
  const provider = getProvider(network);
  const currentBlock = await provider.getBlockNumber();
  
  // Note: This is a simplified version. In production, use an indexer service like Etherscan API
  const transactions: Transaction[] = [];
  
  // Get recent blocks (this is not efficient for production)
  const blocksToCheck = Math.min(1000, currentBlock);
  
  for (let i = 0; i < blocksToCheck && transactions.length < limit; i++) {
    const blockNumber = currentBlock - i;
    try {
      const block = await provider.getBlock(blockNumber, true);
      
      if (block && block.prefetchedTransactions) {
        for (const tx of block.prefetchedTransactions) {
          if (
            tx.from.toLowerCase() === address.toLowerCase() ||
            tx.to?.toLowerCase() === address.toLowerCase()
          ) {
            const receipt = await provider.getTransactionReceipt(tx.hash);
            
            transactions.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to || '',
              value: ethers.formatEther(tx.value),
              asset: 'ETH',
              timestamp: block.timestamp * 1000,
              status: receipt?.status === 1 ? 'confirmed' : 'failed',
              gasUsed: receipt?.gasUsed.toString(),
              gasPrice: tx.gasPrice?.toString(),
              blockNumber: tx.blockNumber || undefined,
            });

            if (transactions.length >= limit) break;
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching block ${blockNumber}:`, error);
    }
  }

  return transactions.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  txHash: string,
  network: NetworkType,
  confirmations: number = 1
): Promise<ethers.TransactionReceipt> {
  const provider = getProvider(network);
  const receipt = await provider.waitForTransaction(txHash, confirmations);
  
  if (!receipt) {
    throw new Error('Transaction not found');
  }
  
  return receipt;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Get current gas prices
 */
export async function getGasPrices(
  network: NetworkType
): Promise<{ slow: string; average: string; fast: string }> {
  const provider = getProvider(network);
  const feeData = await provider.getFeeData();

  const basePrice = feeData.gasPrice || BigInt(0);

  return {
    slow: ethers.formatUnits(basePrice * BigInt(80) / BigInt(100), 'gwei'),
    average: ethers.formatUnits(basePrice, 'gwei'),
    fast: ethers.formatUnits(basePrice * BigInt(120) / BigInt(100), 'gwei'),
  };
}
