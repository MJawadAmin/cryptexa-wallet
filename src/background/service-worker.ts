import {
  Message,
  MessageResponse,
  MessageType,
  EncryptedStore,
  WalletSettings,
  NetworkType,
  VerifiableCredential,
  VerifiablePresentation,
} from '@/types';
import {
  generateMnemonic,
  validateMnemonic,
  derivePrivateKey,
  encryptAES,
  decryptAES,
  signMessage,
  DERIVATION_PATHS,
  getAddressFromPrivateKey,
} from '@/utils/crypto';
import {
  createDID,
  getDIDIdentifier,
  resolveDID,
  createVerifiableCredential,
  verifyCredential,
  createVerifiablePresentation,
  verifyPresentation,
  signChallenge,
} from '@/utils/did';
import {
  getNativeBalance,
  getTokenBalance,
  sendNativeTransaction,
  sendTokenTransaction,
  getTransactionHistory,
  estimateNativeGas,
} from '@/utils/blockchain';

/**
 * Background Service Worker for Cryptexa Wallet
 * Manifest V3 compliant - all sensitive operations happen here
 * NFR-1.1: Code Isolation - All high-privilege code confined to service worker
 */

// In-memory storage for unlocked state (cleared on lock)
let unlockedSeed: string | null = null;
let unlockedDIDKey: string | null = null;
let lockTimeout: number | null = null;

// Auto-lock timeout (NFR-1.2: Lock Mechanism)
const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Initialize auto-lock mechanism
 */
function setupAutoLock() {
  if (lockTimeout) {
    clearTimeout(lockTimeout);
  }

  lockTimeout = setTimeout(() => {
    lockWallet();
  }, LOCK_TIMEOUT_MS) as unknown as number;
}

/**
 * Reset auto-lock timer on activity
 */
function resetAutoLock() {
  setupAutoLock();
}

/**
 * Lock the wallet - clear sensitive data from memory
 */
function lockWallet() {
  unlockedSeed = null;
  unlockedDIDKey = null;
  
  if (lockTimeout) {
    clearTimeout(lockTimeout);
    lockTimeout = null;
  }

  // Notify popup that wallet is locked
  chrome.runtime.sendMessage({
    type: 'WALLET_LOCKED',
  });
}

/**
 * Get encrypted store from chrome.storage
 */
async function getStore(): Promise<EncryptedStore | null> {
  const result = await chrome.storage.local.get('cryptexa_store');
  return result.cryptexa_store || null;
}

/**
 * Save encrypted store to chrome.storage
 */
async function saveStore(store: EncryptedStore): Promise<void> {
  await chrome.storage.local.set({ cryptexa_store: store });
}

/**
 * Create a new wallet
 */
async function handleCreateWallet(
  password: string
): Promise<MessageResponse<{ address: string; mnemonic: string; did: string }>> {
  try {
    // Generate mnemonic
    const mnemonic = generateMnemonic();

    // Derive keys
    const privateKey = derivePrivateKey(mnemonic, DERIVATION_PATHS.ETHEREUM);
    const didPrivateKey = derivePrivateKey(mnemonic, DERIVATION_PATHS.DID_KEY);
    const address = getAddressFromPrivateKey(privateKey);

    // Create DID
    const did = createDID(didPrivateKey);
    const didIdentifier = getDIDIdentifier(address);

    // Encrypt sensitive data
    const encryptedSeed = encryptAES(mnemonic, password);
    const encryptedDIDKey = encryptAES(didPrivateKey, password);

    // Create store
    const store: EncryptedStore = {
      encryptedSeed,
      encryptedDIDKey,
      wallets: [
        {
          address,
          publicKey: address,
          encryptedPrivateKey: encryptAES(privateKey, password),
          derivationPath: DERIVATION_PATHS.ETHEREUM,
          network: NetworkType.ETHEREUM_MAINNET,
        },
      ],
      did: didIdentifier,
      didDocument: await resolveDID(didIdentifier) || undefined,
      credentials: [],
      settings: {
        lockTimeout: 5,
        selectedNetwork: NetworkType.ETHEREUM_MAINNET,
        defaultCurrency: 'USD',
        autoLockEnabled: true,
      },
    };

    await saveStore(store);

    // Set unlocked state
    unlockedSeed = mnemonic;
    unlockedDIDKey = didPrivateKey;
    setupAutoLock();

    return {
      success: true,
      data: { address, mnemonic, did: didIdentifier },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create wallet',
    };
  }
}

/**
 * Restore wallet from mnemonic
 */
