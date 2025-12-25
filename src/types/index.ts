// Core wallet types
export interface Wallet {
  address: string;
  publicKey: string;
  encryptedPrivateKey: string;
  derivationPath: string;
  network: NetworkType;
}

export enum NetworkType {
  ETHEREUM_MAINNET = 'ethereum-mainnet',
  ETHEREUM_SEPOLIA = 'ethereum-sepolia',
  POLYGON = 'polygon',
  BSC = 'bsc',
}

export interface Asset {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  contractAddress?: string;
  fiatValue?: string;
  logo?: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  asset: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  type?: 'send' | 'receive';
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
}

// DID types
export interface DIDDocument {
  '@context': string | string[];
  id: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod?: string[];
  keyAgreement?: string[];
  service?: ServiceEndpoint[];
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk?: JsonWebKey;
  publicKeyMultibase?: string;
  ethereumAddress?: string;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string;
}

// Verifiable Credentials types
export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof: Proof;
}

export interface CredentialSubject {
  id: string;
  [key: string]: any;
}

export interface Proof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  jws?: string;
  proofValue?: string;
}

export interface VerifiablePresentation {
  '@context': string[];
  type: string[];
  holder: string;
  verifiableCredential: VerifiableCredential[];
  proof: Proof;
}

// Storage types
export interface EncryptedStore {
  encryptedSeed: string;
  encryptedDIDKey: string;
  wallets: Wallet[];
  did?: string;
  didDocument?: DIDDocument;
  credentials: VerifiableCredential[];
  settings: WalletSettings;
}

export interface WalletSettings {
  lockTimeout: number; // in minutes
  selectedNetwork: NetworkType;
  defaultCurrency: string;
  autoLockEnabled: boolean;
}

// Message types for communication between popup and background
export enum MessageType {
  // Wallet operations
  CREATE_WALLET = 'CREATE_WALLET',
  RESTORE_WALLET = 'RESTORE_WALLET',
  UNLOCK_WALLET = 'UNLOCK_WALLET',
  LOCK_WALLET = 'LOCK_WALLET',
  GET_BALANCE = 'GET_BALANCE',
  SEND_TRANSACTION = 'SEND_TRANSACTION',
  GET_TRANSACTIONS = 'GET_TRANSACTIONS',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  SWITCH_ACCOUNT = 'SWITCH_ACCOUNT',
  GET_ACCOUNTS = 'GET_ACCOUNTS',
  
  // DID operations
  CREATE_DID = 'CREATE_DID',
  RESOLVE_DID = 'RESOLVE_DID',
  
  // VC operations
  STORE_CREDENTIAL = 'STORE_CREDENTIAL',
  GET_CREDENTIALS = 'GET_CREDENTIALS',
  VERIFY_CREDENTIAL = 'VERIFY_CREDENTIAL',
  CREATE_PRESENTATION = 'CREATE_PRESENTATION',
  EXPORT_CREDENTIALS = 'EXPORT_CREDENTIALS',
  IMPORT_CREDENTIALS = 'IMPORT_CREDENTIALS',
  
  // Authentication
  SIGN_MESSAGE = 'SIGN_MESSAGE',
  SIGN_CHALLENGE = 'SIGN_CHALLENGE',
  
  // Provider requests (from dApps)
  REQUEST_ACCOUNTS = 'REQUEST_ACCOUNTS',
  REQUEST_PRESENTATION = 'REQUEST_PRESENTATION',
  REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
}

export interface Message<T = any> {
  type: MessageType;
  payload?: T;
  requestId?: string;
}

export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  requestId?: string;
}

// Authentication request types
export interface AuthRequest {
  challenge: string;
  domain: string;
  requestedClaims?: string[];
}

export interface PresentationRequest {
  challenge: string;
  domain: string;
  requestedCredentials: string[];
  requestedClaims?: string[];
}
