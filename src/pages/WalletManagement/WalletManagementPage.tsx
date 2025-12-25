import React, { useState, useEffect } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { useToast } from '@/hooks/useToast';
import { Send, Download, Copy, RefreshCw, ExternalLink, Clock, CheckCircle, XCircle, Wallet, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const WalletManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    address,
    balance,
    transactions,
    network,
    refreshBalance,
    refreshTransactions,
    sendTransaction,
    isLoading,
  } = useWalletStore();

  useEffect(() => {
    refreshBalance();
    refreshTransactions();

    const interval = setInterval(() => {
      refreshBalance();
      refreshTransactions();
    }, 30000);

    return () => clearInterval(interval);
  }, [network]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      showToast('success', 'Address copied to clipboard!', 2000);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    showToast('info', 'Refreshing wallet data...', 1500);
    await Promise.all([refreshBalance(), refreshTransactions()]);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('success', 'Wallet data updated!', 2000);
    }, 1000);
  };

  // Send Modal Component
  const SendModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState<'input' | 'confirm'>('input');

    const handleSend = async () => {
      if (!password) {
        showToast('error', 'Please enter your password', 2000);
        return;
      }

      showToast('info', 'Sending transaction...', 2000);
      const result = await sendTransaction(recipient, amount, password);
      if (result.success) {
        showToast('success', `Transaction sent! Hash: ${result.txHash?.slice(0, 10)}...`, 3000);
        onClose();
      } else {
        showToast('error', `Failed: ${result.error}`, 3000);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-2xl font-bold mb-6 text-white">Send ETH</h3>

          {step === 'input' ? (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount (ETH)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Available: {parseFloat(balance).toFixed(4)} ETH</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white py-3 px-4 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!recipient || !amount) {
                      showToast('error', 'Please fill all fields', 2000);
                      return;
                    }
                    if (parseFloat(amount) > parseFloat(balance)) {
                      showToast('error', 'Insufficient balance', 2000);
                      return;
                    }
                    setStep('confirm');
                    showToast('info', 'Review transaction details', 2000);
                  }}
                  disabled={!recipient || !amount || parseFloat(amount) > parseFloat(balance)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">To:</p>
                  <p className="text-white font-mono text-sm break-all">{recipient}</p>
                </div>

                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Amount:</p>
                  <p className="text-white font-bold text-xl">{amount} ETH</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Enter Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your wallet password"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('input')}
                  className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white py-3 px-4 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLoading ? 'Sending...' : 'Confirm & Send'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Receive Modal Component
  const ReceiveModal: React.FC<{ onClose: () => void; addr: string }> = ({ onClose, addr }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(addr);
      setCopied(true);
      showToast('success', 'Address copied to clipboard!', 2000);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-2xl font-bold mb-6 text-white">Receive ETH</h3>

          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <QRCodeSVG value={addr} size={200} />
            </div>

            <p className="text-sm text-gray-400 mb-2">Your Wallet Address</p>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-4">
              <p className="text-white font-mono text-sm break-all">{addr}</p>
            </div>

            <button
              onClick={handleCopy}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white py-3 px-4 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Wallet Overview Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm mb-2">Total Balance</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {parseFloat(balance).toFixed(4)} ETH
            </h1>
            <p className="text-blue-100 text-sm">
              ≈ ${(parseFloat(balance) * 2000).toFixed(2)} USD
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-colors" onClick={handleCopyAddress}>
              <p className="text-blue-100 text-xs mb-1">Wallet Address</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-mono text-sm">{address ? formatAddress(address) : 'No address'}</p>
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-300" />
                ) : (
                  <Copy className="w-4 h-4 text-blue-200" />
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-blue-100 text-xs mb-1">Network</p>
              <p className="text-white font-medium text-sm">{network}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <button
            onClick={() => setShowSendModal(true)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-5 h-5" />
            <span className="font-medium">Send</span>
          </button>

          <button
            onClick={() => setShowReceiveModal(true)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-5 h-5" />
            <span className="font-medium">Receive</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="font-medium">Refresh</span>
          </button>

          <button
            onClick={() => showToast('info', 'Swap feature coming soon!', 2000)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Swap</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const isSend = tx.type === 'send' || (!tx.type && address && tx.from.toLowerCase() === address.toLowerCase());

              return (
                <div key={tx.hash} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSend ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                        {isSend ? <TrendingDown className="w-5 h-5 text-red-500" /> : <TrendingUp className="w-5 h-5 text-green-500" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{isSend ? 'Sent' : 'Received'}</span>
                          {tx.status === 'pending' && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded">Pending</span>
                          )}
                          {tx.status === 'confirmed' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {tx.status === 'failed' && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-bold ${isSend ? 'text-red-500' : 'text-green-500'}`}>
                        {isSend ? '-' : '+'}{tx.value} ETH
                      </div>
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 justify-end mt-1"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showSendModal && <SendModal onClose={() => setShowSendModal(false)} />}
      {showReceiveModal && address && <ReceiveModal onClose={() => setShowReceiveModal(false)} addr={address} />}
    </div>
  );
};

export default WalletManagementPage;
