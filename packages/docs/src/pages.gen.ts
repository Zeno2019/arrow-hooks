// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_DocsSlug_getConfig } from './pages/docs/[...slug]';
// prettier-ignore
import type { getConfig as File_DocsIndex_getConfig } from './pages/docs/index';

// prettier-ignore
type Page =
| ({ path: '/docs/[...slug]' } & GetConfigResponse<typeof File_DocsSlug_getConfig>)
| ({ path: '/docs' } & GetConfigResponse<typeof File_DocsIndex_getConfig>)
| { path: '/'; render: 'dynamic' };

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
