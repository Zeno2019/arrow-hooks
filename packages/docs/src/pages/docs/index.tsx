import { loader } from 'fumadocs-core/source';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { create, docs } from '../../../source.generated';

// 创建异步 source
const createSource = async () => {
  return loader({
    source: await create.sourceAsync(docs.doc, docs.meta),
    baseUrl: '/docs',
  });
};

export default async function DocsIndexPage() {
  const source = await createSource();
  const page = source.getPage([]);

  if (!page) {
    throw new Error('Docs index page not found');
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  };
};