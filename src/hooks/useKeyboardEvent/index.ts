import useEventListener from '../useEventListener';

type KeyboardEventType = 'keydown' | 'keyup' | 'keypress';

const useKeyboardEvent = (eventType: KeyboardEventType, handler: (event: KeyboardEvent) => void, targetKey?: string) => {
  useEventListener(eventType, ((e: KeyboardEvent) => {
    if (targetKey && e.key !== targetKey) {
      return;
    }

    handler(e);
  }) as EventListener);
};

export default useKeyboardEvent;
