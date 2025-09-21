import { loader } from 'fumadocs-core/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { create, docs } from '~/source.generated';

// 创建异步 source
const createSource = async () => {
  return loader({
    source: await create.sourceAsync(docs.doc, docs.meta),
    baseUrl: '/docs',
  });
};

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const source = await createSource();

  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: 'Arrow Hooks',
        url: '/',
      }}
    >
      {children}
    </DocsLayout>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};
