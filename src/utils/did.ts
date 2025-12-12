import { EthrDID } from 'ethr-did';
import { Resolver } from 'did-resolver';
import { getResolver as getEthrResolver } from 'ethr-did-resolver';
import { createJWT, verifyJWT, decodeJWT } from 'did-jwt';
import { ethers } from 'ethers';
import {
  DIDDocument,
  VerifiableCredential,
  VerifiablePresentation,
  Proof,
} from '@/types';

/**
 * DID management utilities for Cryptexa ID
 * Implements W3C DID specification with did:ethr method
 */

// Configure DID resolver for multiple networks
const providerConfig = {
  networks: [
    {
      name: 'mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    },
    {
      name: 'sepolia',
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    },
  ],
};

const ethrResolver = getEthrResolver(providerConfig);
const didResolver = new Resolver(ethrResolver);

/**
 * Create a new DID from a private key
 */
export function createDID(privateKey: string, chainId: number = 1): EthrDID {
  // Remove '0x' prefix if present
  const cleanKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
  
  const did = new EthrDID({
    identifier: ethers.computeAddress('0x' + cleanKey),
    privateKey: cleanKey,
    chainNameOrId: chainId,
  });

  return did;
}

/**
 * Generate DID identifier from address
 */
export function getDIDIdentifier(address: string, chainId: number = 1): string {
  return `did:ethr:${chainId === 1 ? '' : `0x${chainId.toString(16)}:`}${address}`;
}

/**
 * Resolve a DID to its DID Document
 */
export async function resolveDID(did: string): Promise<DIDDocument | null> {
  try {
    const result = await didResolver.resolve(did);
    
    if (result.didDocument) {
      return result.didDocument as DIDDocument;
    }
    
    return null;
  } catch (error) {
    console.error('DID resolution failed:', error);
    return null;
  }
}

/**
 * Create a Verifiable Credential
 */
export async function createVerifiableCredential(
  issuerDID: EthrDID,
  subjectDID: string,
  claims: Record<string, any>,
  expiresIn: number = 31536000 // 1 year in seconds
): Promise<VerifiableCredential> {
  const issuanceDate = new Date().toISOString();
  const expirationDate = new Date(Date.now() + expiresIn * 1000).toISOString();

  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1',
    ],
    id: `urn:uuid:${crypto.randomUUID()}`,
    type: ['VerifiableCredential'],
    issuer: issuerDID.did,
    issuanceDate,
    expirationDate,
    credentialSubject: {
      id: subjectDID,
      ...claims,
    },
  };

  // Create JWT proof
  const jwt = await createJWT(
    {
      vc: credential,
      sub: subjectDID,
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    },
    {
      issuer: issuerDID.did,
      signer: issuerDID.signer!,
    },
    { alg: 'ES256K-R' }
  );

  const proof: Proof = {
    type: 'JwtProof2020',
    created: issuanceDate,
    proofPurpose: 'assertionMethod',
    verificationMethod: `${issuerDID.did}#controller`,
    jws: jwt,
  };

  return {
    ...credential,
    proof,
  } as VerifiableCredential;
}

/**
 * Verify a Verifiable Credential
 */
export async function verifyCredential(
  credential: VerifiableCredential
): Promise<{ verified: boolean; error?: string }> {
  try {
    if (!credential.proof || !credential.proof.jws) {
      return { verified: false, error: 'No proof found in credential' };
    }

    const verified = await verifyJWT(credential.proof.jws, {
      resolver: didResolver,
    });

    // Check expiration
    if (credential.expirationDate) {
      const expDate = new Date(credential.expirationDate);
      if (expDate < new Date()) {
        return { verified: false, error: 'Credential has expired' };
      }
    }

    return { verified: !!verified };
  } catch (error) {
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Create a Verifiable Presentation
 */
export async function createVerifiablePresentation(
  holderDID: EthrDID,
  credentials: VerifiableCredential[],
  challenge?: string,
  domain?: string
): Promise<VerifiablePresentation> {
  const presentation = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
    ],
    type: ['VerifiablePresentation'],
    holder: holderDID.did,
    verifiableCredential: credentials,
  };

  const jwtPayload: any = {
    vp: presentation,
    sub: holderDID.did,
    nbf: Math.floor(Date.now() / 1000),
  };

  if (challenge) {
    jwtPayload.nonce = challenge;
  }

  if (domain) {
    jwtPayload.aud = domain;
  }

  const jwt = await createJWT(
    jwtPayload,
    {
      issuer: holderDID.did,
      signer: holderDID.signer!,
    },
    { alg: 'ES256K-R' }
  );

  const proof: Proof = {
    type: 'JwtProof2020',
    created: new Date().toISOString(),
    proofPurpose: 'authentication',
    verificationMethod: `${holderDID.did}#controller`,
    jws: jwt,
  };

  return {
    ...presentation,
    proof,
  } as VerifiablePresentation;
}

/**
 * Verify a Verifiable Presentation
 */
export async function verifyPresentation(
  presentation: VerifiablePresentation,
  challenge?: string,
  domain?: string
): Promise<{ verified: boolean; error?: string }> {
  try {
    if (!presentation.proof || !presentation.proof.jws) {
      return { verified: false, error: 'No proof found in presentation' };
    }

    const verified = await verifyJWT(presentation.proof.jws, {
      resolver: didResolver,
      audience: domain,
    });

    if (!verified) {
      return { verified: false, error: 'Invalid presentation signature' };
    }

    // Verify challenge if provided
    if (challenge) {
      const decoded = decodeJWT(presentation.proof.jws);
      if (decoded.payload.nonce !== challenge) {
        return { verified: false, error: 'Challenge mismatch' };
      }
    }

    // Verify all credentials in the presentation
    for (const credential of presentation.verifiableCredential) {
      const credResult = await verifyCredential(credential);
      if (!credResult.verified) {
        return {
          verified: false,
          error: `Credential verification failed: ${credResult.error}`,
        };
      }
    }

    return { verified: true };
  } catch (error) {
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Sign a challenge with DID for authentication
 */
export async function signChallenge(
  did: EthrDID,
  challenge: string,
  domain: string
): Promise<string> {
  const jwt = await createJWT(
    {
      challenge,
      aud: domain,
      sub: did.did,
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
    },
    {
      issuer: did.did,
      signer: did.signer!,
    },
    { alg: 'ES256K-R' }
  );

  return jwt;
}

/**
 * Verify a signed challenge
 */
export async function verifyChallenge(
  jwt: string,
  expectedChallenge: string,
  expectedDomain: string
): Promise<boolean> {
  try {
    const verified = await verifyJWT(jwt, {
      resolver: didResolver,
      audience: expectedDomain,
    });

    if (!verified) {
      return false;
    }

    const decoded = decodeJWT(jwt);
    return decoded.payload.challenge === expectedChallenge;
  } catch (error) {
    return false;
  }
}
