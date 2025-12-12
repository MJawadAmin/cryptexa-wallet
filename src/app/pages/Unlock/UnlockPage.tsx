import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useWallet } from '../../context/WalletContext';

interface UnlockPageProps {
  onUnlock: () => void;
}

export const UnlockPage: React.FC<UnlockPageProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { unlockWallet } = useWallet();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const success = await unlockWallet(password);
      if (success) {
        onUnlock();
      } else {
        setError('Incorrect password');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to unlock wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto shadow-glow">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Enter your password to unlock
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Unlock Wallet
          </Button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          If you forgot your password, you'll need to restore your wallet using your recovery phrase
        </p>
      </motion.div>
    </div>
  );
};
