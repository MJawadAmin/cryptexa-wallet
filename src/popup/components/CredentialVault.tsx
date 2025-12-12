import React, { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { VerifiableCredential } from '@/types';

const CredentialVault: React.FC = () => {
  const { credentials, refreshCredentials, storeCredential } = useWalletStore();
  const [selectedCredential, setSelectedCredential] = useState<VerifiableCredential | null>(null);

  useEffect(() => {
    refreshCredentials();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (credential: VerifiableCredential) => {
    if (!credential.expirationDate) return false;
    return new Date(credential.expirationDate) < new Date();
  };

  if (selectedCredential) {
    return (
      <div>
        <button
          onClick={() => setSelectedCredential(null)}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '16px',
          }}
        >
          ← Back to Credentials
        </button>

        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
            Credential Details
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>ID</div>
            <div style={{ fontSize: '13px', wordBreak: 'break-all' }}>
              {selectedCredential.id}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Type</div>
            <div style={{ fontSize: '14px' }}>
              {selectedCredential.type.join(', ')}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Issuer</div>
            <div style={{ fontSize: '13px', wordBreak: 'break-all' }}>
              {selectedCredential.issuer}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Issued</div>
            <div style={{ fontSize: '14px' }}>
              {formatDate(selectedCredential.issuanceDate)}
            </div>
          </div>

          {selectedCredential.expirationDate && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Expires</div>
              <div style={{ fontSize: '14px', color: isExpired(selectedCredential) ? '#ef4444' : '#10b981' }}>
                {formatDate(selectedCredential.expirationDate)}
                {isExpired(selectedCredential) && ' (Expired)'}
              </div>
            </div>
          )}

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Claims
            </div>
            <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
              <pre style={{ fontSize: '12px', margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(selectedCredential.credentialSubject, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
          🎫 Credential Vault
        </h3>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {credentials.length} credential{credentials.length !== 1 ? 's' : ''}
        </div>
      </div>

      {credentials.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎫</div>
          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
            No Credentials Yet
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Verifiable credentials you receive will appear here
          </div>
        </div>
      ) : (
        <div>
          {credentials.map((credential) => (
            <div
              key={credential.id}
              className="credential-item"
              onClick={() => setSelectedCredential(credential)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                    {credential.type.filter(t => t !== 'VerifiableCredential').join(', ') || 'Credential'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Issued: {formatDate(credential.issuanceDate)}
                  </div>
                  {credential.expirationDate && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: isExpired(credential) ? '#ef4444' : '#10b981',
                      marginTop: '4px'
                    }}>
                      {isExpired(credential) ? '❌ Expired' : '✅ Valid'}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '18px' }}>›</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#dbeafe', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
        <p style={{ fontSize: '12px', color: '#1e40af' }}>
          ℹ️ Credentials are cryptographically verified before being stored in your vault.
        </p>
      </div>
    </div>
  );
};

export default CredentialVault;
