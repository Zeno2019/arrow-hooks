import React, { useState } from 'react';
import useCookie from '../index';

const CookieExample = () => {
  return (
    <div>
      <h2>Cookie Examples</h2>

      {/* 主题切换示例 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>1. 主题切换</h3>
        <ThemeSwitcherExample />
      </section>

      {/* Cookie 过期时间示例 */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>2. 设置过期时间</h3>
        <ExpirationCookieExample />
      </section>

      {/* 高级选项示例 */}
      <section>
        <h3>3. 高级选项</h3>
        <AdvancedCookieExample />
      </section>
    </div>
  );
};

// 主题切换组件
const ThemeSwitcherExample = () => {
  const [theme, setTheme, removeTheme] = useCookie('theme', 'light');
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const resetTheme = () => {
    removeTheme();
  };

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
  );
};

// 登录状态示例组件
const ExpirationCookieExample = () => {
  const [loginState, setLoginState, removeLoginState] = useCookie('login-status');
  const [rememberMe, setRememberMe] = useState(false);
  const isLoggedIn = loginState === 'logged-in';

  const handleLogin = () => {
    const expirationOptions = {
      // 根据"记住我"选项设置不同的过期时间
      expires: new Date(Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)), // 7天 或 24小时
      path: '/',
    };

    setLoginState('logged-in', expirationOptions);
  };

  const handleLogout = () => {
    removeLoginState();
  };

  return (
    <div>
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h4 style={{ margin: '0 0 1rem 0' }}>
          登录状态: <strong>{isLoggedIn ? '已登录' : '未登录'}</strong>
        </h4>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            记住登录状态（7天）
          </label>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
            {rememberMe ? '登录状态将保持7天' : '登录状态将在24小时后过期'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleLogin}
            disabled={isLoggedIn}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isLoggedIn ? '#ccc' : '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoggedIn ? 'not-allowed' : 'pointer',
            }}
          >
            登录
          </button>
          <button
            onClick={handleLogout}
            disabled={!isLoggedIn}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: !isLoggedIn ? '#ccc' : '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !isLoggedIn ? 'not-allowed' : 'pointer',
            }}
          >
            退出登录
          </button>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p>提示：</p>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
          <li>Cookie 会在浏览器关闭后保持</li>
          <li>可以打开新标签页验证登录状态</li>
          <li>根据"记住我"选项设置不同的过期时间</li>
        </ul>
      </div>
    </div>
  );
};

// 高级选项示例组件
const AdvancedCookieExample = () => {
  const [cookie, setCookie, removeCookie] = useCookie('advanced-example');

  const handleSetSecureCookie = () => {
    setCookie('这是一个安全的 Cookie', {
      secure: true,
      SameSite: 'Strict',
      path: '/',
    });
  };


  return (
    <div>
      <p>当前 Cookie 值: <strong>{cookie || '未设置'}</strong></p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={handleSetSecureCookie}
          style={{ padding: '0.5rem 1rem' }}
        >
          设置安全 Cookie
        </button>
        <button
          onClick={() => removeCookie()}
          style={{ padding: '0.5rem 1rem' }}
        >
          删除 Cookie
        </button>
      </div>
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
        注意：某些选项可能在本地开发环境中不会生效
      </p>
    </div>
  );
};

export default CookieExample;
