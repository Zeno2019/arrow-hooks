import { Provider } from '@/components/provider';
import type { ReactNode } from 'react';

// 根布局组件
export default function RootLayout({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}