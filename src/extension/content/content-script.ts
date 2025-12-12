/**
 * Content script - Injects the provider into web pages
 */

// Inject provider script into page context
function injectProvider() {
  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('provider.js');
    script.onload = function() {
      script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  } catch (error) {
    console.error('Failed to inject Cryptexa provider:', error);
  }
}

// Inject as early as possible
if (document.doctype) {
  injectProvider();
} else {
  const observer = new MutationObserver(() => {
    if (document.doctype) {
      injectProvider();
      observer.disconnect();
    }
  });
  observer.observe(document, { childList: true });
}

/**
 * Relay messages between page and background
 */
window.addEventListener('message', async (event) => {
  // Only accept messages from same window
  if (event.source !== window) return;

  // Only accept messages from our provider
  if (event.data.type !== 'CRYPTEXA_PROVIDER_REQUEST') return;

  const { id, method, params } = event.data;

  try {
    // Forward to background script
    const response = await chrome.runtime.sendMessage({
      type: 'RPC_REQUEST',
      data: { method, params }
    });

    // Send response back to page
    window.postMessage({
      type: 'CRYPTEXA_PROVIDER_RESPONSE',
      id,
      data: response
    }, '*');
  } catch (error: any) {
    window.postMessage({
      type: 'CRYPTEXA_PROVIDER_RESPONSE',
      id,
      error: error.message
    }, '*');
  }
});

/**
 * Listen for wallet events from background
 */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'WALLET_LOCKED') {
    window.postMessage({
      type: 'CRYPTEXA_WALLET_EVENT',
      event: 'accountsChanged',
      data: []
    }, '*');
  }
});

console.log('Cryptexa Wallet content script loaded');
