'use client';

import { MiniKit } from '@worldcoin/minikit-js';
import { ReactNode, useEffect, useState } from 'react';

export function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const installMiniKit = async () => {
      try {
        // Install MiniKit with app configuration
        const appId = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID;
        
        if (!appId) {
          console.warn('NEXT_PUBLIC_WORLD_ID_APP_ID not configured');
          return;
        }

        await MiniKit.install(appId);
        setIsInstalled(true);
        console.log('MiniKit installed successfully');
      } catch (error) {
        console.error('Failed to install MiniKit:', error);
      }
    };

    installMiniKit();
  }, []);

  return <>{children}</>;
}
