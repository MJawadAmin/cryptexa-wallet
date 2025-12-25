import React from 'react';
import ReactDOM from 'react-dom/client';
import CryptoWeb3App from '../CryptoWeb3App';
import './styles.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <CryptoWeb3App />
    </React.StrictMode>
  );
}
