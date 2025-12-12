import React, { useEffect, useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import WelcomeScreenNew from './components/WelcomeScreenNew';
import UnlockScreenNew from './components/UnlockScreenNew';
import MainWallet from './components/MainWallet';
import { PreviewBanner } from './components/PreviewBanner';

const App: React.FC = () => {
  const { isLocked } = useWalletStore();
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    const inPreview = !(typeof chrome !== 'undefined' && chrome.storage);
    setIsPreviewMode(inPreview);

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get('cryptexa_store', (result) => {
        setHasWallet(!!result.cryptexa_store);
      });
    } else {
      const stored = localStorage.getItem('cryptexa_store');
      setHasWallet(!!stored);
    }
  }, []);

  if (hasWallet === null) {
    return (
      <>
        <PreviewBanner show={isPreviewMode} />
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent" />
        </div>
      </>
    );
  }

  return (
    <>
      <PreviewBanner show={isPreviewMode} />
      {!hasWallet ? (
        <WelcomeScreenNew onWalletCreated={() => setHasWallet(true)} />
      ) : isLocked ? (
        <UnlockScreenNew />
      ) : (
        <MainWallet />
      )}
    </>
  );
};

export default App;
