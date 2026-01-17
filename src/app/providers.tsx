'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { MiniKitProvider } from '@/components/auth/MiniKitProvider';
import { UserProvider } from '@/components/auth/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <MiniKitProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </MiniKitProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
