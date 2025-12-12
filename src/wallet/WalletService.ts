import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import HDKey from 'hdkey';
import { EncryptionService } from '../app/services/EncryptionService';
import { StorageService } from '../app/services/StorageService';

export interface WalletAccount {
  address: string;
  publicKey: string;
  path: string;
  index: number;
  name: string;
}

export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  symbol: string;
  blockExplorer: string;
}

export const NETWORKS: Network[] = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    symbol: 'ETH',
    blockExplorer: 'https://etherscan.io'
  },
  {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    symbol: 'MATIC',
    blockExplorer: 'https://polygonscan.com'
  },
  {
    chainId: 56,
    name: 'BSC',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    symbol: 'BNB',
    blockExplorer: 'https://bscscan.com'
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    symbol: 'ETH',
    blockExplorer: 'https://arbiscan.io'
  },
  {
    chainId: 10,
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    symbol: 'ETH',
    blockExplorer: 'https://optimistic.etherscan.io'
  },
  {
    chainId: 43114,
    name: 'Avalanche',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    symbol: 'AVAX',
    blockExplorer: 'https://snowtrace.io'
  }
];

export class WalletService {
  private static readonly STORAGE_KEY_ENCRYPTED_MNEMONIC = 'encrypted_mnemonic';
  private static readonly STORAGE_KEY_ACCOUNTS = 'accounts';
  private static readonly STORAGE_KEY_CURRENT_ACCOUNT = 'current_account';
  private static readonly STORAGE_KEY_CURRENT_NETWORK = 'current_network';

  /**
   * Generate new mnemonic (12 words)
   */
  static generateMnemonic(): string {
    return bip39.generateMnemonic();
  }

