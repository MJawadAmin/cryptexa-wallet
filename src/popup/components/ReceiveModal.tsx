import React from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { QRCodeSVG } from 'qrcode.react';

interface ReceiveModalProps {
  onClose: () => void;
}

const ReceiveModal: React.FC<ReceiveModalProps> = ({ onClose }) => {
  const { address } = useWalletStore();

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      alert('Address copied to clipboard!');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>📥 Receive ETH</h2>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Scan QR code or share your address
          </p>

          <div className="qr-container">
            {address && <QRCodeSVG value={address} size={200} />}
          </div>

          <div
            className="address"
            style={{ marginTop: '16px', cursor: 'pointer' }}
            onClick={handleCopyAddress}
          >
            {address}
          </div>

          <button
            className="button button-secondary"
            onClick={handleCopyAddress}
            style={{ marginTop: '16px' }}
          >
            📋 Copy Address
          </button>

          <div style={{ background: '#dbeafe', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#1e40af' }}>
              ℹ️ Only send ETH and ERC-20 tokens to this address
            </p>
          </div>

          <button
            className="button"
            onClick={onClose}
            style={{ marginTop: '16px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveModal;
