import { useEffect, useState } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import { pageTree } from '../lib/page-tree';
import { TOCAnchorFix } from '../../src/components/toc-anchor-fix';

interface DocContent {
  body: React.ComponentType;
  frontmatter?: Record<string, unknown>;
}

export function HydrateFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>加载中...</div>
    </div>
  );
}

export default function HomePageClient() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<DocContent | null>(null);

  useEffect(() => {
    setMounted(true);

    // 简化：直接导入 MDX，避免复杂的数据加载逻辑
    const loadContent = async () => {
      try {
        const indexModule = await import('../../src/content/index.mdx');
        setContent({
          body: indexModule.default,
          frontmatter: (indexModule as any).frontmatter || {}
        });
      } catch (error) {
        console.error('加载文档内容失败:', error);
      }
    };

    loadContent();
  }, []);

  if (!mounted) {
    return null;
  }

  if (!content) {
    return (
      <DocsLayout
        tree={pageTree}
        nav={{
          title: 'Arrow Hooks',
          url: '/',
        }}
      >
        <div className="min-h-screen flex items-center justify-center">
          <div>加载文档中...</div>
        </div>
      </DocsLayout>
    );
  }

  const ContentComponent = content.body;

  return (
    <DocsLayout
      tree={pageTree}
      nav={{
        title: 'Arrow Hooks',
        url: '/',
      }}
    >
      <TOCAnchorFix />
      <DocsPage>
        <DocsBody>
          <ContentComponent />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}