import React, { useState } from 'react';
import { Wallet, TrendingUp, Brain, BarChart3, Settings, Menu, X } from 'lucide-react';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { MarketsPage } from './pages/Markets/MarketsPage';
import { PredictionsPage } from './pages/Predictions/PredictionsPage';
import { WalletManagementPage } from './pages/WalletManagement/WalletManagementPage';
import SettingsPage from './pages/Settings/SettingsPage';
import { ToastProvider } from './hooks/useToast';

type PageType = 'dashboard' | 'markets' | 'predictions' | 'wallet' | 'settings';

const CryptoWeb3App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('wallet');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'text-blue-500' },
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, color: 'text-green-500' },
    { id: 'markets', label: 'Markets', icon: BarChart3, color: 'text-purple-500' },
    { id: 'predictions', label: 'Predictions', icon: Brain, color: 'text-orange-500' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'markets':
        return <MarketsPage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'wallet':
        return <WalletManagementPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <WalletManagementPage />;
    }
  };

  return (
    <ToastProvider>
      <div className="relative flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
        {/* Overlay backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Overlay on mobile, static on desktop */}
        <aside
          className={`fixed lg:static top-0 left-0 h-full bg-[#111111] border-r border-[#2a2a2a] transition-transform duration-300 z-50 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } w-64 lg:w-64 overflow-y-auto`}
        >
          <div className="p-4 border-b border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Cryptexa</h1>
                  <p className="text-xs text-gray-400">Web3 Wallet</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as PageType);
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                      : 'hover:bg-[#1a1a1a]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-400'}`} />
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <header className="bg-[#111111] border-b border-[#2a2a2a] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                title={isSidebarOpen ? 'Close menu' : 'Open menu'}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-semibold capitalize">{currentPage}</h2>
                <p className="text-xs text-gray-400">
                  {currentPage === 'wallet' && 'Manage your digital assets'}
                  {currentPage === 'dashboard' && 'Track market performance'}
                  {currentPage === 'markets' && 'Live cryptocurrency prices'}
                  {currentPage === 'predictions' && 'AI-powered forecasts'}
                  {currentPage === 'settings' && 'Configure your preferences'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('settings')}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors group"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default CryptoWeb3App;
