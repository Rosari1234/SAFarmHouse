'use client';

import { useEffect } from 'react';

export default function ExternalStyles() {
  useEffect(() => {
    // Load Font Awesome
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    // Load Google Fonts
    const googleFontsLink = document.createElement('link');
    googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    googleFontsLink.rel = 'stylesheet';
    document.head.appendChild(googleFontsLink);

    // Add font family style
    const style = document.createElement('style');
    style.textContent = 'body { font-family: \'Inter\', sans-serif; }';
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      if (document.head.contains(fontAwesomeLink)) {
        document.head.removeChild(fontAwesomeLink);
      }
      if (document.head.contains(googleFontsLink)) {
        document.head.removeChild(googleFontsLink);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return null;
}