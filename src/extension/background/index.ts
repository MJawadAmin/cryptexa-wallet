import { WalletService } from '../../wallet/WalletService';
import { DIDService } from '../../did/DIDService';
import { StorageService } from '../../app/services/StorageService';

// Auto-lock timer
let autoLockTimer: NodeJS.Timeout | null = null;
const AUTO_LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// Connected dApps
const connectedDApps = new Map<number, { origin: string; accounts: string[] }>();

/**
 * Initialize background service
 */
async function initialize() {
  console.log('Cryptexa Wallet Background Service Worker Started');
  
  // Initialize DID resolver
  await DIDService.initialize();
  
  // Setup auto-lock
  resetAutoLock();
  
  // Listen for user activity
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender, sendResponse);
    return true; // Keep channel open for async response
  });

  // Listen for alarm (auto-lock)
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'autoLock') {
      handleAutoLock();
    }
  });

  // Setup periodic auto-lock check
  chrome.alarms.create('autoLock', { periodInMinutes: 1 });
}

/**
 * Handle messages from content scripts and popup
 */
async function handleMessage(
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  try {
    const { type, data } = message;

    switch (type) {
      // Wallet operations
      case 'CREATE_WALLET':
        const created = await WalletService.createWallet(data.password);
        sendResponse({ success: true, data: created });
        break;

      case 'IMPORT_WALLET':
        const imported = await WalletService.importWallet(data.mnemonic, data.password);
        sendResponse({ success: true, data: { address: imported } });
        break;

      case 'UNLOCK_WALLET':
        const unlocked = await WalletService.unlock(data.password);
        if (unlocked) {
          resetAutoLock();
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'Invalid password' });
        }
        break;

      case 'LOCK_WALLET':
        await WalletService.lock();
        sendResponse({ success: true });
        break;

      case 'GET_ACCOUNTS':
        const accounts = await WalletService.getAccounts();
        sendResponse({ success: true, data: accounts });
        break;

      case 'GET_CURRENT_ACCOUNT':
        const current = await WalletService.getCurrentAccount();
        sendResponse({ success: true, data: current });
        break;

      case 'SWITCH_ACCOUNT':
        await WalletService.switchAccount(data.index);
        sendResponse({ success: true });
        break;

      case 'CREATE_NEW_ACCOUNT':
        const newAccount = await WalletService.createNewAccount(data.password);
        sendResponse({ success: true, data: newAccount });
        break;

      case 'GET_BALANCE':
        const balance = await WalletService.getBalance(data.address, data.network);
        sendResponse({ success: true, data: balance });
        break;

      case 'SEND_TRANSACTION':
        resetAutoLock();
        const txHash = await WalletService.sendTransaction(
          data.password,
          data.to,
          data.amount,
          data.network
        );
        sendResponse({ success: true, data: txHash });
        break;

      case 'SIGN_MESSAGE':
        resetAutoLock();
        const signature = await WalletService.signMessage(data.password, data.message);
        sendResponse({ success: true, data: signature });
        break;

      case 'SIGN_TYPED_DATA':
        resetAutoLock();
        const typedSig = await WalletService.signTypedData(
          data.password,
          data.domain,
          data.types,
          data.value
        );
        sendResponse({ success: true, data: typedSig });
        break;

      case 'GET_CURRENT_NETWORK':
        const network = await WalletService.getCurrentNetwork();
        sendResponse({ success: true, data: network });
        break;

      case 'SWITCH_NETWORK':
        await WalletService.switchNetwork(data.chainId);
        sendResponse({ success: true });
        break;

      case 'IS_LOCKED':
        const locked = await WalletService.isLocked();
        sendResponse({ success: true, data: locked });
        break;

      case 'WALLET_EXISTS':
        const exists = await WalletService.walletExists();
        sendResponse({ success: true, data: exists });
        break;

      // DID operations
      case 'GET_CURRENT_DID':
        const did = await DIDService.getCurrentDID();
        sendResponse({ success: true, data: did });
        break;

      case 'RESOLVE_DID':
        const document = await DIDService.resolveDID(data.did);
        sendResponse({ success: true, data: document });
        break;

      case 'CREATE_CREDENTIAL':
        const credential = await DIDService.createCredential(
          data.password,
          data.subject,
          data.type
        );
        await DIDService.saveCredential(credential);
        sendResponse({ success: true, data: credential });
        break;

      case 'GET_CREDENTIALS':
        const credentials = await DIDService.getCredentials();
        sendResponse({ success: true, data: credentials });
        break;

      case 'DELETE_CREDENTIAL':
        await DIDService.deleteCredential(data.id);
        sendResponse({ success: true });
        break;

      case 'VERIFY_CREDENTIAL':
        const valid = await DIDService.verifyCredential(data.credential);
        sendResponse({ success: true, data: valid });
        break;

      case 'CREATE_AUTH_PROOF':
        const proof = await DIDService.createAuthProof(data.password, data.challenge);
        sendResponse({ success: true, data: proof });
        break;

      case 'VERIFY_AUTH_PROOF':
        const authValid = await DIDService.verifyAuthProof(data.proof, data.challenge);
        sendResponse({ success: true, data: authValid });
        break;

      case 'GET_DID_INFO':
        const info = await DIDService.getDIDInfo();
        sendResponse({ success: true, data: info });
        break;

      case 'EXPORT_DID_DATA':
        const exportData = await DIDService.exportDIDData();
        sendResponse({ success: true, data: exportData });
        break;

      case 'IMPORT_CREDENTIALS':
        const importedCount = await DIDService.importCredentials(data.jsonData);
        sendResponse({ success: true, data: importedCount });
        break;

      // dApp connection requests
      case 'CONNECT_DAPP':
        if (sender.tab?.id) {
          const result = await handleDAppConnect(sender.tab.id, data.origin);
          sendResponse(result);
        }
        break;

      case 'DISCONNECT_DAPP':
        if (sender.tab?.id) {
          connectedDApps.delete(sender.tab.id);
          sendResponse({ success: true });
        }
        break;

      case 'GET_CONNECTED_ACCOUNTS':
        if (sender.tab?.id) {
          const connection = connectedDApps.get(sender.tab.id);
          sendResponse({ success: true, data: connection?.accounts || [] });
        }
        break;

      // RPC requests from dApps
      case 'RPC_REQUEST':
        if (sender.tab?.id) {
          const rpcResult = await handleRPCRequest(sender.tab.id, data);
          sendResponse(rpcResult);
        }
        break;

      case 'RESET_AUTO_LOCK':
        resetAutoLock();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  } catch (error: any) {
    console.error('Background error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Handle dApp connection request
 */
async function handleDAppConnect(tabId: number, origin: string): Promise<any> {
  // Check if wallet is locked
  const locked = await WalletService.isLocked();
  if (locked) {
    return { success: false, error: 'Wallet is locked' };
  }

  // Get current account
  const account = await WalletService.getCurrentAccount();
  if (!account) {
    return { success: false, error: 'No account available' };
  }

  // Show popup for user approval
  // In production, this would open a popup window for user confirmation
  
  // For now, auto-approve (in production, require user interaction)
  connectedDApps.set(tabId, {
    origin,
    accounts: [account.address]
  });

  return {
    success: true,
    data: {
      accounts: [account.address],
      chainId: (await WalletService.getCurrentNetwork()).chainId
    }
  };
}

/**
 * Handle RPC request from dApp
 */
async function handleRPCRequest(tabId: number, request: any): Promise<any> {
  const connection = connectedDApps.get(tabId);
  if (!connection) {
    return { success: false, error: 'Not connected' };
  }

  const { method, params } = request;

  try {
    switch (method) {
      case 'eth_accounts':
      case 'eth_requestAccounts':
        return { success: true, data: connection.accounts };

      case 'eth_chainId':
        const network = await WalletService.getCurrentNetwork();
        return { success: true, data: `0x${network.chainId.toString(16)}` };

      case 'personal_sign':
        // In production, show confirmation popup
        const [message, address] = params;
        // Require password - in production get from popup
        return { success: false, error: 'Sign request requires user confirmation' };

      case 'eth_signTypedData_v4':
        // In production, show confirmation popup
        return { success: false, error: 'Sign request requires user confirmation' };

      case 'eth_sendTransaction':
        // In production, show confirmation popup
        return { success: false, error: 'Transaction requires user confirmation' };

      case 'wallet_switchEthereumChain':
        const chainId = parseInt(params[0].chainId, 16);
        await WalletService.switchNetwork(chainId);
        return { success: true, data: null };

      default:
        return { success: false, error: `Method ${method} not supported` };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Reset auto-lock timer
 */
function resetAutoLock() {
  if (autoLockTimer) {
    clearTimeout(autoLockTimer);
  }

  autoLockTimer = setTimeout(async () => {
    await handleAutoLock();
  }, AUTO_LOCK_TIME);
}

/**
 * Handle auto-lock
 */
async function handleAutoLock() {
  const locked = await WalletService.isLocked();
  if (!locked) {
    await WalletService.lock();
    console.log('Wallet auto-locked due to inactivity');
    
    // Notify all tabs
    chrome.runtime.sendMessage({ type: 'WALLET_LOCKED' });
  }
}

/**
 * Handle installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Cryptexa Wallet installed');
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  }
});

// Initialize on startup
initialize();
