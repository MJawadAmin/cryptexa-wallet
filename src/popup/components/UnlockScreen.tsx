import React, { useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';

const UnlockScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const { unlockWallet, isLoading, error, clearError } = useWalletStore();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      return;
    }

    await unlockWallet(password);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🔒 Cryptexa Wallet</h1>
      </div>
      <div className="content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Enter your password to unlock
          </p>
        </div>

        <form onSubmit={handleUnlock}>
          {error && <div className="error">{error}</div>}

          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError();
            }}
            placeholder="Enter password"
            autoFocus
          />

          <button
            type="submit"
            className="button"
            disabled={isLoading || !password}
            style={{ marginTop: '16px' }}
          >
            {isLoading ? 'Unlocking...' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnlockScreen;
