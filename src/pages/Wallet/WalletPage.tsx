import React from 'react';
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet';
import { Wallet, AlertCircle, CheckCircle, ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const WalletPage: React.FC = () => {
  const {
    address,
    balance,
    network,
    isConnected,
    chainId,
    error,
    isConnecting,
    isLoadingBalance,
    connect,
    disconnect,
    refreshBalance,
    formatAddress,
    isMetaMaskInstalled,
  } = useWeb3Wallet();

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  };

  const openInExplorer = () => {
    if (!address || !chainId) return;

    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      56: 'https://bscscan.com',
      137: 'https://polygonscan.com',
      // Add more networks as needed
    };

    const explorerUrl = explorers[chainId] || 'https://etherscan.io';
    window.open(`${explorerUrl}/address/${address}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-gray-400">Connect and manage your Web3 wallet</p>
      </div>

      {/* Not Connected State */}
      {!isConnected && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
          <div className="inline-flex p-6 bg-cyan-500/10 rounded-full mb-6">
            <Wallet className="text-cyan-500" size={64} />
          </div>

          <h2 className="text-white text-2xl font-bold mb-3">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Connect your MetaMask wallet to access trading features, view your balance, and interact
            with blockchain networks.
          </p>

          {!isMetaMaskInstalled && (
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-left">
                  <p className="text-orange-500 font-semibold text-sm mb-1">
                    MetaMask Not Detected
                  </p>
                  <p className="text-gray-300 text-sm">
                    Please install MetaMask extension to continue.
                  </p>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-500 hover:text-cyan-400 text-sm inline-flex items-center gap-1 mt-2"
                  >
                    Download MetaMask <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={connect}
            disabled={isConnecting || !isMetaMaskInstalled}
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 text-white rounded-xl font-medium transition-all shadow-lg flex items-center gap-3 mx-auto"
          >
            {isConnecting ? (
              <>
                <LoadingSpinner size="sm" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet size={24} />
                Connect MetaMask
              </>
            )}
          </button>
        </div>
      )}

      {/* Connected State */}
      {isConnected && address && (
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" size={24} />
              <div>
                <p className="text-green-500 font-semibold">Wallet Connected</p>
                <p className="text-gray-300 text-sm">Your wallet is connected and ready to use</p>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-8">
            <p className="text-gray-400 text-sm mb-2">Total Balance</p>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-white text-5xl font-bold">
                {parseFloat(balance).toFixed(4)}
              </span>
              <span className="text-gray-300 text-2xl">ETH</span>
            </div>

            <button
              onClick={refreshBalance}
              disabled={isLoadingBalance}
              className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-500 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} className={isLoadingBalance ? 'animate-spin' : ''} />
              Refresh Balance
            </button>
          </div>

          {/* Wallet Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">Wallet Details</h3>

            <div>
              <p className="text-gray-400 text-sm mb-2">Wallet Address</p>
              <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-3">
                <code className="text-white flex-1 text-sm font-mono">{address}</code>
                <button
                  onClick={handleCopyAddress}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy address"
                >
                  <Copy className="text-gray-400 hover:text-white" size={18} />
                </button>
                <button
                  onClick={openInExplorer}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="View in explorer"
                >
                  <ExternalLink className="text-gray-400 hover:text-white" size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-2">Network</p>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-white font-medium">{network}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Chain ID</p>
                <div className="bg-gray-900/50 rounded-lg p-3">
                  <p className="text-white font-medium">{chainId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={disconnect}
              className="flex-1 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-500 rounded-xl font-medium transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>

          {/* Info Note */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <p className="text-gray-300 text-sm">
              <strong className="text-cyan-500">Note:</strong> This is a demo wallet integration. In
              a production environment, you would implement additional features like transaction
              signing, token swaps, and transaction history.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
