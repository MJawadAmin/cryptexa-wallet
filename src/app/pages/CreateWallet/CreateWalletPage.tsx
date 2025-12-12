import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, AlertTriangle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { useWallet } from '../../context/WalletContext';

interface CreateWalletPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export const CreateWalletPage: React.FC<CreateWalletPageProps> = ({
  onBack,
  onComplete
}) => {
  const [step, setStep] = useState<'password' | 'mnemonic' | 'confirm'>('password');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { createWallet } = useWallet();

  const handleCreatePassword = async () => {
    setError('');

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
      const result = await createWallet(password);
      setMnemonic(result.mnemonic);
      setStep('mnemonic');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
  };

  const handleDownloadMnemonic = () => {
    const blob = new Blob([mnemonic], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cryptexa-wallet-backup.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmAndContinue = () => {
    if (confirmed) {
      onComplete();
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
            Create New Wallet
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          <StepIndicator active={step === 'password'} completed={step !== 'password'}>
            1
          </StepIndicator>
          <div className={`flex-1 h-1 mx-2 ${step !== 'password' ? 'bg-primary-500' : 'bg-gray-700'}`} />
          <StepIndicator active={step === 'mnemonic'} completed={step === 'confirm'}>
            2
          </StepIndicator>
          <div className={`flex-1 h-1 mx-2 ${step === 'confirm' ? 'bg-primary-500' : 'bg-gray-700'}`} />
          <StepIndicator active={step === 'confirm'}>
            3
          </StepIndicator>
        </div>

        {/* Content */}
        {step === 'password' && (
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Create Password
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This password will encrypt your wallet on this device.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter password"
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
                error={error}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCreatePassword}
              loading={loading}
            >
              Continue
            </Button>
          </Card>
        )}

        {step === 'mnemonic' && (
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Secret Recovery Phrase
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Write down or copy these words in the correct order and save them somewhere safe.
              </p>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    Never share your recovery phrase!
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Anyone with this phrase can access your funds.
                  </p>
                </div>
              </div>
            </div>

            {/* Mnemonic Grid */}
            <div className="grid grid-cols-3 gap-3">
              {mnemonic.split(' ').map((word, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-dark-hover rounded-lg p-3 text-center"
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {word}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={handleCopyMnemonic}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={handleDownloadMnemonic}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setStep('confirm')}
            >
              I've Saved It
            </Button>
          </Card>
        )}

        {step === 'confirm' && (
          <Card className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Confirm Backup
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please confirm you have saved your recovery phrase.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                    Important Notice
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    If you lose your recovery phrase, you will lose access to your wallet permanently. We cannot recover it for you.
                  </p>
                </div>
              </div>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I understand that Cryptexa Wallet cannot recover my recovery phrase. I have saved it in a safe place.
              </span>
            </label>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleConfirmAndContinue}
              disabled={!confirmed}
            >
              Complete Setup
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

const StepIndicator: React.FC<{ active: boolean; completed?: boolean; children: React.ReactNode }> = ({
  active,
  completed,
  children
}) => {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
        active
          ? 'bg-primary-500 text-white'
          : completed
          ? 'bg-primary-500 text-white'
          : 'bg-gray-700 text-gray-400'
      }`}
    >
      {children}
    </div>
  );
};
