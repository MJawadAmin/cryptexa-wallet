import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { useWalletStore } from '@/store/wallet-store';
import LogoReveal from './LogoReveal';

const UnlockScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const { unlockWallet, isLoading, error, clearError } = useWalletStore();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      return;
    }

    await unlockWallet(password);
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <h1>🔒 Cryptexa Wallet</h1>
      </div>
      <div className="content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 200 }}
          style={{ marginBottom: '24px' }}
        >
          <LogoReveal size="md" autoPlay={true} />
        </motion.div>

        <motion.div 
          style={{ textAlign: 'center', marginBottom: '32px', width: '100%' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Enter your password to unlock
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleUnlock}
          style={{ width: '100%' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {error && (
            <motion.div 
              className="error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }} />
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              placeholder="Enter password"
              autoFocus
              style={{ paddingLeft: '42px' }}
            />
          </div>

          <motion.button
            type="submit"
            className="button"
            disabled={isLoading || !password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Lock size={18} />
                </motion.div>
                Unlocking...
              </>
            ) : (
              <>
                Unlock Wallet
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default UnlockScreen;
