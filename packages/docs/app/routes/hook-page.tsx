import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { SidebarSearchInput } from '@/components/sidebar-search-input';
import { TOCAnchorFix } from '@/components/toc-anchor-fix';
import { pageTree } from '@/lib/page-tree';

interface DocContent {
  body: React.ComponentType;
  frontmatter?: Record<string, unknown>;
  toc?: Array<{
    title: string;
    url: string;
    depth: number;
  }>;
}

export default function HookPageClient() {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<DocContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const slug = params['*'] || '';
    const slugArray = slug ? slug.split('/') : [];

    // 直接导入 MDX 文件（暂时简化）
    const loadContent = async () => {
      try {
        setLoading(true);

        if (slugArray.length > 0) {
          const hookModule = await import(`@/content/hooks/${slugArray.join('/')}.mdx`);
          setContent({
            body: hookModule.default,
            frontmatter: hookModule.frontmatter || {},
            toc: hookModule.toc || [],
          });
        }
      } catch (error) {
        console.error('加载 Hook 文档失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [mounted, params]);

  if (!mounted) {
    return null; // 避免水合失败
  }

  const slug = params['*'] || '';
  // const slugArray = slug ? slug.split('/') : [];  // 暂时未使用

  if (loading) {
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
          <div>加载 Hook 文档中...</div>
        </div>
      </DocsLayout>
    );
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
        <div className='min-h-screen p-8'>
          <div className='mb-6'>
            <h1 className='text-4xl font-bold mb-4'>Hook 文档未找到</h1>
            <p className='text-lg text-gray-600'>路径: /hooks/{slug}</p>
          </div>

          <div className='mt-8'>
            <a
              href='/'
              className='inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'
            >
              ← 返回首页
            </a>
          </div>
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
      sidebar={{
        banner: <SidebarSearchInput className='mb-4' />,
      }}
    >
      <TOCAnchorFix />
      <DocsPage toc={content.toc}>
        <DocsBody>
          <ContentComponent />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}
