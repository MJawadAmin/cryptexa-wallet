import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Key, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useWalletStore } from '@/store/wallet-store';
import { cn } from '@/utils/cn';
import LogoReveal from './LogoReveal';

interface WelcomeScreenProps {
  onWalletCreated: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onWalletCreated }) => {
  const [mode, setMode] = useState<'welcome' | 'create' | 'restore'>('welcome');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');

  const { createWallet, restoreWallet, isLoading, error, clearError } = useWalletStore();

  const handleCreateWallet = async () => {
    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const result = await createWallet(password);

    if (result.success && result.mnemonic) {
      setGeneratedMnemonic(result.mnemonic);
      setShowMnemonic(true);
    }
  };

  const handleRestoreWallet = async () => {
    if (!mnemonic.trim()) {
      alert('Please enter your seed phrase');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const result = await restoreWallet(mnemonic.trim(), password);

    if (result.success) {
      onWalletCreated();
    }
  };

  const handleConfirmMnemonic = () => {
    onWalletCreated();
  };

  if (showMnemonic) {
    return (
      <div className="container">
        <div className="header">
          <h1>🔐 Backup Your Seed Phrase</h1>
        </div>
        <div className="content">
          <div className="card">
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              Write down these 12 words in order and store them safely. This is the ONLY way to recover your wallet.
            </p>

            <div className="seed-phrase">
              {generatedMnemonic}
            </div>

            <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: '#92400e' }}>
                ⚠️ Never share your seed phrase with anyone. Cryptexa will never ask for it.
              </p>
            </div>

            <button
              className="button"
              onClick={handleConfirmMnemonic}
              style={{ marginTop: '16px' }}
            >
              I've Saved My Seed Phrase
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'welcome') {
    return (
      <motion.div 
        className="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h1>🌟 Cryptexa Wallet</h1>
        </div>
        <div className="content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* Animated Logo Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ marginBottom: '24px' }}
          >
            <LogoReveal size="lg" autoPlay={true} />
          </motion.div>

          <motion.div 
            style={{ textAlign: 'center', marginBottom: '32px', width: '100%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome to Cryptexa
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Your secure crypto wallet with decentralized identity
            </p>
            <motion.div
              style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#667eea' }}>
                <Shield size={16} />
                <span>Secure</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#667eea' }}>
                <Sparkles size={16} />
                <span>DID Ready</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#667eea' }}>
                <Wallet size={16} />
                <span>Multi-Chain</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.button 
            className="button animate-glow" 
            onClick={() => setMode('create')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Create New Wallet
            <ArrowRight size={18} />
          </motion.button>

          <motion.button
            className="button button-secondary"
            onClick={() => setMode('restore')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Key size={18} />
            Restore Existing Wallet
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="container">
        <div className="header">
          <button
            onClick={() => {
              setMode('welcome');
              clearError();
            }}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}
          >
            ← Back
          </button>
          <h1>Create Wallet</h1>
          <div style={{ width: '24px' }} />
        </div>
        <div className="content">
          {error && <div className="error">{error}</div>}

          <label className="label">Create Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />

          <label className="label">Confirm Password</label>
          <input
            type="password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
          />

          <button
            className="button"
            onClick={handleCreateWallet}
            disabled={isLoading}
            style={{ marginTop: '24px' }}
          >
            {isLoading ? 'Creating...' : 'Create Wallet'}
          </button>
        </div>
      </div>
    );
  }

  // Restore mode
  return (
    <div className="container">
      <div className="header">
        <button
          onClick={() => {
            setMode('welcome');
            clearError();
          }}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}
        >
          ← Back
        </button>
        <h1>Restore Wallet</h1>
        <div style={{ width: '24px' }} />
      </div>
      <div className="content">
        {error && <div className="error">{error}</div>}

        <label className="label">Seed Phrase</label>
        <textarea
          className="input"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          placeholder="Enter your 12-word seed phrase"
          style={{ minHeight: '100px', fontFamily: 'monospace', fontSize: '13px' }}
        />

        <label className="label">Create Password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />

        <label className="label">Confirm Password</label>
        <input
          type="password"
          className="input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
        />

        <button
          className="button"
          onClick={handleRestoreWallet}
          disabled={isLoading}
          style={{ marginTop: '24px' }}
        >
          {isLoading ? 'Restoring...' : 'Restore Wallet'}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
