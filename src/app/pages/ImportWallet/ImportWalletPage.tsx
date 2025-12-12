import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { useWallet } from '../../context/WalletContext';

interface ImportWalletPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export const ImportWalletPage: React.FC<ImportWalletPageProps> = ({
  onBack,
  onComplete
}) => {
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { importWallet } = useWallet();

  const handleImport = async () => {
    setError('');

    if (!mnemonic.trim()) {
      setError('Please enter your recovery phrase');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await importWallet(mnemonic.trim(), password);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to import wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">
            Import Existing Wallet
          </h1>
        </div>

        <Card className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Recovery Phrase
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your 12-word recovery phrase to restore your wallet.
            </p>
          </div>

          {/* Mnemonic Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secret Recovery Phrase
            </label>
            <textarea
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              placeholder="Enter your 12-word recovery phrase separated by spaces"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Password */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                placeholder="Enter password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Input
              type={showPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleImport}
            loading={loading}
          >
            Import Wallet
          </Button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Make sure you're in a private place and no one can see your screen
          </p>
        </Card>
      </motion.div>
    </div>
  );
};
