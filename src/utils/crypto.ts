import * as bip39 from 'bip39';
import HDKey from 'hdkey';
import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';

/**
 * Cryptography utilities for secure key management
 * All operations use industry-standard libraries and encryption
 */

// BIP44 derivation paths
export const DERIVATION_PATHS = {
  ETHEREUM: "m/44'/60'/0'/0/0",
  BITCOIN: "m/44'/0'/0'/0/0",
  DID_KEY: "m/44'/60'/0'/0/1", // Separate path for DID key
};

/**
 * Generate a new 12-word BIP39 mnemonic seed phrase
 */
export function generateMnemonic(): string {
  return bip39.generateMnemonic(128); // 128 bits = 12 words
}

/**
 * Validate a mnemonic seed phrase (checksum verification)
 */
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Derive a private key from mnemonic using BIP44 path
 */
export function derivePrivateKey(
  mnemonic: string,
  derivationPath: string
): string {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic phrase');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const hdkey = HDKey.fromMasterSeed(seed);
  const derivedKey = hdkey.derive(derivationPath);

  if (!derivedKey.privateKey) {
    throw new Error('Failed to derive private key');
  }

  return '0x' + derivedKey.privateKey.toString('hex');
}

/**
 * Encrypt data using AES-256
 */
export function encryptAES(data: string, password: string): string {
  return CryptoJS.AES.encrypt(data, password).toString();
}

/**
 * Decrypt AES-256 encrypted data
 */
export function decryptAES(encryptedData: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  
  if (!decrypted) {
    throw new Error('Decryption failed - invalid password');
  }
  
  return decrypted;
}

/**
 * Create an Ethereum wallet from a private key
 */
export function createWalletFromPrivateKey(privateKey: string): ethers.Wallet {
  return new ethers.Wallet(privateKey);
}

/**
 * Get wallet address from private key
 */
export function getAddressFromPrivateKey(privateKey: string): string {
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
}

/**
 * Sign a message with a private key
 */
export async function signMessage(
  privateKey: string,
  message: string
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  return await wallet.signMessage(message);
}

/**
 * Sign typed data (EIP-712)
 */
export async function signTypedData(
  privateKey: string,
  domain: any,
  types: any,
  value: any
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  return await wallet.signTypedData(domain, types, value);
}

/**
 * Verify a signed message
 */
export function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): boolean {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    return false;
  }
}

/**
 * Generate a random salt for additional encryption security
 */
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

/**
 * Hash a password with salt using SHA-256
 */
export function hashPassword(password: string, salt: string): string {
  return CryptoJS.SHA256(password + salt).toString();
}

/**
 * Secure random number generation
 */
export function generateSecureRandom(byteCount: number = 32): string {
  return CryptoJS.lib.WordArray.random(byteCount).toString();
}
