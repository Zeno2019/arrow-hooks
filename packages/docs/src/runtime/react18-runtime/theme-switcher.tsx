import React from 'react'
import { useCookie } from 'arrow-hooks'

interface ThemeSwitcherProps {
  theme?: string
}

// 直接使用 core 包的 useCookie hook
export function ThemeSwitcherDemo({ theme: externalTheme }: ThemeSwitcherProps = {}) {
  const [theme, setTheme, removeTheme] = useCookie('theme', externalTheme || 'light')
  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const resetTheme = () => {
    removeTheme()
  }

  return (
    <div>
      <div
        style={{
          padding: '2rem',
          backgroundColor: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
          border: `1px solid ${isDark ? '#666' : '#ddd'}`,
          borderRadius: '8px',
          transition: 'all 0.3s ease',
        }}
      >
        <h4 style={{ margin: '0 0 1rem 0' }}>
          当前主题: <strong>{theme}</strong>
        </h4>
        <p style={{ margin: '0 0 1rem 0' }}>
          这个示例展示了如何使用 Cookie 来保存用户的主题偏好。刷新页面后，主题设置会被保留。
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isDark ? '#666' : '#f0f0f0',
              color: isDark ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            切换到{isDark ? '浅色' : '深色'}主题
          </button>
          <button
            onClick={resetTheme}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: isDark ? '#fff' : '#333',
              border: `1px solid ${isDark ? '#fff' : '#333'}`,
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            重置主题
          </button>
        </div>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        提示：Cookie 值已保存，刷新页面后主题设置仍然保持不变
      </div>
    </div>
  )
}