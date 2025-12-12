/**
 * Provider script - Runs in page context
 * Provides window.CryptexaProvider for dApps
 */

interface RequestArguments {
  method: string;
  params?: any[];
}

class CryptexaProvider {
  public isMetaMask = false; // Set to false to distinguish from MetaMask
  public isCryptexa = true;
  public chainId: string | null = null;
  public selectedAddress: string | null = null;
  public networkVersion: string | null = null;
  
  private _isConnected = false;
  private _accounts: string[] = [];
  private _requestId = 0;
  private _eventListeners: Map<string, Set<Function>> = new Map();

  constructor() {
    this._initialize();
  }

  /**
   * Initialize provider
   */
  private async _initialize() {
    // Listen for responses from content script
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      
      if (event.data.type === 'CRYPTEXA_PROVIDER_RESPONSE') {
        this._handleResponse(event.data);
      }
      
      if (event.data.type === 'CRYPTEXA_WALLET_EVENT') {
        this._handleWalletEvent(event.data);
      }
    });

    console.log('🔐 Cryptexa Wallet Provider initialized');
  }

  /**
   * Handle response from background
   */
  private _handleResponse(data: any) {
    // Responses are handled via promises in request() method
  }

  /**
   * Handle wallet events
   */
  private _handleWalletEvent(data: any) {
    const { event, data: eventData } = data;
    
    if (event === 'accountsChanged') {
      this._accounts = eventData;
      this.selectedAddress = eventData[0] || null;
      this._emit('accountsChanged', eventData);
    } else if (event === 'chainChanged') {
      this.chainId = eventData;
      this._emit('chainChanged', eventData);
    }
  }

  /**
   * Send request to background
   */
  public async request(args: RequestArguments): Promise<any> {
    const { method, params = [] } = args;
    const id = ++this._requestId;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      const handler = (event: MessageEvent) => {
        if (event.data.type === 'CRYPTEXA_PROVIDER_RESPONSE' && event.data.id === id) {
          clearTimeout(timeout);
          window.removeEventListener('message', handler);

          if (event.data.error) {
            reject(new Error(event.data.error));
          } else if (event.data.data && !event.data.data.success) {
            reject(new Error(event.data.data.error || 'Request failed'));
          } else {
            const result = event.data.data?.data;
            
            // Update state based on response
            if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
              this._accounts = result || [];
              this.selectedAddress = this._accounts[0] || null;
              this._isConnected = this._accounts.length > 0;
            } else if (method === 'eth_chainId') {
              this.chainId = result;
              this.networkVersion = result ? parseInt(result, 16).toString() : null;
            }
            
            resolve(result);
          }
        }
      };

      window.addEventListener('message', handler);

      // Send request to content script
      window.postMessage({
        type: 'CRYPTEXA_PROVIDER_REQUEST',
        id,
        method,
        params
      }, '*');
    });
  }

  /**
   * Request account access
   */
  public async enable(): Promise<string[]> {
    return this.request({ method: 'eth_requestAccounts' });
  }

  /**
   * Send async RPC request
   */
  public async sendAsync(
    payload: { id: number; method: string; params?: any[] },
    callback: (error: Error | null, result?: any) => void
  ): Promise<void> {
    try {
      const result = await this.request({
        method: payload.method,
        params: payload.params
      });
      callback(null, { id: payload.id, jsonrpc: '2.0', result });
    } catch (error: any) {
      callback(error);
    }
  }

  /**
   * Send RPC request
   */
  public async send(
    methodOrPayload: string | { method: string; params?: any[] },
    paramsOrCallback?: any[] | ((error: Error | null, result?: any) => void)
  ): Promise<any> {
    if (typeof methodOrPayload === 'string') {
      // New signature: send(method, params)
      return this.request({
        method: methodOrPayload,
        params: paramsOrCallback as any[]
      });
    } else {
      // Old signature: send(payload, callback)
      const callback = paramsOrCallback as (error: Error | null, result?: any) => void;
      await this.sendAsync(
        { id: ++this._requestId, ...methodOrPayload },
        callback
      );
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * Add event listener
   */
  public on(event: string, callback: Function): void {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, new Set());
    }
    this._eventListeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   */
  public removeListener(event: string, callback: Function): void {
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Emit event
   */
  private _emit(event: string, data: any): void {
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }
}

// Initialize and expose provider
const cryptexaProvider = new CryptexaProvider();

// Expose as window.CryptexaProvider
(window as any).CryptexaProvider = cryptexaProvider;

// Also expose as window.ethereum if not already set (for compatibility)
if (!(window as any).ethereum) {
  (window as any).ethereum = cryptexaProvider;
  console.log('🔐 Cryptexa set as default Web3 provider');
} else {
  console.log('🔐 Cryptexa provider available as window.CryptexaProvider');
}

// Announce provider
window.dispatchEvent(new Event('cryptexa#initialized'));

export {};
