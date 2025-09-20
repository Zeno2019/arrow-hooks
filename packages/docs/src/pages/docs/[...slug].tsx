import { loader } from 'fumadocs-core/source';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import { create, docs } from '../../../source.generated';
import * as Examples from '@/components/examples';

// 创建异步 source
const createSource = async () => {
  return loader({
    source: await create.sourceAsync(docs.doc, docs.meta),
    baseUrl: '/docs',
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
    <DocsPage toc={page.data.toc}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX components={{ ...defaultMdxComponents, ...Examples }} />
      </DocsBody>
    </DocsPage>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};
