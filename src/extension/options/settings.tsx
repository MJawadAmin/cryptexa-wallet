import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Shield, 
  Network, 
  Bell, 
  Moon, 
  Sun, 
  Wallet, 
  Lock,
  Globe,
  Eye,
  EyeOff,
  Zap,
  Info,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import '../../popup/styles.css';
import '../../popup/components/animations.css';

interface SettingsState {
  autoLockMinutes: number;
  showBalances: boolean;
  defaultNetwork: string;
  currency: string;
  darkMode: boolean;
  notifications: boolean;
  advancedMode: boolean;
  biometric: boolean;
}

const FullScreenOptions: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    autoLockMinutes: 5,
    showBalances: true,
    defaultNetwork: 'ethereum',
    currency: 'USD',
    darkMode: false,
    notifications: true,
    advancedMode: false,
    biometric: false
  });

  const [activeSection, setActiveSection] = useState<string>('general');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('settings', (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sections = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'networks', name: 'Networks', icon: Network },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: settings.darkMode ? Moon : Sun },
    { id: 'advanced', name: 'Advanced', icon: Zap },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#f8fafc'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Wallet size={32} />
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                Cryptexa Wallet Settings
              </h1>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>
                Configure your wallet preferences and security
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', display: 'flex', gap: '32px' }}>
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            width: '250px',
            flexShrink: 0
          }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{section.name}</span>
                  {isActive && <ChevronRight size={16} />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1 }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Settings size={24} />
                  General Settings
                </h2>

                <SettingRow
                  label="Default Currency"
                  description="Choose your preferred currency for displaying balances"
                  icon={<Globe size={20} />}
                >
                  <select
                    value={settings.currency}
                    onChange={(e) => updateSetting('currency', e.target.value)}
                    className="network-select"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#f8fafc', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '8px 12px', borderRadius: '6px' }}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </SettingRow>

                <SettingRow
                  label="Show Balances"
                  description="Display wallet balances on dashboard"
                  icon={settings.showBalances ? <Eye size={20} /> : <EyeOff size={20} />}
                >
                  <ToggleSwitch
                    checked={settings.showBalances}
                    onChange={(checked) => updateSetting('showBalances', checked)}
                  />
                </SettingRow>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Shield size={24} />
                  Security Settings
                </h2>

                <SettingRow
                  label="Auto-Lock Timer"
                  description="Automatically lock wallet after period of inactivity"
                  icon={<Lock size={20} />}
                >
                  <select
                    value={settings.autoLockMinutes}
                    onChange={(e) => updateSetting('autoLockMinutes', parseInt(e.target.value))}
                    className="network-select"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#f8fafc', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '8px 12px', borderRadius: '6px' }}
                  >
                    <option value="1">1 minute</option>
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="0">Never</option>
                  </select>
                </SettingRow>

                <SettingRow
                  label="Biometric Authentication"
                  description="Use fingerprint or face recognition to unlock wallet"
                  icon={<Sparkles size={20} />}
                >
                  <ToggleSwitch
                    checked={settings.biometric}
                    onChange={(checked) => updateSetting('biometric', checked)}
                  />
                </SettingRow>

                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '24px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#fecaca' }}>Security Reminder</p>
                    <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                      Never share your seed phrase or private keys. Cryptexa will never ask for them.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Networks Settings */}
            {activeSection === 'networks' && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Network size={24} />
                  Network Settings
                </h2>

                <SettingRow
                  label="Default Network"
                  description="Network to use when opening wallet"
                  icon={<Globe size={20} />}
                >
                  <select
                    value={settings.defaultNetwork}
                    onChange={(e) => updateSetting('defaultNetwork', e.target.value)}
                    className="network-select"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#f8fafc', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '8px 12px', borderRadius: '6px' }}
                  >
                    <option value="ethereum">Ethereum Mainnet</option>
                    <option value="sepolia">Sepolia Testnet</option>
                    <option value="polygon">Polygon</option>
                    <option value="bsc">Binance Smart Chain</option>
                    <option value="arbitrum">Arbitrum</option>
                    <option value="optimism">Optimism</option>
                  </select>
                </SettingRow>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={24} />
                  Notification Settings
                </h2>

                <SettingRow
                  label="Enable Notifications"
                  description="Receive notifications for transactions and events"
                  icon={<Bell size={20} />}
                >
                  <ToggleSwitch
                    checked={settings.notifications}
                    onChange={(checked) => updateSetting('notifications', checked)}
                  />
                </SettingRow>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {settings.darkMode ? <Moon size={24} /> : <Sun size={24} />}
                  Appearance Settings
                </h2>

                <SettingRow
                  label="Dark Mode"
                  description="Toggle dark mode theme"
                  icon={settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                >
                  <ToggleSwitch
                    checked={settings.darkMode}
                    onChange={(checked) => updateSetting('darkMode', checked)}
                  />
                </SettingRow>

                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '24px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <Info size={20} style={{ color: '#3b82f6', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                      Dark mode is currently in development. This setting will apply in future updates.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeSection === 'advanced' && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Zap size={24} />
                  Advanced Settings
                </h2>

                <SettingRow
                  label="Advanced Mode"
                  description="Enable advanced features and detailed transaction info"
                  icon={<Zap size={20} />}
                >
                  <ToggleSwitch
                    checked={settings.advancedMode}
                    onChange={(checked) => updateSetting('advancedMode', checked)}
                  />
                </SettingRow>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '24px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <AlertCircle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#fde68a' }}>Warning</p>
                    <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                      Advanced mode is for experienced users only. Incorrect settings may affect wallet functionality.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="button"
              style={{
                marginTop: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: saved ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                width: '100%'
              }}
            >
              {saved ? (
                <>
                  <CheckCircle2 size={18} />
                  Settings Saved!
                </>
              ) : (
                <>
                  <Settings size={18} />
                  Save Settings
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper Components
const SettingRow: React.FC<{
  label: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, description, icon, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}
  >
    <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
      <div style={{ color: '#667eea' }}>{icon}</div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>{description}</p>
      </div>
    </div>
    <div>{children}</div>
  </motion.div>
);

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => (
  <motion.button
    onClick={() => onChange(!checked)}
    style={{
      width: '48px',
      height: '24px',
      borderRadius: '12px',
      background: checked ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(148, 163, 184, 0.3)',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.3s'
    }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      animate={{ x: checked ? 24 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '10px',
        background: 'white',
        position: 'absolute',
        top: '2px',
        left: '2px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      }}
    />
  </motion.button>
);

// Initialize
const container = document.getElementById('options-root');
if (container) {
  const root = createRoot(container);
  root.render(<FullScreenOptions />);
}

export default FullScreenOptions;
