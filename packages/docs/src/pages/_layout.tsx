import type { ReactNode } from 'react';
import { Provider } from '@/components/provider';
import '../styles/globals.css';

// 根布局组件
export default function RootLayout({ children }: { children: ReactNode }) {
  return <Provider>{children}</Provider>;
}
