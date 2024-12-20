import React from 'react';
import ReactDOM from 'react-dom/client';
import KeyboardEventExample from './hooks/useKeyboardEvent/example';
import EventListenerExample from './hooks/useEventListener/example';
import WindowSizeExample from './hooks/useWindowSize/example';
import HoverExample from './hooks/useHover/example';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Arrow Hooks Examples</h1>
      <div style={{ marginTop: '2rem' }}>
        {/* Uncomment the example you want to see */}
        {/* <KeyboardEventExample /> */}
        {/* <EventListenerExample /> */}
        {/* <WindowSizeExample /> */}
        <HoverExample />
        {/* Add more examples here */}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
