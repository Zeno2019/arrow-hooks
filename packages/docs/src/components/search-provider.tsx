'use client';

import { type AnyOrama, create, insert, search as oramaSearch } from '@orama/orama';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { docs } from '../../source.generated';

// 定义搜索文档的 schema 类型
interface SearchDocument {
  id: string;
  title: string;
  content: string;
  url: string;
}

// 搜索结果类型 - 基于 Orama 的实际返回结果
interface SearchResultItem {
  id: string;
  score?: number;
  document?: {
    id?: string;
    title?: string;
    content?: string;
    url?: string;
  };
}

// 搜索上下文
const SearchContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  results: SearchResultItem[];
  isLoading: boolean;
}>({
  open: false,
  setOpen: () => {},
  search: '',
  setSearch: () => {},
  results: [],
  isLoading: false,
});

// 从真实的 MDX 文件动态生成搜索数据
async function generateSearchData() {
  const searchData = [];

  try {
    console.debug('开始从 MDX 文件生成搜索数据...');
    console.debug('docs 对象结构:', docs);

    // 获取所有 MDX 文件的导入函数
    const mdxFiles = Object.keys(docs.doc);
    console.debug('找到 MDX 文件:', mdxFiles);

    for (const filePath of mdxFiles) {
      try {
        console.debug(`正在处理文件: ${filePath}`);

        // 动态导入 MDX 文件内容
        const importFunction = docs.doc[filePath];
        const moduleContent = await importFunction();

        console.debug(`${filePath} 模块内容:`, moduleContent);

        // 提取 frontmatter 数据
        const frontmatter = moduleContent.frontmatter || moduleContent.metadata || {};
        const title = frontmatter.title || filePath.replace('.mdx', '').replace('/', ' / ');
        const description = frontmatter.description || '';

        console.debug(`${filePath} frontmatter:`, frontmatter);
        console.debug(`${filePath} structuredData:`, moduleContent.structuredData);

        // 尝试从 structuredData 提取实际内容
        let documentContent = '';

        if (moduleContent.structuredData) {
          const structured = moduleContent.structuredData;

          // 检查 structuredData 的结构
          console.debug(`${filePath} structuredData 字段:`, Object.keys(structured));

          // 尝试提取内容的不同方式
          if (structured.contents) {
            // 如果有 contents 数组
            documentContent = structured.contents.map((item) => item.content || '').join(' ');
            console.debug(`${filePath} 从 contents 提取内容，长度:`, documentContent.length);
          } else if (structured.headings) {
            // 如果有 headings 数组，提取标题内容
            documentContent = structured.headings.map((heading) => heading.content || '').join(' ');
            console.debug(`${filePath} 从 headings 提取内容，长度:`, documentContent.length);
          } else {
            // 如果以上都没有，尝试遍历所有字符串字段
            const allContent = [];
            for (const [_key, value] of Object.entries(structured)) {
              if (typeof value === 'string') {
                allContent.push(value);
              } else if (Array.isArray(value)) {
                value.forEach((item) => {
                  if (typeof item === 'string') {
                    allContent.push(item);
                  } else if (typeof item === 'object' && item !== null) {
                    // 如果数组项是对象，尝试提取常见的内容字段
                    ['content', 'text', 'value', 'description'].forEach((field) => {
                      if (item[field] && typeof item[field] === 'string') {
                        allContent.push(item[field]);
                      }
                    });
                  }
                });
              }
            }
            documentContent = allContent.join(' ');
            console.debug(`${filePath} 从所有字段提取内容，长度:`, documentContent.length);
          }
        }

        // 如果 structuredData 没有内容，尝试其他字段
        if (!documentContent && moduleContent.toc) {
          // 从目录中提取标题
          const tocContent = JSON.stringify(moduleContent.toc);
          documentContent = tocContent;
          console.debug(`${filePath} 从 toc 提取内容，长度:`, documentContent.length);
        }

        // 如果还是没有内容，尝试 extractedReferences
        if (!documentContent && moduleContent.extractedReferences) {
          const refContent = JSON.stringify(moduleContent.extractedReferences);
          documentContent = refContent;
          console.debug(
            `${filePath} 从 extractedReferences 提取内容，长度:`,
            documentContent.length,
          );
        }

        // 清理 Markdown 标记
        const cleanContent = documentContent
          .replace(/```[\s\S]*?```/g, '') // 移除代码块
          .replace(/`[^`]+`/g, '') // 移除行内代码
          .replace(/#{1,6}\s*/g, '') // 移除标题标记
          .replace(/\*\*(.*?)\*\*/g, '$1') // 移除加粗
          .replace(/\*(.*?)\*/g, '$1') // 移除斜体
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接，保留文本
          .replace(/\n+/g, ' ') // 换行替换为空格
          .replace(/\s+/g, ' ') // 多个空格替换为单个
          .trim();

        // 合并所有可搜索内容
        const searchableContent = [title, description, cleanContent].filter(Boolean).join(' ');

        // 生成 URL
        const url = filePath === 'index.mdx' ? '/' : `/${filePath.replace('.mdx', '')}`;

        const searchItem = {
          id: url,
          title,
          content: searchableContent,
          url,
        };

        searchData.push(searchItem);
        console.debug(`添加到搜索索引: ${title} - 内容长度: ${searchableContent.length}`);
      } catch (fileError) {
        console.error(`处理文件 ${filePath} 时出错:`, fileError);

        // 为失败的文件提供基础数据
        const title = filePath.replace('.mdx', '').replace('hooks/', '');
        const url = filePath === 'index.mdx' ? '/' : `/${filePath.replace('.mdx', '')}`;

        searchData.push({
          id: url,
          title,
          content: `${title} 文档页面`,
          url,
        });
      }
    }
  } catch (error) {
    console.error('生成搜索数据时出错:', error);

    // 完全回退到基础数据
    console.debug('回退到基础搜索数据');
    searchData.push(
      {
        id: '/',
        title: '开始使用',
        content:
          'Arrow Hooks - 一个实用的 React Hooks 集合，专注于提供高质量、类型安全的 React Hooks。我们致力于提供易用、高效的 React Hooks 工具库。',
        url: '/',
      },
      {
        id: '/hooks/use-cookie',
        title: 'useCookie',
        content:
          'useCookie 是一个用于操作浏览器 Cookie 的 React Hook，提供类型安全的 Cookie 读写功能，支持完整的 Cookie 选项配置。',
        url: '/hooks/use-cookie',
      },
    );
  }

  console.debug('最终生成的搜索数据:', searchData);
  return searchData;
}

// 初始化 Orama 搜索引擎
async function initOrama() {
  console.debug('初始化 Orama 搜索引擎...');
  const orama = create({
    schema: {
      id: 'string',
      title: 'string',
      content: 'string',
      url: 'string',
    },
    language: 'english',
  });

  // 动态生成搜索数据
  const searchData = await generateSearchData();
  console.debug('Orama 实例已创建，开始添加搜索数据...', searchData);

  // 添加搜索数据到 Orama 实例
  for (const doc of searchData) {
    console.debug('添加文档:', doc);
    await insert(orama, doc);
  }

  console.debug(`Orama 初始化完成，已添加 ${searchData.length} 个文档`);
  return orama;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [oramaInstance, setOramaInstance] = useState<AnyOrama | null>(null);

  // 初始化 Orama
  useEffect(() => {
    async function init() {
      try {
        const orama = await initOrama();
        setOramaInstance(orama);
        console.debug('Orama 实例设置完成');
      } catch (error) {
        console.error('初始化 Orama 失败:', error);
      }
    }
    init();
  }, []);

  // 执行搜索
  useEffect(() => {
    async function performSearch() {
      if (!search.trim() || !oramaInstance) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        console.debug(`执行搜索: "${search}"`);
        const searchResults = await oramaSearch(oramaInstance, {
          term: search,
        });

        console.debug('搜索结果:', searchResults);

        // 转换搜索结果格式，使用类型断言避免 Orama 复杂的泛型类型问题
        const formattedResults = (searchResults.hits || []).map((hit: any) => ({
          id: hit.id,
          score: hit.score,
          document: hit.document as SearchDocument,
        }));

        setResults(formattedResults);
        console.debug(`找到 ${formattedResults.length} 个结果`);
      } catch (error) {
        console.error('搜索执行失败:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    const timeoutId = setTimeout(performSearch, 300); // 添加防抖
    return () => clearTimeout(timeoutId);
  }, [search, oramaInstance]);

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SearchContext.Provider value={{ open, setOpen, search, setSearch, results, isLoading }}>
      {children}
      {/* 完全自定义的搜索对话框，不使用 fumadocs 的 SearchDialog */}
      {open && (
        <div className='fixed inset-0 z-50 bg-black/50' onClick={() => setOpen(false)}>
          <div
            className='fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md p-4'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-4'>
              <input
                type='text'
                placeholder='搜索文档...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring'
                autoFocus
              />
            </div>

            {/* 显示搜索结果 */}
            <div className='max-h-64 overflow-y-auto'>
              {isLoading ? (
                <p className='text-sm text-gray-500'>搜索中...</p>
              ) : results.length > 0 ? (
                <div>
                  <p className='text-sm text-gray-600 mb-2'>找到 {results.length} 个结果：</p>
                  {results.map((result: SearchResultItem) => (
                    <div
                      key={result.id}
                      className='p-2 hover:bg-gray-100 rounded cursor-pointer'
                      onClick={() => {
                        // 使用 result.document 访问文档数据
                        const url = result.document?.url || `/${result.id}`;
                        window.location.href = url;
                        setOpen(false);
                      }}
                    >
                      {/* 显示搜索结果内容 */}
                      <div className='font-medium'>{result.document?.title || result.id}</div>
                      <div className='text-sm text-gray-600 truncate'>
                        {result.document?.content || ''}
                      </div>
                      <div className='text-xs text-gray-400 mt-1'>
                        {result.document?.url && `URL: ${result.document.url}`}
                        {result.score && ` (Score: ${result.score.toFixed(2)})`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : search ? (
                <p className='text-sm text-gray-500'>没有找到结果</p>
              ) : (
                <p className='text-sm text-gray-500'>输入关键词开始搜索</p>
              )}
            </div>

            <div className='mt-4 flex justify-end'>
              <button
                onClick={() => setOpen(false)}
                className='px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded'
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </SearchContext.Provider>
  );
}

// Hook 供其他组件使用
export function useSearch() {
  return useContext(SearchContext);
}
