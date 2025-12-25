import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, Brain, Wallet, Menu, X, Search } from 'lucide-react';
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'markets', label: 'Markets', icon: <TrendingUp size={20} /> },
  { id: 'predictions', label: 'Predictions', icon: <Brain size={20} /> },
  { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} /> },
];

interface DashboardLayoutInternalProps extends DashboardLayoutProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutInternalProps> = ({
  children,
  currentPage,
  onPageChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    address,
    balance,
    isConnected,
    connect,
    disconnect,
    formatAddress,
    isConnecting,
  } = useWeb3Wallet();

  const handleWalletAction = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Navbar */}
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-white hover:text-cyan-500 transition-colors"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-white font-bold text-xl">CryptoDash</h1>
                  <p className="text-gray-400 text-xs">Professional Trading</p>
                </div>
              </div>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            {/* Wallet Connect Button */}
            <button
              onClick={handleWalletAction}
              disabled={isConnecting}
              className={`
                px-6 py-2.5 rounded-lg font-medium transition-all
                flex items-center gap-2
                ${
                  isConnected
                    ? 'bg-green-500/20 border border-green-500 text-green-500 hover:bg-green-500/30'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Wallet size={18} />
              <span className="hidden sm:inline">
                {isConnecting
                  ? 'Connecting...'
                  : isConnected
                  ? formatAddress(address)
                  : 'Connect Wallet'}
              </span>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[73px] lg:top-0 left-0 h-[calc(100vh-73px)] lg:h-screen
            w-64 bg-gray-900/80 backdrop-blur-sm border-r border-gray-800
            transition-transform duration-300 z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all font-medium
                  ${
                    currentPage === item.id
                      ? 'bg-cyan-500 text-white shadow-glow'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Wallet Info in Sidebar */}
          {isConnected && (
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Wallet Balance</p>
                <p className="text-white font-bold text-lg">{parseFloat(balance).toFixed(4)} ETH</p>
                <p className="text-gray-500 text-xs mt-1">{formatAddress(address)}</p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
