import { css, html, LitElement } from 'lit';
import type { Root } from 'react-dom/client';

export class LitThemeSwitcher extends LitElement {
  static properties = {
    defaultTheme: { type: String }
  };

  defaultTheme = 'light';
  private reactRoot?: Root;
  private mountPoint?: HTMLDivElement;

  static styles = css`
    :host {
      display: block;
    }
    .react-mount {
      width: 100%;
    }
  `;

  /** 动态加载 React18 runtime 并挂载组件 */
  private async mountReact() {
    const { React, render, createHookComponent } = await import('@arrow-hooks/react18-runtime');
    const { useCookie } = await import('arrow-hooks');

    const ThemeSwitcher = createHookComponent(
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
              border: '2px solid #4ade80',
              borderRadius: '8px',
              fontFamily: 'system-ui, sans-serif'
            }
          },
          [
            React.createElement('h4', { key: 'title' }, '🌙 主题切换器 (React 18)'),
            React.createElement('p', { key: 'current' }, `当前主题: ${theme}`),
            React.createElement(
              'button',
              {
                key: 'button',
                onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
                style: { padding: '0.5rem 1rem', cursor: 'pointer' }
              },
              theme === 'dark' ? '☀️ 切换到浅色' : '🌙 切换到深色'
            )
          ]
        )
    );

    if (this.mountPoint) {
      this.reactRoot = render(React.createElement(ThemeSwitcher, { defaultTheme: this.defaultTheme }), this.mountPoint);
    }
  }

  firstUpdated() {
    this.mountPoint = this.shadowRoot?.querySelector('.react-mount') as HTMLDivElement;
    if (this.mountPoint) this.mountReact();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.reactRoot?.unmount();
  }

  render() {
    return html`<div class="react-mount"></div>`;
  }
}

customElements.define('lit-theme-switcher', LitThemeSwitcher);

declare global {
  interface HTMLElementTagNameMap {
    'lit-theme-switcher': LitThemeSwitcher;
  }
}