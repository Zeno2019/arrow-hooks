import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useCookie from '../index';
import { act } from 'react';

describe('useCookie', () => {
  let consoleWarnSpy: any;

  beforeEach(() => {
    // 清除所有 cookie
    document.cookie.split(';').forEach(cookie => {
      const [key] = cookie.split('=');
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });

    // 监听 console.warn
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });


  it('should return default value when cookie is not set', () => {
    const { result } = renderHook(() => useCookie('test', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should set and get cookie value', () => {
    const { result } = renderHook(() => useCookie('test'));

    act(() => {
      result.current[1]('hello');
    });

    expect(result.current[0]).toBe('hello');
    expect(document.cookie).toContain('test=hello');
  });

  it('should remove cookie', () => {
    const { result } = renderHook(() => useCookie('test'));

    act(() => {
      result.current[1]('hello');
    });

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBeUndefined();
    expect(document.cookie).not.toContain('test=hello');
  });

  it('should handle cookie options', () => {
    const { result } = renderHook(() => useCookie('test'));
    const [, setCookie] = result.current;

    // 模拟 document.cookie 的 setter
    const cookieSetter = vi.spyOn(document, 'cookie', 'set');

    act(() => {
      setCookie('hello', {
        path: '/',
        maxAge: 3600,
        secure: true,
        SameSite: 'Strict'
      });
    });

    // 验证 cookie 设置调用
    expect(cookieSetter).toHaveBeenCalledWith(
      expect.stringMatching(/test=hello.*path=\/.*max-age=3600.*secure.*SameSite=Strict/)
    );

    cookieSetter.mockRestore();
  });

  it('should handle special characters in cookie value', () => {
    const { result } = renderHook(() => useCookie('test'));
    const specialValue = '你好,world!@#$%^&*()';

    act(() => {
      result.current[1](specialValue);
    });

    expect(result.current[0]).toBe(specialValue);
  });


  it('should warn when removing non-existent cookie in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const { result } = renderHook(() => useCookie('nonexistent'));

    act(() => {
      result.current[2]();
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[useCookie] Attempting to remove non-existent cookie: nonexistent'
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle cookie removal with path and domain options', () => {
    const { result } = renderHook(() => useCookie('test'));

    // 先设置带 path 和 domain 的 cookie
    act(() => {
      result.current[1]('value', {
        path: '/test',
        domain: 'example.com'
      });
    });

    // 使用相同的 path 和 domain 删除
    act(() => {
      result.current[2]({
        path: '/test',
        domain: 'example.com'
      });
    });

    expect(result.current[0]).toBeUndefined();
  });
});