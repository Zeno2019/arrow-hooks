'use client';
import { WakuProvider } from 'fumadocs-core/framework/waku';
import { RootProvider } from 'fumadocs-ui/provider/base';
import type { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <WakuProvider>
      <RootProvider
        theme={{
          enabled: false,
        }}
      >
        {children}
      </RootProvider>
    </WakuProvider>
  );
}