  /**
   * Validate mnemonic
   */
  static validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
  }

  /**
   * Create new wallet and save encrypted
   */
  static async createWallet(password: string): Promise<{ mnemonic: string; address: string }> {
    const mnemonic = this.generateMnemonic();
    
    // Encrypt mnemonic
    const encrypted = EncryptionService.encrypt(mnemonic, password);
    await StorageService.set(this.STORAGE_KEY_ENCRYPTED_MNEMONIC, encrypted);

    // Create first account
    const account = await this.deriveAccount(mnemonic, 0);
    await this.saveAccount(account);
    await StorageService.set(this.STORAGE_KEY_CURRENT_ACCOUNT, 0);

    // Set default network
    await StorageService.set(this.STORAGE_KEY_CURRENT_NETWORK, NETWORKS[0]);

    return { mnemonic, address: account.address };
  }

  /**
   * Import existing wallet
   */
  static async importWallet(mnemonic: string, password: string): Promise<string> {
    if (!this.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic phrase');
    }

    // Encrypt mnemonic
    const encrypted = EncryptionService.encrypt(mnemonic, password);
    await StorageService.set(this.STORAGE_KEY_ENCRYPTED_MNEMONIC, encrypted);

    // Create first account
    const account = await this.deriveAccount(mnemonic, 0);
    await this.saveAccount(account);
    await StorageService.set(this.STORAGE_KEY_CURRENT_ACCOUNT, 0);

    // Set default network
    await StorageService.set(this.STORAGE_KEY_CURRENT_NETWORK, NETWORKS[0]);

    return account.address;
  }

  /**
   * Derive account from mnemonic
   */
  static async deriveAccount(mnemonic: string, index: number): Promise<WalletAccount> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdkey = HDKey.fromMasterSeed(seed);
    const path = `m/44'/60'/0'/0/${index}`;
    const child = hdkey.derive(path);

    if (!child.privateKey) {
      throw new Error('Failed to derive private key');
    }

    const wallet = new ethers.Wallet('0x' + child.privateKey.toString('hex'));

    return {
      address: wallet.address,
      publicKey: wallet.signingKey.publicKey,
      path,
      index,
      name: `Account ${index + 1}`
    };
  }

  /**
   * Get private key for account (requires password)
   */
  static async getPrivateKey(password: string, accountIndex: number): Promise<string> {
    const encrypted = await StorageService.get<string>(this.STORAGE_KEY_ENCRYPTED_MNEMONIC);
    if (!encrypted) {
      throw new Error('No wallet found');
    }

    const mnemonic = EncryptionService.decrypt(encrypted, password);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdkey = HDKey.fromMasterSeed(seed);
    const path = `m/44'/60'/0'/0/${accountIndex}`;
    const child = hdkey.derive(path);

    if (!child.privateKey) {
      throw new Error('Failed to derive private key');
    }

    return `0x${child.privateKey.toString('hex')}`;
  }

  /**
   * Save account to storage
   */
  private static async saveAccount(account: WalletAccount): Promise<void> {
    const accounts = await StorageService.get<WalletAccount[]>(this.STORAGE_KEY_ACCOUNTS) || [];
    accounts.push(account);
    await StorageService.set(this.STORAGE_KEY_ACCOUNTS, accounts);
  }

  /**
   * Get all accounts
   */
  static async getAccounts(): Promise<WalletAccount[]> {
    return await StorageService.get<WalletAccount[]>(this.STORAGE_KEY_ACCOUNTS) || [];
  }

  /**
   * Get current account
   */
  static async getCurrentAccount(): Promise<WalletAccount | null> {
    const accounts = await this.getAccounts();
    const currentIndex = await StorageService.get<number>(this.STORAGE_KEY_CURRENT_ACCOUNT);
    
    if (currentIndex === null || !accounts[currentIndex]) {
      return null;
    }

    return accounts[currentIndex];
  }

  /**
   * Switch account
   */
  static async switchAccount(index: number): Promise<void> {
    const accounts = await this.getAccounts();
    if (index < 0 || index >= accounts.length) {
      throw new Error('Invalid account index');
    }
    await StorageService.set(this.STORAGE_KEY_CURRENT_ACCOUNT, index);
  }

  /**
   * Create new account
   */
  static async createNewAccount(password: string): Promise<WalletAccount> {
    const encrypted = await StorageService.get<string>(this.STORAGE_KEY_ENCRYPTED_MNEMONIC);
    if (!encrypted) {
      throw new Error('No wallet found');
    }

    const mnemonic = EncryptionService.decrypt(encrypted, password);
    const accounts = await this.getAccounts();
    const newIndex = accounts.length;
    
    const account = await this.deriveAccount(mnemonic, newIndex);
    await this.saveAccount(account);

    return account;
  }

  /**
   * Get balance for address
   */
  static async getBalance(address: string, network: Network): Promise<string> {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  /**
   * Send transaction
   */
  static async sendTransaction(
    password: string,
    to: string,
    amount: string,
    network: Network
  ): Promise<string> {
    const currentIndex = await StorageService.get<number>(this.STORAGE_KEY_CURRENT_ACCOUNT);
    if (currentIndex === null) {
      throw new Error('No account selected');
    }

    const privateKey = await this.getPrivateKey(password, currentIndex);
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    });

    return tx.hash;
  }

  /**
   * Sign message
   */
  static async signMessage(password: string, message: string): Promise<string> {
    const currentIndex = await StorageService.get<number>(this.STORAGE_KEY_CURRENT_ACCOUNT);
    if (currentIndex === null) {
      throw new Error('No account selected');
    }

    const privateKey = await this.getPrivateKey(password, currentIndex);
    const wallet = new ethers.Wallet(privateKey);

    return await wallet.signMessage(message);
  }

  /**
   * Sign typed data (EIP-712)
   */
  static async signTypedData(
    password: string,
    domain: any,
    types: any,
    value: any
  ): Promise<string> {
    const currentIndex = await StorageService.get<number>(this.STORAGE_KEY_CURRENT_ACCOUNT);
    if (currentIndex === null) {
      throw new Error('No account selected');
    }

    const privateKey = await this.getPrivateKey(password, currentIndex);
    const wallet = new ethers.Wallet(privateKey);

    return await wallet.signTypedData(domain, types, value);
  }

  /**
   * Get current network
   */
  static async getCurrentNetwork(): Promise<Network> {
    const network = await StorageService.get<Network>(this.STORAGE_KEY_CURRENT_NETWORK);
    return network || NETWORKS[0];
  }

  /**
   * Switch network
   */
  static async switchNetwork(chainId: number): Promise<void> {
    const network = NETWORKS.find(n => n.chainId === chainId);
    if (!network) {
      throw new Error('Network not supported');
    }
    await StorageService.set(this.STORAGE_KEY_CURRENT_NETWORK, network);
  }

  /**
   * Check if wallet exists
   */
  static async walletExists(): Promise<boolean> {
    return await StorageService.has(this.STORAGE_KEY_ENCRYPTED_MNEMONIC);
  }

  /**
   * Verify password
   */
  static async verifyPassword(password: string): Promise<boolean> {
    try {
      const encrypted = await StorageService.get<string>(this.STORAGE_KEY_ENCRYPTED_MNEMONIC);
      if (!encrypted) return false;

      const mnemonic = EncryptionService.decrypt(encrypted, password);
      return this.validateMnemonic(mnemonic);
    } catch {
      return false;
    }
  }

  /**
   * Lock wallet (clear sensitive data from memory)
   */
  static async lock(): Promise<void> {
    // In a real implementation, clear any cached sensitive data
    await StorageService.set('wallet_locked', true);
  }

  /**
   * Unlock wallet
   */
  static async unlock(password: string): Promise<boolean> {
    const isValid = await this.verifyPassword(password);
    if (isValid) {
      await StorageService.set('wallet_locked', false);
    }
    return isValid;
  }

  /**
   * Check if wallet is locked
   */
  static async isLocked(): Promise<boolean> {
    const locked = await StorageService.get<boolean>('wallet_locked');
    return locked !== false; // Default to locked
  }
}
