import { useEffect } from 'react';

type KeyboardEventType = 'keydown' | 'keyup' | 'keypress';

const useKeyboardEvent = (
  eventType: KeyboardEventType,
  handler: (event: KeyboardEvent) => void,
  targetKey?: string
) => {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (targetKey && event.key !== targetKey) {
        return;
      }
      handler(event);
    };

    window.addEventListener(eventType, listener);

    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, handler, targetKey]);
};

export default useKeyboardEvent;
