import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, Zap } from 'lucide-react';
import { Button } from '../../components/Button';
import { useWallet } from '../../context/WalletContext';

interface LandingPageProps {
  onCreateWallet: () => void;
  onImportWallet: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onCreateWallet,
  onImportWallet
}) => {
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-block"
          >
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto shadow-glow">
              <Wallet className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Cryptexa Wallet
          </h1>
          <p className="text-gray-400">
            Your Gateway to Web3 with Decentralized Identity
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Secure & Encrypted"
            description="AES-256 encryption for your keys"
          />
          <FeatureCard
            icon={<Wallet className="w-6 h-6" />}
            title="Multi-Network"
            description="Support for Ethereum, Polygon, BSC & more"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="DID Integration"
            description="Decentralized Identity built-in"
          />
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onCreateWallet}
          >
            Create New Wallet
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={onImportWallet}
          >
            Import Existing Wallet
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          By continuing, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-start space-x-4"
    >
      <div className="text-primary-400 mt-1">
        {icon}
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};
