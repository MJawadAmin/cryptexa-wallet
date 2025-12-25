import React, { useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { useToast } from '@/hooks/useToast';
import {
  Settings,
  Shield,
  Globe,
  Bell,
  Eye,
  EyeOff,
  Key,
  Trash2,
  Download,
  Upload,
  Lock,
  Unlock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Wallet,
  Network,
  Zap,
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const { network, switchNetwork, lockWallet } = useWalletStore();
  
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'advanced'>('general');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [autoLockMinutes, setAutoLockMinutes] = useState(15);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState({
    transactions: true,
    priceAlerts: false,
    news: false,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Zap },
  ];

  const networks = [
    { id: 'ethereum', name: 'Ethereum Mainnet', chainId: 1 },
    { id: 'polygon', name: 'Polygon', chainId: 137 },
    { id: 'bsc', name: 'BSC', chainId: 56 },
    { id: 'goerli', name: 'Goerli Testnet', chainId: 5 },
  ];

  const handleExportWallet = () => {
    showToast('info', 'Exporting wallet data...', 2000);
    setTimeout(() => {
      showToast('success', 'Wallet exported successfully! Check your downloads.', 3000);
    }, 2000);
  };

  const handleResetWallet = () => {
    const confirmed = confirm(
      '⚠️ WARNING: This will erase all your wallet data. Make sure you have backed up your seed phrase. Continue?'
    );
    if (confirmed) {
      showToast('warning', 'Resetting wallet...', 2000);
      setTimeout(() => {
        showToast('success', 'Wallet reset complete. Please create a new wallet.', 3000);
      }, 2000);
    }
  };

  const handleNetworkSwitch = (networkId: string) => {
    showToast('info', `Switching to ${networkId}...`, 1500);
    setTimeout(() => {
      switchNetwork(networkId as any);
      showToast('success', `Connected to ${networkId}!`, 2000);
    }, 1500);
  };

  const handleSaveSettings = () => {
    showToast('info', 'Saving settings...', 1000);
    setTimeout(() => {
      showToast('success', 'Settings saved successfully!', 2000);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-sm md:text-base text-gray-400">
          Manage your wallet preferences and security
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white'
                  : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:border-[#3a3a3a]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          {/* Currency */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Currency</h3>
                <p className="text-sm text-gray-400">Choose your preferred display currency</p>
              </div>
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                showToast('success', `Currency changed to ${e.target.value}`, 2000);
              }}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>JPY</option>
              <option>CNY</option>
            </select>
          </div>

          {/* Language */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Language</h3>
                <p className="text-sm text-gray-400">Select your preferred language</p>
              </div>
              <Globe className="w-6 h-6 text-purple-500" />
            </div>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                showToast('success', `Language changed to ${e.target.value}`, 2000);
              }}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
              <option>Japanese</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Notifications</h3>
                <p className="text-sm text-gray-400">Configure notification preferences</p>
              </div>
              <Bell className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button
                    onClick={() => {
                      const newNotifications = { ...notifications, [key]: !value };
                      setNotifications(newNotifications);
                      showToast('success', `${key} notifications ${!value ? 'enabled' : 'disabled'}`, 2000);
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      value ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          {/* Auto-Lock */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Auto-Lock Timer</h3>
                <p className="text-sm text-gray-400">Automatically lock wallet after inactivity</p>
              </div>
              <Lock className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-white font-bold w-20 text-right">{autoLockMinutes} min</span>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Change Password</h3>
                <p className="text-sm text-gray-400">Update your wallet password</p>
              </div>
              <Key className="w-6 h-6 text-green-500" />
            </div>
            <button
              onClick={() => {
                const password = prompt('Enter new password:');
                if (password) {
                  showToast('success', 'Password updated successfully!', 3000);
                }
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all font-medium"
            >
              Change Password
            </button>
          </div>

          {/* Backup & Restore */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Backup & Restore</h3>
                <p className="text-sm text-gray-400">Export or import your wallet data</p>
              </div>
              <Download className="w-6 h-6 text-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportWallet}
                className="bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-400 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Export</span>
              </button>
              <button
                onClick={() => showToast('info', 'Import feature coming soon!', 2000)}
                className="bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-400 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Import</span>
              </button>
            </div>
          </div>

          {/* Show Private Key */}
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Private Key</h3>
                <p className="text-sm text-red-400">
                  Never share your private key with anyone!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPrivateKey(!showPrivateKey);
                showToast('warning', showPrivateKey ? 'Private key hidden' : 'Private key revealed', 2000);
              }}
              className="w-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {showPrivateKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span className="font-medium">
                {showPrivateKey ? 'Hide Private Key' : 'Show Private Key'}
              </span>
            </button>
            {showPrivateKey && (
              <div className="mt-4 p-4 bg-black/50 rounded-lg">
                <p className="text-xs text-gray-400 font-mono break-all">
                  0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      {activeTab === 'advanced' && (
        <div className="space-y-4">
          {/* Network Selection */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Network</h3>
                <p className="text-sm text-gray-400">Select blockchain network</p>
              </div>
              <Network className="w-6 h-6 text-blue-500" />
            </div>
            <div className="grid gap-3">
              {networks.map((net) => (
                <button
                  key={net.id}
                  onClick={() => handleNetworkSwitch(net.id)}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    network === net.id
                      ? 'bg-blue-500/20 border-blue-500/30'
                      : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
                  }`}
                >
                  <div>
                    <p className="text-white font-medium">{net.name}</p>
                    <p className="text-xs text-gray-400">Chain ID: {net.chainId}</p>
                  </div>
                  {network === net.id && <CheckCircle className="w-5 h-5 text-blue-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Wallet */}
          <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Reset Wallet</h3>
                <p className="text-sm text-red-400">
                  This will erase all your wallet data. Make sure you have backed up!
                </p>
              </div>
            </div>
            <button
              onClick={handleResetWallet}
              className="w-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Trash2 className="w-5 h-5" />
              Reset Wallet
            </button>
          </div>

          {/* Developer Tools */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Developer Tools</h3>
                <p className="text-sm text-gray-400">Advanced developer options</p>
              </div>
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="space-y-3">
              <button
                onClick={() => showToast('info', 'Console logs enabled', 2000)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] text-white py-3 px-4 rounded-lg transition-all text-left"
              >
                Enable Debug Mode
              </button>
              <button
                onClick={() => showToast('info', 'Cache cleared', 2000)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] text-white py-3 px-4 rounded-lg transition-all text-left"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSaveSettings}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl transition-all font-bold text-lg shadow-lg"
        >
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