async function handleRestoreWallet(
  mnemonic: string,
  password: string
): Promise<MessageResponse<{ address: string; did: string }>> {
  try {
    // Validate mnemonic (FR-1.4: checksum verification)
    if (!validateMnemonic(mnemonic)) {
      return {
        success: false,
        error: 'Invalid mnemonic phrase - checksum verification failed',
      };
    }

    // Derive keys
    const privateKey = derivePrivateKey(mnemonic, DERIVATION_PATHS.ETHEREUM);
    const didPrivateKey = derivePrivateKey(mnemonic, DERIVATION_PATHS.DID_KEY);
    const address = getAddressFromPrivateKey(privateKey);

    // Create DID
    const didIdentifier = getDIDIdentifier(address);

    // Encrypt sensitive data
    const encryptedSeed = encryptAES(mnemonic, password);
    const encryptedDIDKey = encryptAES(didPrivateKey, password);

    // Create store
    const store: EncryptedStore = {
      encryptedSeed,
      encryptedDIDKey,
      wallets: [
        {
          address,
          publicKey: address,
          encryptedPrivateKey: encryptAES(privateKey, password),
          derivationPath: DERIVATION_PATHS.ETHEREUM,
          network: NetworkType.ETHEREUM_MAINNET,
        },
      ],
      did: didIdentifier,
      credentials: [],
      settings: {
        lockTimeout: 5,
        selectedNetwork: NetworkType.ETHEREUM_MAINNET,
        defaultCurrency: 'USD',
        autoLockEnabled: true,
      },
    };

    await saveStore(store);

    // Set unlocked state
    unlockedSeed = mnemonic;
    unlockedDIDKey = didPrivateKey;
    setupAutoLock();

    return {
      success: true,
      data: { address, did: didIdentifier },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore wallet',
    };
  }
}

/**
 * Unlock wallet with password
 */
