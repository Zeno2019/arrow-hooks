import type { React as React18, Root } from '@arrow-hooks/react18-runtime';
import { html, LitElement } from 'lit';

export abstract class LitReactBridge<P extends {} = {}> extends LitElement {
  private reactRoot?: Root;
  private mountPoint?: HTMLDivElement;

  /** 子类必须实现：返回 React 组件 */
  protected abstract getReactComponent(): Promise<React18.ComponentType<P>>;

  /** 可以让子类传递 props 给 React 组件 */
  protected getReactProps(): P | undefined {
    return undefined;
  }

  private async mountReact() {
    const { React: _React, render } = await import('@arrow-hooks/react18-runtime');
    const Component = await this.getReactComponent();
    const props = this.getReactProps();

    if (this.mountPoint) {
      // 这里使用泛型 <P> 并且确保 P 已经被约束为 extends {}
      this.reactRoot = render(
        _React.createElement<P>(Component as React18.ComponentType<P>, props ?? ({} as P)),
        this.mountPoint,
      );
    }
  }

  firstUpdated() {
    this.mountPoint = this.shadowRoot?.querySelector('.react-mount') as HTMLDivElement;
    if (this.mountPoint) this.mountReact();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // 延迟卸载以避免竞态条件
    if (this.reactRoot) {
      setTimeout(() => {
        this.reactRoot?.unmount();
        this.reactRoot = undefined;
      }, 0);
    }
  }

  render() {
    return html`<div class="react-mount"></div>`;
  }
}

// 新增：支持直接传入JSX组件的简化版本
export abstract class ReactJsxBridge<P extends {} = {}> extends LitElement {
  private reactRoot?: Root;
  private mountPoint?: HTMLDivElement;

  /** 子类实现：直接返回JSX组件函数 */
  protected abstract getJsxComponent(): Promise<(props: P) => any>;

  /** 子类传递props */
  protected getReactProps(): P | undefined {
    return undefined;
  }

  private async mountReact() {
    const { React: _React, render } = await import('@arrow-hooks/react18-runtime');
    const JsxComponent = await this.getJsxComponent();
    const props = this.getReactProps();

    if (this.mountPoint) {
      // 这里使用泛型 <P> 并且确保 P 已经被约束为 extends {}
      this.reactRoot = render(
        _React.createElement(JsxComponent, props ?? ({} as P)),
        this.mountPoint,
      );
    }
  }

  firstUpdated() {
    this.mountPoint = this.shadowRoot?.querySelector('.react-mount') as HTMLDivElement;
    if (this.mountPoint) this.mountReact();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.reactRoot) {
      // 延迟卸载以避免竞态条件
      setTimeout(() => {
        this.reactRoot?.unmount();
        this.reactRoot = undefined;
      }, 0);
    }
  }

  render() {
    return html`<div class="react-mount"></div>`;
  }
}
