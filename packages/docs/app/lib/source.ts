import { docs } from '../../source.generated';

// 客户端模式：简化文档加载逻辑
export const source = {
  docs,
  getPage: async (slugs: string[]) => {
    try {
      const slug = slugs.join('/');
      // 直接使用 docs.doc 的方法获取页面
      const allPages = await docs.doc.getAll();
      return allPages?.find((page: any) => {
        const pageSlug = page.slugs?.join('/') || '';
        return pageSlug === slug || page.url === `/${slug}`;
      });
    } catch (error) {
      console.error('获取页面失败:', error);
      return null;
    }
  },
  getPages: async () => {
    try {
      return await docs.doc.getAll();
    } catch (error) {
      console.error('获取所有页面失败:', error);
      return [];
    }
  },
};
