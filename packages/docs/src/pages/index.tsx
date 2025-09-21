import { loader } from 'fumadocs-core/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import { TOCAnchorFix } from '@/components/toc-anchor-fix';
import { create, docs } from '~/source.generated';

// 创建异步 source
const createSource = async () => {
  return loader({
    source: await create.sourceAsync(docs.doc, docs.meta),
    baseUrl: '/',
  });
};

export default async function HomePage() {
  const source = await createSource();
  const page = source.getPage([]);

  if (!page) {
    throw new Error('Docs index page not found');
  }

  const MDX = page.data.body;

  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: 'Arrow Hooks',
        url: '/',
      }}
    >
      <TOCAnchorFix />
      <DocsPage toc={page.data.toc}>
        <DocsBody>
          <MDX />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};
