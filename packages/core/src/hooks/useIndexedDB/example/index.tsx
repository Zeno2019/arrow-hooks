import { useState } from 'react';
import useIndexedDB from '../index';

type UserProfile = {
  name: string;
  updatedAt: string;
};

const IndexedDBExample = () => {
  return (
    <div>
      <h2>useIndexedDB Example</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3>1. 保存主题（跨 Tab 同步）</h3>
        <ThemeExample />
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>2. 保存对象（structured clone）</h3>
        <ProfileExample />
      </section>
    </div>
  );
};

const ThemeExample = () => {
  const [theme, setTheme, removeTheme, status] = useIndexedDB<'light' | 'dark'>('demo:theme');
  const isDark = theme === 'dark';

  return (
    <div>
      <div
        style={{
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: isDark ? '#333' : '#fff',
          color: isDark ? '#fff' : '#333',
        }}
      >
        <p style={{ margin: '0 0 0.75rem 0' }}>
          当前主题：<strong>{theme ?? '(未设置)'}</strong>
        </p>
        <p style={{ margin: '0 0 0.75rem 0', color: isDark ? '#ddd' : '#666' }}>
          状态：{status.isSupported ? (status.loading ? '读取中…' : '就绪') : '不支持 IndexedDB'}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            切换主题
          </button>
          <button
            onClick={() => removeTheme()}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            清除
          </button>
        </div>
      </div>

      <p style={{ marginTop: '0.75rem', color: '#666' }}>
        提示：打开另一个 Tab 运行同一示例并切换主题，可观察到自动刷新（BroadcastChannel）。
      </p>
    </div>
  );
};

const ProfileExample = () => {
  const [profile, setProfile, removeProfile, status] = useIndexedDB<UserProfile>('demo:profile');
  const [name, setName] = useState(profile?.name ?? '');

  const save = async () => {
    const nextProfile: UserProfile = {
      name: name.trim() || '匿名',
      updatedAt: new Date().toISOString(),
    };
    await setProfile(nextProfile);
  };

  const clear = async () => {
    await removeProfile();
    setName('');
  };

  return (
    <div>
      <div
        style={{
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>用户名</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='输入用户名'
              style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </label>

          <button
            onClick={save}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            保存
          </button>
          <button
            onClick={clear}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            删除
          </button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
            状态：{status.isSupported ? (status.loading ? '读取中…' : '就绪') : '不支持 IndexedDB'}
          </p>
          <pre
            style={{
              margin: 0,
              padding: '0.75rem',
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: '6px',
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(profile ?? null, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default IndexedDBExample;
