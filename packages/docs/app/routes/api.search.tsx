import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '../lib/source';

const server = createFromSource(source, {
  language: 'english',
});

// SPA 模式下的 API 路由处理
export default function SearchAPI() {
  // 这个组件不会被渲染，而是用于处理 API 请求
  return null;
}

// 处理搜索请求的函数
export async function handleRequest(request: Request) {
  return server.GET(request);
}