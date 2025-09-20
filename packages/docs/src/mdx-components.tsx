import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { CookieDemo } from '@/components/CookieDemo';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents, // for Fumadocs UI
    CookieDemo,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

// 确保 default export
export default getMDXComponents;