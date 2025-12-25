import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Wallet2, Shield, Sparkles, Zap } from 'lucide-react';

interface LogoRevealProps {
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  autoPlay?: boolean;
}

const LogoReveal: React.FC<LogoRevealProps> = ({ 
  onComplete, 
  size = 'lg',
  autoPlay = true 
}) => {
  const [isAnimating, setIsAnimating] = useState(autoPlay);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 64
  };

  // Animation variants for logo pieces
  const pieceVariants = {
    initial: (custom: number) => ({
      opacity: 0,
      scale: 0.3,
      x: Math.cos(custom * Math.PI / 2) * 100,
      y: Math.sin(custom * Math.PI / 2) * 100,
      rotate: custom * 90
    }),
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.8
      }
    }
  };

  // Container animation
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Glow effect
  const glowVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 0.8, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Sparkle effects
  const sparkleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (custom: number) => ({
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      x: [0, custom * 30, custom * 50],
      y: [0, -custom * 20, -custom * 40],
      transition: {
        duration: 1.5,
        delay: custom * 0.3,
        repeat: Infinity,
        repeatDelay: 2
      }
    })
  };

  useEffect(() => {
    if (autoPlay && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, onComplete]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />

      {/* Main logo container */}
      <motion.div
        className={`relative ${sizeClasses[size]} flex items-center justify-center`}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Background gradient circle */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.3 
          }}
        />

        {/* Logo pieces - 4 quadrants */}
        <motion.div
          className="absolute top-1/4 left-1/4 text-white"
          custom={0}
          variants={pieceVariants}
        >
          <Wallet2 size={iconSizes[size] / 3} strokeWidth={2.5} />
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-1/4 text-white"
          custom={1}
          variants={pieceVariants}
        >
          <Shield size={iconSizes[size] / 3} strokeWidth={2.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-1/4 text-white"
          custom={2}
          variants={pieceVariants}
        >
          <Sparkles size={iconSizes[size] / 3} strokeWidth={2.5} />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 right-1/4 text-white"
          custom={3}
          variants={pieceVariants}
        >
          <Zap size={iconSizes[size] / 3} strokeWidth={2.5} />
        </motion.div>

        {/* Center wallet icon */}
        <motion.div
          className="absolute text-white z-10"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            delay: 0.8,
            type: 'spring',
            stiffness: 300,
            damping: 20
          }}
        >
          <Wallet2 size={iconSizes[size] / 2} strokeWidth={2.5} />
        </motion.div>

        {/* Sparkle particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300"
            custom={i + 1}
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
          >
            <Sparkles size={12} />
          </motion.div>
        ))}
      </motion.div>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-purple-400"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.5, 2],
          opacity: [0.6, 0.3, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />
    </div>
  );
};

export default LogoReveal;
