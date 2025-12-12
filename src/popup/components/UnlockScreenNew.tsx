import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useWalletStore } from '@/store/wallet-store';
import { cn } from '@/utils/cn';

const UnlockScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { unlockWallet, isLoading, error, clearError } = useWalletStore();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      return;
    }

    await unlockWallet(password);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center p-8"
      >
        {/* Lock Icon Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-glow border border-slate-700/50"
          >
            <Lock className="w-12 h-12 text-cyan-400" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Enter your password to unlock</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleUnlock}
          className="w-full max-w-sm space-y-4"
        >
          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 overflow-hidden"
              >
                <p className="text-sm text-red-200">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Unlock Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || !password}
            className={cn(
              "w-full py-4 rounded-xl font-semibold text-white transition-all",
              isLoading || !password
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Shield className="w-5 h-5" />
                </motion.div>
                Unlocking...
              </span>
            ) : (
              'Unlock Wallet'
            )}
          </motion.button>
        </motion.form>

        {/* Security Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-auto flex items-center gap-2 text-slate-500 text-sm"
        >
          <Shield className="w-4 h-4" />
          <span>Auto-locks after 5 minutes</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnlockScreen;
