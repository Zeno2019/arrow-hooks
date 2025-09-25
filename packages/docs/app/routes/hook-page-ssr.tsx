import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsPage } from 'fumadocs-ui/page';
import { useLoaderData } from 'react-router';
import * as Examples from '@/components/examples';
import { docs } from '~/source.generated';
import { toClientRenderer } from 'fumadocs-mdx/runtime/vite';
import { source } from '../lib/source';

const renderer = toClientRenderer(docs.doc, ({ default: Mdx }) => {
  return (
    <Mdx
      components={{
        ...defaultMdxComponents,
        ...Examples,
      }}
    />
  );
});

export async function loader({ params }: { params: { '*': string } }) {
  const slug = params['*'] || '';
  const slugArray = slug ? slug.split('/') : [];

  const page = source.getPage(slugArray);

  if (!page) {
    throw new Response('页面未找到', { status: 404 });
  }

  return {
    page,
    path: page.path,
    tree: source.pageTree,
  };
}

export default function HookPage() {
  const { page, path, tree } = useLoaderData<typeof loader>();
  const toc = (page.data as any).toc;
  const Content = renderer[path];

  return (
    <DocsLayout
      tree={tree as any}
      nav={{
        title: 'Arrow Hooks',
        url: '/',
      }}
    >
      <DocsPage toc={toc}>
        <DocsBody>
          <Content />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}