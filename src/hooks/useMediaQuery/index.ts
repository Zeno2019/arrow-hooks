import { useState, useEffect } from 'react';
import { isBrowser } from '../../util';

/**
 * 用于响应媒体查询变化的 Hook
 * @param query - 媒体查询字符串
 * @returns {boolean} - 当前媒体查询是否匹配
 */
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (!isBrowser) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!isBrowser) return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const updateMatch = (e: MediaQueryListEvent | MediaQueryList) => {
      setMatches(e.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMatch);
      return () => mediaQuery.removeEventListener('change', updateMatch);
    } else {
      // 兼容旧 API
      mediaQuery.addListener(updateMatch);
      return () => mediaQuery.removeListener(updateMatch);
    }
  }, [query]);

  return matches;
};

export default useMediaQuery;