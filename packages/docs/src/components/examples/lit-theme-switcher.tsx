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
    // 导入现有的JSX组件，在React 18环境中运行
    const { ThemeSwitcherExample } = await import('./theme-switcher-example');
    return ThemeSwitcherExample;
  }

  protected getReactProps() {
    return { defaultTheme: this.defaultTheme };
  }
}

customElements.define('lit-theme-switcher', LitThemeSwitcher);
