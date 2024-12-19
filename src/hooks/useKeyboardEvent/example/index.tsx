import React, { useState } from 'react';
import useKeyboardEvent from '../index';

const KeyboardEventExample = () => {
  const [lastKey, setLastKey] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');

  useKeyboardEvent('keydown', (e) => {
    setLastKey(e.key);
    setEventType('keydown');
  });

  useKeyboardEvent('keyup', (e) => {
    setLastKey(e.key);
    setEventType('keyup');
  });

  return (
    <div>
      <h2>Keyboard Event Example</h2>
      <div>
        <p>Press any key to test:</p>
        <p>Last Key: {lastKey}</p>
        <p>Event Type: {eventType}</p>
      </div>
    </div>
  );
};

export default KeyboardEventExample;
