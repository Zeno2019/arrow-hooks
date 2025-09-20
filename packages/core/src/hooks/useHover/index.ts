import { type RefObject, useEffect, useState } from 'react';

// import useEventListener from '../useEventListener';

/**
 * 用于检测元素是否 hover
 * @param elementRef -hover 的元素 ref
 * @returns { boolean } -是否 hover
 */
const useHover = <T extends HTMLElement>(elementRef: RefObject<T>): boolean => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef]);

  return isHovered;
};

export default useHover;
