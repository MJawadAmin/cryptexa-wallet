/**
 * Provider Script - Injected into web pages
 * Provides window.cryptexa API for dApps
 * Implements authentication and presentation request protocols
 */

interface CryptexaProvider {
  isConnected: boolean;
  address: string | null;
  did: string | null;

  // Wallet methods
  requestAccounts(): Promise<string[]>;
  getBalance(): Promise<string>;
  sendTransaction(to: string, value: string): Promise<string>;

  // DID methods
  requestPresentation(
    requestedCredentials: string[],
    challenge: string,
    requestedClaims?: string[]
  ): Promise<any>;
  
  signChallenge(challenge: string): Promise<string>;

  // Events
  on(event: string, callback: (data: any) => void): void;
  off(event: string, callback: (data: any) => void): void;
}

class Cryptexa implements CryptexaProvider {
  isConnected = false;
  address: string | null = null;
  did: string | null = null;

  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();
  private requestId = 0;
  private pendingRequests: Map<
    number,
    { resolve: (value: any) => void; reject: (error: any) => void }
  > = new Map();

  constructor() {
    // Listen for responses from content script
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      if (!event.data || event.data.target !== 'cryptexa-page') return;

      const { id, response } = event.data;
      const pending = this.pendingRequests.get(id);

      if (pending) {
        this.pendingRequests.delete(id);

        if (response.success) {
          pending.resolve(response.data);
        } else {
          pending.reject(new Error(response.error || 'Request failed'));
        }
      }
    });
  }

  private async sendMessage(type: string, payload?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;

      this.pendingRequests.set(id, { resolve, reject });

      // Send message to content script
      window.postMessage(
        {
          target: 'cryptexa-content',
          id,
          type,
          payload,
        },
        '*'
      );

      // Timeout after 60 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 60000);
    });
  }

  async requestAccounts(): Promise<string[]> {
    try {
      const result = await this.sendMessage('REQUEST_ACCOUNTS');

      this.isConnected = true;
      this.address = result.address;
      this.did = result.did;

      this.emit('connect', { address: this.address, did: this.did });

      return [result.address];
    } catch (error) {
      throw new Error('User rejected the request');
    }
  }

  async getBalance(): Promise<string> {
    if (!this.address) {
      throw new Error('Not connected');
    }

    return await this.sendMessage('GET_BALANCE', { address: this.address });
  }

  async sendTransaction(to: string, value: string): Promise<string> {
    if (!this.address) {
      throw new Error('Not connected');
    }

    return await this.sendMessage('SEND_TRANSACTION', { to, value });
  }

  async requestPresentation(
    requestedCredentials: string[],
    challenge: string,
    requestedClaims?: string[]
  ): Promise<any> {
    if (!this.did) {
      throw new Error('DID not available');
    }

    const domain = window.location.origin;

    return await this.sendMessage('REQUEST_PRESENTATION', {
      requestedCredentials,
      challenge,
      requestedClaims,
      domain,
    });
  }

  async signChallenge(challenge: string): Promise<string> {
    if (!this.did) {
      throw new Error('DID not available');
    }

    const domain = window.location.origin;

    const result = await this.sendMessage('SIGN_CHALLENGE', {
      challenge,
      domain,
    });

    return result.jwt;
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(callback);
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((callback) => callback(data));
    }
  }
}

// Inject the provider into window object
if (!(window as any).cryptexa) {
  (window as any).cryptexa = new Cryptexa();

  // Announce to the page that Cryptexa is available
  window.dispatchEvent(new Event('cryptexa#initialized'));

  console.log('Cryptexa Wallet Provider initialized');
}

// TypeScript declaration for window.cryptexa
declare global {
  interface Window {
    cryptexa: CryptexaProvider;
  }
}

export {};
