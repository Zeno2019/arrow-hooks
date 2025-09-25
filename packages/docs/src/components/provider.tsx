'use client';
import { RootProvider } from 'fumadocs-ui/provider/base';
import type { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      theme={{
        enabled: false,
      }}
    >
      {children}
    </RootProvider>
  );
}
