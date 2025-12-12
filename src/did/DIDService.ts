import { EthrDID } from 'ethr-did';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';
import { ethers } from 'ethers';
import { StorageService } from '../app/services/StorageService';
import { WalletService } from '../wallet/WalletService';

export interface DIDDocument {
  '@context': string[];
  id: string;
  verificationMethod: any[];
  authentication: string[];
  assertionMethod: string[];
}

export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: any;
  proof: any;
}

export class DIDService {
  private static resolver: Resolver;

  /**
   * Initialize DID resolver
   */
  static async initialize() {
    const providerConfig = {
      networks: [
        {
          name: 'mainnet',
          rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
          registry: '0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B'
        },
        {
          name: 'goerli',
          rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
          registry: '0x9c9d4C4c33ce8E72b5AB1a1c9C8b5C7D8B9E3F2A'
        }
      ]
    };

    this.resolver = new Resolver(getResolver(providerConfig));
  }

  /**
   * Create DID from wallet address
   */
  static createDID(address: string, chainId: number = 1): string {
    // Format: did:ethr:mainnet:0x...
    const network = chainId === 1 ? 'mainnet' : 'goerli';
    return `did:ethr:${network}:${address}`;
  }

  /**
   * Get DID for current account
   */
  static async getCurrentDID(): Promise<string | null> {
    const account = await WalletService.getCurrentAccount();
    if (!account) return null;

    const network = await WalletService.getCurrentNetwork();
    return this.createDID(account.address, network.chainId);
  }

  /**
   * Resolve DID document
   */
  static async resolveDID(did: string): Promise<DIDDocument | null> {
    try {
      if (!this.resolver) {
        await this.initialize();
      }

      const result = await this.resolver.resolve(did);
      return result.didDocument as DIDDocument;
    } catch (error) {
      console.error('Failed to resolve DID:', error);
      return null;
    }
  }

  /**
   * Create Ethr DID instance
   */
  static async createEthrDID(password: string): Promise<EthrDID> {
    const currentIndex = await StorageService.get<number>('current_account') || 0;
    const privateKey = await WalletService.getPrivateKey(password, currentIndex);
    
    const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY');
    const signer = new ethers.Wallet(privateKey, provider);

    const ethrDid = new EthrDID({
      identifier: signer.address,
      privateKey: privateKey.replace('0x', ''),
      provider: provider as any,
      chainNameOrId: 1
    });

    return ethrDid;
  }

  /**
   * Sign JWT with DID
   */
  static async signJWT(password: string, payload: any): Promise<string> {
    const ethrDid = await this.createEthrDID(password);
    
    const jwt = await ethrDid.signJWT({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
    });

    return jwt;
  }

  /**
   * Verify JWT
   */
  static async verifyJWT(jwt: string): Promise<any> {
    if (!this.resolver) {
      await this.initialize();
    }

    const { verifyJWT } = await import('did-jwt');
    
    try {
      const verified = await verifyJWT(jwt, {
        resolver: this.resolver,
        audience: 'did:ethr:mainnet'
      });

      return verified;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Create Verifiable Credential
   */
  static async createCredential(
    password: string,
    subject: any,
    type: string = 'VerifiableCredential'
  ): Promise<VerifiableCredential> {
    const did = await this.getCurrentDID();
    if (!did) {
      throw new Error('No DID available');
    }

    const credential: VerifiableCredential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      id: `urn:uuid:${crypto.randomUUID()}`,
      type: ['VerifiableCredential', type],
      issuer: did,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: did,
        ...subject
      },
      proof: {}
    };

    // Sign the credential
    const jwt = await this.signJWT(password, credential);
    credential.proof = {
      type: 'JwtProof2020',
      jwt
    };

    return credential;
  }

  /**
   * Save credential to vault
   */
  static async saveCredential(credential: VerifiableCredential): Promise<void> {
    const credentials = await this.getCredentials();
    credentials.push(credential);
    await StorageService.set('verifiable_credentials', credentials);
  }

  /**
   * Get all credentials
   */
  static async getCredentials(): Promise<VerifiableCredential[]> {
    return await StorageService.get<VerifiableCredential[]>('verifiable_credentials') || [];
  }

  /**
   * Delete credential
   */
  static async deleteCredential(id: string): Promise<void> {
    const credentials = await this.getCredentials();
    const filtered = credentials.filter(c => c.id !== id);
    await StorageService.set('verifiable_credentials', filtered);
  }

  /**
   * Verify credential
   */
  static async verifyCredential(credential: VerifiableCredential): Promise<boolean> {
    try {
      if (!credential.proof || !credential.proof.jwt) {
        return false;
      }

      const verified = await this.verifyJWT(credential.proof.jwt);
      return verified !== null;
    } catch {
      return false;
    }
  }

  /**
   * Create DID authentication proof
   */
  static async createAuthProof(password: string, challenge: string): Promise<string> {
    const payload = {
      challenge,
      type: 'DIDAuthentication'
    };

    return await this.signJWT(password, payload);
  }

  /**
   * Verify DID authentication proof
   */
  static async verifyAuthProof(proof: string, expectedChallenge: string): Promise<boolean> {
    try {
      const verified = await this.verifyJWT(proof);
      
      if (!verified || !verified.payload) {
        return false;
      }

      return verified.payload.challenge === expectedChallenge;
    } catch {
      return false;
    }
  }

  /**
   * Get DID info summary
   */
  static async getDIDInfo(): Promise<{
    did: string;
    address: string;
    document: DIDDocument | null;
    credentialsCount: number;
  } | null> {
    const account = await WalletService.getCurrentAccount();
    if (!account) return null;

    const did = await this.getCurrentDID();
    if (!did) return null;

    const document = await this.resolveDID(did);
    const credentials = await this.getCredentials();

    return {
      did,
      address: account.address,
      document,
      credentialsCount: credentials.length
    };
  }

  /**
   * Export DID data
   */
  static async exportDIDData(): Promise<string> {
    const info = await this.getDIDInfo();
    const credentials = await this.getCredentials();

    const data = {
      did: info?.did,
      address: info?.address,
      credentials,
      exportDate: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import credentials
   */
  static async importCredentials(jsonData: string): Promise<number> {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.credentials || !Array.isArray(data.credentials)) {
        throw new Error('Invalid format');
      }

      const existing = await this.getCredentials();
      const newCredentials = [...existing, ...data.credentials];
      
      await StorageService.set('verifiable_credentials', newCredentials);
      
      return data.credentials.length;
    } catch (error) {
      throw new Error('Failed to import credentials');
    }
  }
}
