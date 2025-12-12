import React, { useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';

interface SendModalProps {
  onClose: () => void;
}

const SendModal: React.FC<SendModalProps> = ({ onClose }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const { sendTransaction, isLoading, balance } = useWalletStore();

  const handleSend = async () => {
    if (!recipient || !amount || !password) {
      alert('Please fill all fields');
      return;
    }

    const result = await sendTransaction(recipient, amount, password);

    if (result.success) {
      alert(`Transaction sent! Hash: ${result.txHash}`);
      onClose();
    } else {
      alert(`Transaction failed: ${result.error}`);
    }
  };

  const handleNext = () => {
    if (!recipient || !amount) {
      alert('Please enter recipient and amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      alert('Insufficient balance');
      return;
    }

    setShowConfirm(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>📤 Send ETH</h2>

        {!showConfirm ? (
          <>
            <label className="label">Recipient Address</label>
            <input
              type="text"
              className="input"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
            />

            <label className="label">Amount (ETH)</label>
            <input
              type="number"
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.001"
            />

            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
              Available: {parseFloat(balance).toFixed(4)} ETH
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              <button
                className="button button-secondary"
                onClick={onClose}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="button"
                onClick={handleNext}
                style={{ flex: 1 }}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="card" style={{ marginTop: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>To</div>
                <div style={{ fontSize: '14px', wordBreak: 'break-all' }}>
                  {recipient}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Amount</div>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>
                  {amount} ETH
                </div>
              </div>
            </div>

            <label className="label">Confirm with Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />

            <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
              <p style={{ fontSize: '12px', color: '#92400e' }}>
                ⚠️ This transaction cannot be reversed. Please verify the recipient address.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                className="button button-secondary"
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                className="button"
                onClick={handleSend}
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Confirm & Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SendModal;
