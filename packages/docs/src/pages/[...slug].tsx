import { loader } from 'fumadocs-core/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import * as Examples from '@/components/examples';
import { create, docs } from '~/source.generated';

// 创建异步 source
const createSource = async () => {
  return loader({
    source: await create.sourceAsync(docs.doc, docs.meta),
    baseUrl: '/',
  });
};

interface DocsPageProps {
  slug: string[];
}

export default async function DocPage({ slug }: DocsPageProps) {
  const source = await createSource();
  const page = source.getPage(slug);

  if (!page) {
    throw new Error('Page not found');
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
      <DocsPage toc={page.data.toc}>
        <DocsBody>
          <MDX components={{ ...defaultMdxComponents, ...Examples }} />
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
