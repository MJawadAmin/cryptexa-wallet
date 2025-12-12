import React, { useEffect, useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './pages/Landing/LandingPage';
import { CreateWalletPage } from './pages/CreateWallet/CreateWalletPage';
import { ImportWalletPage } from './pages/ImportWallet/ImportWalletPage';
import { UnlockPage } from './pages/Unlock/UnlockPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';

type Page = 'landing' | 'create' | 'import' | 'unlock' | 'dashboard';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { isInitialized, isLocked, loading } = useWallet();

  useEffect(() => {
    if (loading) return;

    if (!isInitialized) {
      setCurrentPage('landing');
    } else if (isLocked) {
      setCurrentPage('unlock');
    } else {
      setCurrentPage('dashboard');
    }
  }, [isInitialized, isLocked, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  switch (currentPage) {
    case 'landing':
      return (
        <LandingPage
          onCreateWallet={() => setCurrentPage('create')}
          onImportWallet={() => setCurrentPage('import')}
        />
      );
    
    case 'create':
      return (
        <CreateWalletPage
          onBack={() => setCurrentPage('landing')}
          onComplete={() => setCurrentPage('dashboard')}
        />
      );
    
    case 'import':
      return (
        <ImportWalletPage
          onBack={() => setCurrentPage('landing')}
          onComplete={() => setCurrentPage('dashboard')}
        />
      );
    
    case 'unlock':
      return (
        <UnlockPage
          onUnlock={() => setCurrentPage('dashboard')}
        />
      );
    
    case 'dashboard':
      return <DashboardPage />;
    
    default:
      return null;
  }
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </ThemeProvider>
  );
};
