import { useState, useCallback } from 'react';
import { isBrowser } from '../../util';

interface CookieOptions {
  path?: string;
  expires?: number | Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  SameSite?: 'Strict' | 'Lax' | 'None';
}

type SetCookieValue = string | null;

const hasCookie = (key: string): boolean => {
  if (!isBrowser) return false;
  return document.cookie
    .split(';')
    .some(item => item.trim().startsWith(`${key}=`));
};


/**
 * 用于 Cookie 操作的 Hook
 * @param key - cookie 的 key 名
 * @param defaultValue - 默认值
 * @returns [cookieValue, setCookie, removeCookie]
 */
const useCookie = (key: string, defaultValue?: string) => {
  const getCookieValue = useCallback(() => {
    if (!isBrowser) return defaultValue;

    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${key})=([^;]*)`));
    return match ? decodeURIComponent(match[3]) : defaultValue;
  }, [key, defaultValue]);

  const [value, setValue] = useState<string | undefined>(getCookieValue);

  const setCookie = useCallback((newValue: SetCookieValue, options: CookieOptions = {}) => {
    if (!isBrowser) return;

    // 如果传入 null，则删除 cookie
    if (newValue === null) {
      const cookieExists = hasCookie(key);

      if (process.env.NODE_ENV === 'development' && !cookieExists) {
        console.warn(
          `[useCookie] Attempting to remove non-existent cookie: ${key}`
        );
      }

      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${options.path ? `; path=${options.path}` : ''
        }${options.domain ? `; domain=${options.domain}` : ''}`;

      setValue(undefined);
      return;
    }

    let cookie = `${key}=${encodeURIComponent(newValue)}`;

    if (options.path) {
      cookie += `; path=${options.path}`;
    }

    if (options.expires) {
      const expirationDate = options.expires instanceof Date
        ? options.expires
        : new Date(Date.now() + options.expires * 1000);
      cookie += `; expires=${expirationDate.toUTCString()}`;
    }

    if (options.maxAge) {
      cookie += `; max-age=${options.maxAge}`;
    }

    if (options.domain) {
      cookie += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookie += '; secure';
    }

    if (options.SameSite) {
      cookie += `; SameSite=${options.SameSite}`;
    }

    try {
      document.cookie = cookie;
      setValue(newValue);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[useCookie] Failed to set cookie: ${key}`, error);
      }

      throw error;
    }
  }, [key]);

  const removeCookie = useCallback((options: CookieOptions = {}) => {
    const cookieExists = hasCookie(key);

    if (process.env.NODE_ENV === 'development' && !cookieExists) {
      console.warn(
        `[useCookie] Attempting to remove non-existent cookie: ${key}`
      );
    }

    setCookie(null, options);
  }, [key, setCookie]);

  return [value, setCookie, removeCookie] as const;
};

export default useCookie;