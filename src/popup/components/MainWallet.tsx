import React, { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { NetworkType } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, CheckCircle, Wallet2, RefreshCw, LogOut, Send, Download, Activity, Shield, Sparkles, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';
import CredentialVault from './CredentialVault';
import { useToast } from './Toast';
import { LoadingOverlay } from './LoadingStates';
import './animations.css';

const MainWallet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'credentials' | 'settings'>('wallet');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showSuccess, showError, showInfo, ToastContainer } = useToast();

  const {
    address,
    did,
    balance,
    transactions,
    network,
    accounts,
    currentAccount,
    lockWallet,
    refreshBalance,
    refreshTransactions,
    switchNetwork,
    switchAccount,
    createNewAccount,
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

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        showSuccess('Address copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        showError('Failed to copy address');
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    showInfo('Refreshing wallet data...');
    try {
      await Promise.all([refreshBalance(), refreshTransactions()]);
      showSuccess('Wallet data refreshed!');
    } catch (error) {
      showError('Failed to refresh data');
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const handleClose = () => {
    window.close();
  };

  const handleCreateAccount = async () => {
    const password = prompt('Enter your password to create a new account:');
    if (!password) return;

    setIsProcessing(true);
    try {
      const result = await createNewAccount(password);
      if (result.success) {
        showSuccess('New account created successfully!');
        await refreshBalance();
        setShowAccountModal(false);
      } else {
        showError(result.error || 'Failed to create account');
      }
    } catch (error: any) {
      showError(error.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSwitchAccount = async (accountAddress: string) => {
    setIsProcessing(true);
    try {
      await switchAccount(accountAddress);
      showSuccess('Account switched successfully!');
      setShowAccountModal(false);
    } catch (error: any) {
      showError(error.message || 'Failed to switch account');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderWalletTab = () => (
    <>
      {/* Account Selector */}
      <div className="card" style={{ marginBottom: '12px', cursor: 'pointer' }} onClick={() => setShowAccountModal(true)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {currentAccount?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>{currentAccount?.name || 'Account 1'}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{formatAddress(address || '')}</div>
            </div>
          </div>
          <button style={{ 
            background: 'rgba(102, 126, 234, 0.1)', 
            border: 'none', 
            padding: '6px 12px', 
            borderRadius: '8px',
            fontSize: '12px',
            cursor: 'pointer',
            color: '#667eea'
          }}>
            Switch
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '8px' }}>
            Total Balance
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            {parseFloat(balance).toFixed(4)}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>ETH</div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '8px',
            marginTop: '12px',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            cursor: 'pointer'
          }} onClick={handleCopyAddress}>
            <span style={{ fontSize: '13px' }}>{formatAddress(address || '')}</span>
            {copied ? (
              <CheckCircle size={16} style={{ color: '#10b981' }} />
            ) : (
              <Copy size={16} />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSendModal(true);
            }}
            style={{ 
              flex: 1,
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              padding: '12px',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            📤 Send
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReceiveModal(true);
            }}
            style={{ 
              flex: 1,
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              padding: '12px',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
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

  // Account Modal
  const renderAccountModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={() => setShowAccountModal(false)}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        width: '90%',
        maxWidth: '360px',
        maxHeight: '80vh',
        overflow: 'auto'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Select Account</h3>
          <button onClick={() => setShowAccountModal(false)} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px'
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          {accounts?.map((account, index) => (
            <div
              key={account.address}
              onClick={() => handleSwitchAccount(account.address)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: account.address === address ? 'rgba(102, 126, 234, 0.1)' : '#f9fafb',
                marginBottom: '8px',
                cursor: 'pointer',
                border: account.address === address ? '2px solid #667eea' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, hsl(${index * 60}, 70%, 60%), hsl(${index * 60 + 30}, 70%, 50%))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {account.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{account.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{formatAddress(account.address)}</div>
                </div>
                {account.address === address && (
                  <CheckCircle size={20} style={{ color: '#667eea' }} />
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleCreateAccount}
          disabled={isProcessing}
          style={{
            width: '100%',
            padding: '12px',
            background: isProcessing ? '#6b7280' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
        >
          <Sparkles size={16} />
          {isProcessing ? 'Creating...' : '+ Create New Account'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="header" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1>🌟 Cryptexa</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '6px',
              borderRadius: '6px',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RefreshCw size={16} style={{ 
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none' 
            }} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={lockWallet}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <LogOut size={14} /> Lock
          </button>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
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
      {showAccountModal && renderAccountModal()}
      {isProcessing && <LoadingOverlay message="Processing your request..." />}
      
      <ToastContainer />
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scaleX(0.7); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MainWallet;
