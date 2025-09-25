'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import { SearchDialog } from 'fumadocs-ui/components/dialog/search';
import { create } from '@orama/orama';

// 初始化 Orama 搜索引擎 - SPA 模式下的客户端搜索
function initOrama() {
  return create({
    schema: { _: 'string' },
    language: 'english',
  });
}

export function CustomSearchDialog(props: SharedProps) {
  console.debug('CustomSearchDialog rendered in SPA mode with static search');

  // SPA 模式下使用 static 类型进行纯客户端搜索
  // 不使用 from 参数，让 Orama 直接处理数据
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    initOrama,
  });

  console.debug('Search state:', { search, queryData: query.data });

  return (
    <SearchDialog
      {...props}
      search={search}
      onSearchChange={setSearch}
    >
      {/* SearchDialog 需要 children */}
      <div />
    </SearchDialog>
  );
}
