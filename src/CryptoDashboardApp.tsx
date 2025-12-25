import React, { useState } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { MarketsPage } from './pages/Markets/MarketsPage';
import { PredictionsPage } from './pages/Predictions/PredictionsPage';
import { WalletPage } from './pages/Wallet/WalletPage';

function CryptoDashboardApp() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'markets':
        return <MarketsPage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'wallet':
        return <WalletPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default CryptoDashboardApp;
