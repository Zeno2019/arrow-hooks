import { useState, useEffect, useCallback } from 'react';
import useEventListener from '../useEventListener';
import { isBrowser, debounce } from '../../util';

type WindowSize = {
  width: number;
  height: number;
};

const getWindowSize = (): WindowSize => {
  if (!isBrowser) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * 用于监听和获取窗口大小
 * @param delay - 防抖延迟时间（毫秒），默认为 200ms
 * @returns { WindowSize } 当前窗口的宽度和高度
 */
const useWindowSize = (delay = 200): WindowSize => {
  const [size, setSize] = useState(getWindowSize);

  const handleResize = useCallback(
    debounce(() => {
      setSize(getWindowSize());
    }, delay),
    [delay]
  );

  useEffect(() => {
    setSize(getWindowSize());
  }, []);

  useEventListener('resize', handleResize);

  return size;
};

export default useWindowSize;
