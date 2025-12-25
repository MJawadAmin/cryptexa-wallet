import React from 'react';
import ReactDOM from 'react-dom/client';
import CryptoDashboardApp from './CryptoDashboardApp';
import './popup/styles.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <CryptoDashboardApp />
    </React.StrictMode>
  );
}
