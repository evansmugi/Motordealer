'use client';

import { useEffect } from 'react';

export function TailwindScript() {
  useEffect(() => {
    if (document.getElementById('tailwind-cdn-script')) return;

    const script = document.createElement('script');
    script.id = 'tailwind-cdn-script';
    script.src = 'https://cdn.tailwindcss.com';
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).tailwind) {
        (window as any).tailwind.config = {
          theme: {
            extend: {
              colors: {
                gold: {
                  50: '#fdfbf7',
                  100: '#f7f2e6',
                  400: '#e5c158',
                  500: '#c9a84c',
                  600: '#ab8b38',
                }
              }
            }
          }
        };
      }
    };
    document.head.appendChild(script);
  }, []);

  return null;
}
