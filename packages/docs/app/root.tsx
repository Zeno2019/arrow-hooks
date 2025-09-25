import { ReactRouterProvider } from 'fumadocs-core/framework/react-router';
import { RootProvider } from 'fumadocs-ui/provider/base';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { SearchProvider } from '../src/components/search-provider';

import './styles/globals.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <ReactRouterProvider>
          <RootProvider
            theme={{
              enabled: false,
            }}
            search={{
              enabled: false,
            }}
          >
            <SearchProvider>
              {children}
            </SearchProvider>
          </RootProvider>
        </ReactRouterProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let message = '页面出现错误！';
  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>出错了!</h1>
        <p className='text-gray-600'>{message}</p>
        <div className='mt-4'>
          <a
            href='/'
            className='inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