async function handleUnlockWallet(
  password: string
): Promise<MessageResponse<{ address: string; did: string }>> {
  try {
    const store = await getStore();

    if (!store) {
      return { success: false, error: 'No wallet found' };
    }

    // Decrypt seed
    const mnemonic = decryptAES(store.encryptedSeed, password);
    const didPrivateKey = decryptAES(store.encryptedDIDKey, password);

    // Set unlocked state
    unlockedSeed = mnemonic;
    unlockedDIDKey = didPrivateKey;
    setupAutoLock();

    return {
      success: true,
      data: {
        address: store.wallets[0].address,
        did: store.did || '',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid password',
    };
  }
}

/**
 * Get wallet balance
 */
async function handleGetBalance(
  address: string,
  network: NetworkType
): Promise<MessageResponse<{ balance: string; symbol: string }>> {
  try {
    resetAutoLock();

    const balance = await getNativeBalance(address, network);

    return {
      success: true,
      data: {
        balance,
        symbol: 'ETH', // Simplified - should come from network config
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get balance',
    };
  }
}

/**
 * Send transaction
 */
async function handleSendTransaction(
  to: string,
  amount: string,
  network: NetworkType,
  password: string
): Promise<MessageResponse<{ txHash: string }>> {
  try {
    if (!unlockedSeed) {
      return { success: false, error: 'Wallet is locked' };
    }

    resetAutoLock();

    const store = await getStore();
    if (!store) {
      return { success: false, error: 'No wallet found' };
    }

    // Decrypt private key
    const privateKey = decryptAES(
      store.wallets[0].encryptedPrivateKey,
      password
    );

    // Send transaction
    const txHash = await sendNativeTransaction(
      privateKey,
      to,
      amount,
      network
    );

    return {
      success: true,
      data: { txHash },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed',
    };
  }
}

/**
 * Get transaction history
 */
async function handleGetTransactions(
  address: string,
  network: NetworkType
): Promise<MessageResponse<any[]>> {
  try {
    resetAutoLock();

    const transactions = await getTransactionHistory(address, network);

    return {
      success: true,
      data: transactions,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transactions',
    };
  }
}

/**
 * Create DID
 */
async function handleCreateDID(): Promise<MessageResponse<{ did: string }>> {
  try {
    if (!unlockedDIDKey) {
      return { success: false, error: 'Wallet is locked' };
    }

    resetAutoLock();

    const store = await getStore();
    if (!store) {
      return { success: false, error: 'No wallet found' };
    }

    const address = store.wallets[0].address;
    const didIdentifier = getDIDIdentifier(address);

    // Update store
    store.did = didIdentifier;
    await saveStore(store);

    return {
      success: true,
      data: { did: didIdentifier },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create DID',
    };
  }
}

/**
 * Resolve DID
 */
async function handleResolveDID(
  did: string
): Promise<MessageResponse<any>> {
  try {
    resetAutoLock();

    const didDocument = await resolveDID(did);

    if (!didDocument) {
      return { success: false, error: 'DID not found' };
    }

    return {
      success: true,
      data: didDocument,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resolve DID',
    };
  }
}

/**
 * Store credential
 */
async function handleStoreCredential(
  credential: VerifiableCredential
): Promise<MessageResponse<void>> {
  try {
    resetAutoLock();

    const store = await getStore();
    if (!store) {
      return { success: false, error: 'No wallet found' };
    }

    // Verify credential before storing (FR-4.2)
    const verification = await verifyCredential(credential);
    if (!verification.verified) {
      return {
        success: false,
        error: `Credential verification failed: ${verification.error}`,
      };
    }

    store.credentials.push(credential);
    await saveStore(store);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to store credential',
    };
  }
}

/**
 * Get credentials
 */
async function handleGetCredentials(): Promise<MessageResponse<VerifiableCredential[]>> {
  try {
    resetAutoLock();

    const store = await getStore();
    if (!store) {
      return { success: false, error: 'No wallet found' };
    }

    return {
      success: true,
      data: store.credentials,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get credentials',
    };
  }
}

/**
 * Create presentation
 */
async function handleCreatePresentation(
  credentialIds: string[],
  challenge?: string,
  domain?: string
): Promise<MessageResponse<VerifiablePresentation>> {
  try {
    if (!unlockedDIDKey) {
      return { success: false, error: 'Wallet is locked' };
    }

    resetAutoLock();

    const store = await getStore();
    if (!store) {
      return { success: false, error: 'No wallet found' };
    }

    // Filter requested credentials
    const credentials = store.credentials.filter((cred) =>
      credentialIds.includes(cred.id)
    );

    if (credentials.length === 0) {
      return { success: false, error: 'No matching credentials found' };
    }

    // Create DID instance
    const did = createDID(unlockedDIDKey);

    // Create presentation
    const presentation = await createVerifiablePresentation(
      did,
      credentials,
      challenge,
      domain
    );

    return {
      success: true,
      data: presentation,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create presentation',
    };
  }
}

/**
 * Sign challenge for authentication
 */
async function handleSignChallenge(
  challenge: string,
  domain: string
): Promise<MessageResponse<{ jwt: string }>> {
  try {
    if (!unlockedDIDKey) {
      return { success: false, error: 'Wallet is locked' };
    }

    resetAutoLock();

    const did = createDID(unlockedDIDKey);
    const jwt = await signChallenge(did, challenge, domain);

    return {
      success: true,
      data: { jwt },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign challenge',
    };
  }
}

/**
 * Message handler
 */
chrome.runtime.onMessage.addListener(
  (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    (async () => {
      let response: MessageResponse;

      switch (message.type) {
        case MessageType.CREATE_WALLET:
          response = await handleCreateWallet(message.payload.password);
          break;

        case MessageType.RESTORE_WALLET:
          response = await handleRestoreWallet(
            message.payload.mnemonic,
            message.payload.password
          );
          break;

        case MessageType.UNLOCK_WALLET:
          response = await handleUnlockWallet(message.payload.password);
          break;

        case MessageType.LOCK_WALLET:
          lockWallet();
          response = { success: true };
          break;

        case MessageType.GET_BALANCE:
          response = await handleGetBalance(
            message.payload.address,
            message.payload.network
          );
          break;

        case MessageType.SEND_TRANSACTION:
          response = await handleSendTransaction(
            message.payload.to,
            message.payload.amount,
            message.payload.network,
            message.payload.password
          );
          break;

        case MessageType.GET_TRANSACTIONS:
          response = await handleGetTransactions(
            message.payload.address,
            message.payload.network
          );
          break;

        case MessageType.CREATE_DID:
          response = await handleCreateDID();
          break;

        case MessageType.RESOLVE_DID:
          response = await handleResolveDID(message.payload.did);
          break;

        case MessageType.STORE_CREDENTIAL:
          response = await handleStoreCredential(message.payload.credential);
          break;

        case MessageType.GET_CREDENTIALS:
          response = await handleGetCredentials();
          break;

        case MessageType.CREATE_PRESENTATION:
          response = await handleCreatePresentation(
            message.payload.credentialIds,
            message.payload.challenge,
            message.payload.domain
          );
          break;

        case MessageType.SIGN_CHALLENGE:
          response = await handleSignChallenge(
            message.payload.challenge,
            message.payload.domain
          );
          break;

        default:
          response = { success: false, error: 'Unknown message type' };
      }

      sendResponse(response);
    })();

    return true; // Keep channel open for async response
  }
);

// Set up alarm for auto-lock
chrome.alarms.create('autoLock', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm: chrome.alarms.Alarm) => {
  if (alarm.name === 'autoLock' && unlockedSeed) {
    // Check if we should lock
    setupAutoLock();
  }
});

console.log('Cryptexa Wallet Service Worker initialized');
