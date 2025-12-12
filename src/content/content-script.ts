/**
 * Content Script for Cryptexa Wallet
 * Injects the provider script into web pages for dApp interaction
 * FR-5.1: Authentication Protocol support
 * FR-5.2: Verifiable Presentation requests
 */

// Inject the provider script into the page context
const script = document.createElement('script');
script.src = chrome.runtime.getURL('provider.js');
script.onload = function () {
  // Clean up the script tag after loading
  (this as HTMLScriptElement).remove();
};
(document.head || document.documentElement).appendChild(script);

// Listen for messages from the injected provider script
window.addEventListener('message', async (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;

  const message = event.data;

  // Ensure it's a Cryptexa message
  if (!message || message.target !== 'cryptexa-content') return;

  try {
    // Forward the message to the background script
    const response = await chrome.runtime.sendMessage({
      type: message.type,
      payload: message.payload,
    });

    // Send response back to the page
    window.postMessage(
      {
        target: 'cryptexa-page',
        id: message.id,
        response,
      },
      '*'
    );
  } catch (error) {
    // Send error response back to the page
    window.postMessage(
      {
        target: 'cryptexa-page',
        id: message.id,
        response: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      '*'
    );
  }
});

console.log('Cryptexa Wallet provider injected');
