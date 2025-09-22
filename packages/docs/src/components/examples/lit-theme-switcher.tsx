import { createHookComponent } from '@arrow-hooks/react18-runtime';
import { css } from 'lit';
import { LitReactBridge } from '../lit-react-bridge';

export class LitThemeSwitcher extends LitReactBridge<{ defaultTheme?: string }> {
  static properties = {
    defaultTheme: { type: String },
  };

  defaultTheme = 'light';

  static styles = css`
    :host {
      display: block;
    }
    .react-mount {
      width: 100%;
    }
  `;

  protected async getReactComponent() {
    const { React } = await import('@arrow-hooks/react18-runtime');
    const { useCookie } = await import('arrow-hooks');

    return createHookComponent(
      (props: { defaultTheme?: string }) => {
        const [theme, setTheme] = useCookie('theme', props.defaultTheme || 'light');
        return { theme, setTheme };
      },
      ({ theme, setTheme }: { theme: string; setTheme: (value: string) => void }) =>
        React.createElement(
          'div',
          {
            style: {
              padding: '1rem',
              background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              // border: '2px solid #4ade80',
              borderRadius: '8px',
              fontFamily: 'system-ui, sans-serif',
            },
          },
          [
            React.createElement('h4', { key: 'title' }, '🌙 主题切换器 (React 18)'),
            React.createElement('p', { key: 'current' }, `当前主题: ${theme}`),
            React.createElement(
              'button',
              {
                key: 'button',
                onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
                style: { padding: '0.5rem 1rem', cursor: 'pointer' },
              },
              theme === 'dark' ? '☀️ 切换到浅色' : '🌙 切换到深色',
            ),
          ],
        ),
    );
  }

  protected getReactProps() {
    return { defaultTheme: this.defaultTheme };
  }
}

customElements.define('lit-theme-switcher', LitThemeSwitcher);

declare global {
  interface HTMLElementTagNameMap {
    'lit-theme-switcher': LitThemeSwitcher;
  }
}
