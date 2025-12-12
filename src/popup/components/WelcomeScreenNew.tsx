import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Key, Shield, Sparkles, ArrowLeft, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useWalletStore } from '@/store/wallet-store';
import { cn } from '@/utils/cn';

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
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(generatedMnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showMnemonic) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full flex flex-col p-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/20 rounded-xl">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Backup Seed Phrase</h1>
              <p className="text-xs text-slate-400">Keep this safe and secret</p>
            </div>
          </div>

          {/* Warning Card */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-4"
          >
            <p className="text-sm text-amber-200 leading-relaxed">
              ⚠️ Write down these 12 words in order. This is the ONLY way to recover your wallet. Never share it with anyone.
            </p>
          </motion.div>

          {/* Mnemonic Display */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-4 flex-1 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            
            <div className="grid grid-cols-3 gap-3">
              {generatedMnemonic.split(' ').map((word, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-900/50 rounded-lg p-2 text-center"
                >
                  <div className="text-xs text-slate-500 mb-1">{index + 1}</div>
                  <div className="text-sm font-mono text-white">{word}</div>
                </motion.div>
              ))}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyMnemonic}
              className="absolute top-4 right-4 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </motion.div>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onWalletCreated()}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-shadow"
          >
            I've Saved My Seed Phrase
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (mode === 'welcome') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full flex flex-col items-center justify-center p-8"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl animate-pulse-slow" />
            <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-3xl shadow-glow">
              <Wallet className="w-16 h-16 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Cryptexa
            </h1>
            <p className="text-slate-400">Your Web3 Identity & Wallet</p>
          </motion.div>

          {/* Buttons */}
          <div className="w-full space-y-4">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('create')}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all flex items-center justify-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Create New Wallet
            </motion.button>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode('restore')}
              className="w-full py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl font-semibold text-white hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2"
            >
              <Key className="w-5 h-5" />
              Restore Existing Wallet
            </motion.button>
          </div>

          {/* Security Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-auto flex items-center gap-2 text-slate-500 text-sm"
          >
            <Shield className="w-4 h-4" />
            <span>AES-256 Encrypted • BIP39 Compliant</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Create Mode
  if (mode === 'create') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-h-full flex flex-col p-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                setMode('welcome');
                clearError();
              }}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Create Wallet</h1>
              <p className="text-xs text-slate-400">Set up your password</p>
            </div>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4"
              >
                <p className="text-sm text-red-200">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              />
            </div>

            {/* Security Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4"
            >
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-cyan-200 leading-relaxed">
                  Your password encrypts your wallet locally. Make it strong and memorable.
                </div>
              </div>
            </motion.div>
          </div>

          {/* Create Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateWallet}
            disabled={isLoading}
            className={cn(
              "w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg transition-all mt-6",
              isLoading ? "opacity-50 cursor-not-allowed" : "shadow-cyan-500/50 hover:shadow-cyan-500/70"
            )}
          >
            {isLoading ? 'Creating...' : 'Create Wallet'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Restore Mode
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="min-h-full flex flex-col p-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              setMode('welcome');
              clearError();
            }}
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Restore Wallet</h1>
            <p className="text-xs text-slate-400">Enter your 12-word seed phrase</p>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4"
            >
              <p className="text-sm text-red-200">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Seed Phrase
            </label>
            <textarea
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              placeholder="Enter your 12-word seed phrase separated by spaces"
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>

        {/* Restore Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRestoreWallet}
          disabled={isLoading}
          className={cn(
            "w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white shadow-lg transition-all mt-6",
            isLoading ? "opacity-50 cursor-not-allowed" : "shadow-cyan-500/50 hover:shadow-cyan-500/70"
          )}
        >
          {isLoading ? 'Restoring...' : 'Restore Wallet'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
