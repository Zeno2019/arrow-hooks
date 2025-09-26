import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import type { MDXProps } from 'mdx/types';
import { useEffect, useState } from 'react';
import { SidebarSearchInput } from '@/components/sidebar-search-input';
import { TOCAnchorFix } from '@/components/toc-anchor-fix';
import { pageTree } from '@/lib/page-tree';

interface DocContent {
  body: React.ComponentType<MDXProps>;
  frontmatter?: Record<string, unknown>;
  toc?: Array<{
    title: string;
    url: string;
    depth: number;
  }>;
}

export default function HomePageClient() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<DocContent | null>(null);

  useEffect(() => {
    setMounted(true);

    // 简化：直接导入 MDX，避免复杂的数据加载逻辑
    const loadContent = async () => {
      try {
        const indexModule = await import('@/content/index.mdx');
        setContent({
          body: indexModule.default,
          frontmatter: (indexModule as { frontmatter?: Record<string, unknown> }).frontmatter || {},
          toc: (indexModule as { toc?: Array<{ title: string; url: string; depth: number }> }).toc || [],
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
        sidebar={{
          banner: <SidebarSearchInput className='mb-4' />,
        }}
      >
        <div className='min-h-screen flex items-center justify-center'>
          <div>加载文档中...</div>
        </div>
      </DocsLayout>
    );
  }

  const ContentComponent = content.body;

  // 组合默认MDX组件和自定义组件
  const mdxComponents = {
    ...defaultMdxComponents,
    Tab,
    Tabs,
  } as MDXProps['components'];

  return (
    <DocsLayout
      tree={pageTree}
      nav={{
        title: 'Arrow Hooks',
        url: '/',
      }}
      sidebar={{
        banner: <SidebarSearchInput className='mb-4' />,
      }}
    >
      <TOCAnchorFix />
      <DocsPage toc={content.toc}>
        <DocsBody>
          <ContentComponent components={mdxComponents} />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}
