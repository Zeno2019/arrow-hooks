import { createPages } from 'waku'

export default createPages(async ({ createPage, createLayout }) => {
  // 创建根布局
  createLayout({
    render: 'static',
    path: '/',
    component: RootLayout,
  })

  // 创建首页
  createPage({
    render: 'static',
    path: '/',
    component: HomePage,
  })
})

// 根布局组件
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Arrow Hooks - React Hooks Library</title>
      </head>
      <body style={{ fontFamily: 'system-ui', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}

// 首页组件
function HomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Arrow Hooks
      </h1>
      <p style={{ fontSize: '1.125rem', color: '#666', marginBottom: '2rem' }}>
        A collection of practical React hooks with TypeScript support.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Welcome to Arrow Hooks Documentation
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          ✅ Waku is running correctly with React 19!
        </p>
        <p style={{ color: '#666' }}>
          This is the basic setup. Next we'll add the useCookie demo and other features.
        </p>
      </div>
    </div>
  )
}