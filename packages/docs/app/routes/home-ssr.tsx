import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import { useLoaderData } from 'react-router';
import { source } from '../lib/source';
import { docs } from '../../source.generated';
import { toClientRenderer } from 'fumadocs-mdx/runtime/vite';

const renderer = toClientRenderer(docs.doc, ({ default: Mdx }) => {
  return (
    <div className="prose">
      <Mdx />
    </div>
  );
});

export async function loader() {
  const page = source.getPage([]);

  if (!page) {
    throw new Response('文档首页未找到', { status: 404 });
  }

  return {
    path: page.path,
    tree: source.pageTree,
  };
}

export default function HomePage() {
  const { path, tree } = useLoaderData<typeof loader>();
  const Content = renderer[path];

  return (
    <DocsLayout
      tree={tree as any}
      nav={{
        title: 'Arrow Hooks',
        url: '/',
      }}
    >
      <DocsPage>
        <DocsBody>
          <Content />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}