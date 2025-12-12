import React, { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { NetworkType } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';
import CredentialVault from './CredentialVault';

const MainWallet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'credentials' | 'settings'>('wallet');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const {
    address,
    did,
    balance,
    transactions,
    network,
    lockWallet,
    refreshBalance,
    refreshTransactions,
    switchNetwork,
  } = useWalletStore();

  useEffect(() => {
    refreshBalance();
    refreshTransactions();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      refreshBalance();
      refreshTransactions();
    }, 30000);

    return () => clearInterval(interval);
  }, [network]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const renderWalletTab = () => (
    <>
      <div className="card">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Total Balance
          </div>
          <div className="balance">{parseFloat(balance).toFixed(4)} ETH</div>
          <div className="address">{address}</div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button
            className="button"
            onClick={() => setShowSendModal(true)}
            style={{ flex: 1 }}
          >
            📤 Send
          </button>
          <button
            className="button button-secondary"
            onClick={() => setShowReceiveModal(true)}
            style={{ flex: 1 }}
          >
            📥 Receive
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
          Recent Transactions
        </h3>

        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
            No transactions yet
          </div>
        ) : (
          <div>
            {transactions.slice(0, 10).map((tx) => (
              <div key={tx.hash} className="transaction-item">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {tx.from.toLowerCase() === address?.toLowerCase() ? '📤 Sent' : '📥 Received'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>
                    {tx.value} {tx.asset}
                  </div>
                  <div style={{ fontSize: '12px', color: tx.status === 'confirmed' ? '#10b981' : '#ef4444' }}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderSettingsTab = () => (
    <div className="card">
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
        Settings
      </h3>

      <label className="label">Network</label>
      <select
        className="network-select"
        value={network}
        onChange={(e) => switchNetwork(e.target.value as NetworkType)}
        style={{ width: '100%', marginTop: '8px' }}
      >
        <option value={NetworkType.ETHEREUM_MAINNET}>Ethereum Mainnet</option>
        <option value={NetworkType.ETHEREUM_SEPOLIA}>Ethereum Sepolia</option>
        <option value={NetworkType.POLYGON}>Polygon</option>
        <option value={NetworkType.BSC}>Binance Smart Chain</option>
      </select>

      <div style={{ marginTop: '24px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          Cryptexa ID (DID)
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', wordBreak: 'break-all' }}>
          {did || 'Not created'}
        </div>
      </div>

      <button
        className="button"
        onClick={lockWallet}
        style={{ marginTop: '24px', background: '#ef4444' }}
      >
        🔒 Lock Wallet
      </button>
    </div>
  );

  return (
    <div className="container">
      <div className="header">
        <h1>🌟 Cryptexa</h1>
        <button
          onClick={lockWallet}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔒 Lock
        </button>
      </div>

      <div className="tab-nav">
        <button
          className={`tab ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          💰 Wallet
        </button>
        <button
          className={`tab ${activeTab === 'credentials' ? 'active' : ''}`}
          onClick={() => setActiveTab('credentials')}
        >
          🎫 Credentials
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="content">
        {activeTab === 'wallet' && renderWalletTab()}
        {activeTab === 'credentials' && <CredentialVault />}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>

      {showSendModal && <SendModal onClose={() => setShowSendModal(false)} />}
      {showReceiveModal && <ReceiveModal onClose={() => setShowReceiveModal(false)} />}
    </div>
  );
};

export default MainWallet;
