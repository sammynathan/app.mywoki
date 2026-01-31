"use client"

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Tawk_API?: {
      showWidget: () => void;
      hideWidget: () => void;
      maximize: () => void;
      minimize: () => void;
      toggle: () => void;
      onLoad?: (callback: () => void) => void; // Make optional
      onStatusChange?: (callback: (status: string) => void) => void; // Make optional
      onBeforeLoad?: (callback: () => void) => void;
      autoStart?: boolean;
      [key: string]: any;
    };
    Tawk_LoadStart?: Date;
  }
}

interface ChatWidgetProps {
  autoShow?: boolean;
  onStatusChange?: (status: string) => void;
}

// Global flag to prevent duplicate script injection
let tawkScriptLoaded = false;

export default function ChatWidget({ 
  onStatusChange
}: ChatWidgetProps = {}) {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current || tawkScriptLoaded) {
      return;
    }
    
    isInitializedRef.current = true;
    tawkScriptLoaded = true;
    console.log('Setting up Tawk.to chat widget...');

    // Check if script already exists
    if (document.getElementById('tawk-to-chat-widget')) {
      console.log('Tawk.to script already injected.');
      return;
    }

    // Create and inject the script element
    const script = document.createElement('script');
    
    script.async = true;
    script.src = 'https://embed.tawk.to/696cc00ee81aec197fb37f66/1jf8csfbt';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    script.id = 'tawk-to-chat-widget';
    
    // Handle script load
    script.onload = () => {
      console.log('Tawk.to widget script loaded.');
      
      // Wait for tawk.to to initialize with exponential backoff
      const waitForTawkApi = (attempt = 1, maxAttempts = 10) => {
        const tawkApi = window.Tawk_API;
        
        if (tawkApi) {
          console.log('Tawk.to API is available.');
          
          // Set up status change listener if callback provided
          if (onStatusChange && tawkApi.onStatusChange) {
            tawkApi.onStatusChange((status: string) => {
              console.log('Tawk.to status:', status);
              onStatusChange(status);
            });
          }
          
          // Use onLoad if available, otherwise set a timeout
          
        } else if (attempt < maxAttempts) {
          // Try again with increasing delay
          setTimeout(() => waitForTawkApi(attempt + 1, maxAttempts), 200 * attempt);
        } else {
          console.error('Tawk.to API failed to load after multiple attempts');
        }
      };

      // Start waiting for API
      waitForTawkApi();
    };

    script.onerror = (error) => {
      console.error('Failed to load Tawk.to script:', error);
      tawkScriptLoaded = false; // Reset flag on error
    };

    // Insert the script at the end of body
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [onStatusChange]);

  // Helper function to handle widget visibility
  

  // This component doesn't render anything visible
  return null;
}

// Better control functions with safe checks
export const tawkTo = {
  show: () => {
    const tawkApi = window.Tawk_API;
    if (tawkApi) {
      try {
        tawkApi.showWidget();
        return true;
      } catch (error) {
        console.error('Error showing widget:', error);
      }
    }
    
    // If API not ready, open direct chat link
    window.open('https://tawk.to/chat/696cc00ee81aec197fb37f66/1jf8csfbt', '_blank');
    return false;
  },
  
  openChat: () => {
    const tawkApi = window.Tawk_API;
    if (tawkApi) {
      try {
        // First show the widget if hidden
        tawkApi.showWidget();
        
        // Then maximize to start conversation
        setTimeout(() => {
          try {
            tawkApi.maximize();
          } catch (error) {
            console.error('Error maximizing chat:', error);
          }
        }, 300);
        
        return true;
      } catch (error) {
        console.error('Error opening chat:', error);
      }
    }
    
    // Fallback
    window.open('https://tawk.to/chat/696cc00ee81aec197fb37f66/1jf8csfbt', '_blank');
    return false;
  },
  
  hide: () => {
    const tawkApi = window.Tawk_API;
    if (tawkApi) {
      try {
        tawkApi.hideWidget();
        return true;
      } catch (error) {
        console.error('Error hiding widget:', error);
      }
    }
    return false;
  },
  
  isReady: () => {
    const tawkApi = window.Tawk_API;
    return !!tawkApi;
  }
};