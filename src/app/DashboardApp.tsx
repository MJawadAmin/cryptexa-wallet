import React, { useState, useEffect } from 'react';
import { WalletProvider } from './context/WalletContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';

type Route = 'dashboard' | 'analytics' | 'did' | 'settings';

const DashboardRouter: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>('dashboard');

  useEffect(() => {
    // Handle hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash.startsWith('/analytics')) {
        setCurrentRoute('analytics');
      } else if (hash.startsWith('/did')) {
        setCurrentRoute('did');
      } else if (hash.startsWith('/settings')) {
        setCurrentRoute('settings');
      } else {
        setCurrentRoute('dashboard');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentRoute) {
      case 'analytics':
        return <AnalyticsPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'did':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Cryptexa ID
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                DID Management coming soon...
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Settings page coming soon...
              </p>
            </div>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  };

  return <>{renderPage()}</>;
};

export const DashboardApp: React.FC = () => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <DashboardRouter />
      </WalletProvider>
    </ThemeProvider>
  );
};
