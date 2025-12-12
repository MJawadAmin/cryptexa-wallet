import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Send,
  Download,
  History,
  Settings,
  LogOut,
  Copy,
  Check,
  ChevronDown,
  Plus,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { useWallet } from '../../context/WalletContext';
import { useTheme } from '../../context/ThemeContext';
import QRCode from 'qrcode.react';

export const DashboardPage: React.FC = () => {
  const {
    currentAccount,
    accounts,
    currentNetwork,
    balance,
    lockWallet,
    switchAccount,
    switchNetwork,
    createNewAccount,
    sendTransaction,
    refreshBalance
  } = useWallet();

  const { theme, toggleTheme } = useTheme();

  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  // Refresh balance periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshBalance();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCopyAddress = () => {
    if (currentAccount) {
      navigator.clipboard.writeText(currentAccount.address);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Cryptexa Wallet
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Web3 with DID
                </p>
              </div>
            </div>

            {/* Network Selector */}
            <button
              onClick={() => setShowNetworkModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-dark-hover rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {currentNetwork?.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Lock Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => lockWallet()}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Balance Card */}
          <Card gradient className="text-center py-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="text-white/80 text-sm mb-2">Total Balance</p>
              <h2 className="text-5xl font-bold text-white mb-4">
                {parseFloat(balance).toFixed(4)} {currentNetwork?.symbol}
              </h2>
              
              {/* Account */}
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <button
                  onClick={() => setShowAccountModal(true)}
                  className="text-white font-medium hover:underline"
                >
                  {currentAccount?.name}
                </button>
                <span className="text-white/60">•</span>
                <span className="text-white/90 font-mono text-sm">
                  {currentAccount && formatAddress(currentAccount.address)}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {addressCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <QuickAction
              icon={<Send className="w-6 h-6" />}
              label="Send"
              onClick={() => setShowSendModal(true)}
            />
            <QuickAction
              icon={<Download className="w-6 h-6" />}
              label="Receive"
              onClick={() => setShowReceiveModal(true)}
            />
            <QuickAction
              icon={<History className="w-6 h-6" />}
              label="Activity"
              onClick={() => {}}
            />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-primary-500" />}
              title="Cryptexa ID"
              description="Manage your decentralized identity"
              onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html#/did') })}
            />
            <FeatureCard
              icon={<Wallet className="w-8 h-8 text-secondary-500" />}
              title="Multi-Account"
              description="Manage multiple accounts"
              onClick={() => setShowAccountModal(true)}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-accent-500" />}
              title="dApp Connect"
              description="Connect to Web3 applications"
              onClick={() => {}}
            />
            <FeatureCard
              icon={<Settings className="w-8 h-8 text-gray-500" />}
              title="Settings"
              description="Preferences and security"
              onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html#/settings') })}
            />
          </div>

          {/* Recent Transactions */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <button className="text-primary-500 text-sm hover:underline">
                View All
              </button>
            </div>
            
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
            </div>
          </Card>
        </div>
      </main>

      {/* Send Modal */}
      <SendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSend={sendTransaction}
        network={currentNetwork}
      />

      {/* Receive Modal */}
      <ReceiveModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        address={currentAccount?.address || ''}
      />

      {/* Account Modal */}
      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        accounts={accounts}
        currentAccount={currentAccount}
        onSwitch={switchAccount}
        onCreate={createNewAccount}
      />

      {/* Network Modal */}
      <NetworkModal
        isOpen={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        currentNetwork={currentNetwork}
        onSwitch={switchNetwork}
      />
    </div>
  );
};

// Quick Action Component
const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 flex flex-col items-center space-y-2 hover:shadow-lg transition-all"
    >
      <div className="text-primary-500">{icon}</div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </span>
    </motion.button>
  );
};

// Feature Card Component
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => {
  return (
    <Card hover onClick={onClick}>
      <div className="flex items-start space-x-4">
        <div>{icon}</div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Send Modal Component
const SendModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSend: (to: string, amount: string, password: string) => Promise<string>;
  network: any;
}> = ({ isOpen, onClose, onSend, network }) => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    setError('');
    setLoading(true);
    
    try {
      await onSend(to, amount, password);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setTo('');
        setAmount('');
        setPassword('');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Transaction">
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Transaction Sent!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your transaction has been submitted to the network
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Recipient Address"
            placeholder="0x..."
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          
          <Input
            label={`Amount (${network?.symbol})`}
            type="number"
            step="0.000001"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSend}
            loading={loading}
          >
            Send Transaction
          </Button>
        </div>
      )}
    </Modal>
  );
};

// Receive Modal Component
const ReceiveModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  address: string;
}> = ({ isOpen, onClose, address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receive">
      <div className="text-center space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          Scan QR code or copy address to receive funds
        </p>

        <div className="bg-white p-4 rounded-lg inline-block">
          <QRCode value={address} size={200} />
        </div>

        <div className="bg-gray-100 dark:bg-dark-hover rounded-lg p-4">
          <p className="text-sm font-mono text-gray-900 dark:text-white break-all mb-2">
            {address}
          </p>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Account Modal Component
const AccountModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  accounts: any[];
  currentAccount: any;
  onSwitch: (index: number) => Promise<void>;
  onCreate: (password: string) => Promise<any>;
}> = ({ isOpen, onClose, accounts, currentAccount, onSwitch, onCreate }) => {
  const [creating, setCreating] = useState(false);
  const [password, setPassword] = useState('');

  const handleCreate = async () => {
    if (!password) return;
    setCreating(true);
    try {
      await onCreate(password);
      setPassword('');
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Accounts">
      <div className="space-y-4">
        {accounts.map((account, index) => (
          <button
            key={index}
            onClick={() => {
              onSwitch(index);
              onClose();
            }}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              currentAccount?.address === account.address
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-dark-border hover:border-primary-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  {account.name}
                </p>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {`${account.address.slice(0, 10)}...${account.address.slice(-8)}`}
                </p>
              </div>
              {currentAccount?.address === account.address && (
                <Check className="w-5 h-5 text-primary-500" />
              )}
            </div>
          </button>
        ))}

        <div className="pt-4 border-t border-gray-200 dark:border-dark-border space-y-3">
          <Input
            type="password"
            placeholder="Enter password to create new account"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="outline"
            fullWidth
            onClick={handleCreate}
            loading={creating}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Account
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Network Modal Component
const NetworkModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentNetwork: any;
  onSwitch: (chainId: number) => Promise<void>;
}> = ({ isOpen, onClose, currentNetwork, onSwitch }) => {
  const networks = [
    { chainId: 1, name: 'Ethereum', symbol: 'ETH' },
    { chainId: 137, name: 'Polygon', symbol: 'MATIC' },
    { chainId: 56, name: 'BSC', symbol: 'BNB' },
    { chainId: 42161, name: 'Arbitrum', symbol: 'ETH' },
    { chainId: 10, name: 'Optimism', symbol: 'ETH' },
    { chainId: 43114, name: 'Avalanche', symbol: 'AVAX' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Network">
      <div className="space-y-2">
        {networks.map((network) => (
          <button
            key={network.chainId}
            onClick={() => {
              onSwitch(network.chainId);
              onClose();
            }}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              currentNetwork?.chainId === network.chainId
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-dark-border hover:border-primary-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {network.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {network.symbol}
                  </p>
                </div>
              </div>
              {currentNetwork?.chainId === network.chainId && (
                <Check className="w-5 h-5 text-primary-500" />
              )}
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
};
