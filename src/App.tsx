import React from 'react';
import ReactDOM from 'react-dom/client';
import KeyboardEventExample from './hooks/useKeyboardEvent/example';

const App = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Arrow Hooks Examples</h1>
      <div style={{ marginTop: '2rem' }}>
        {/* Uncomment the example you want to see */}
        <KeyboardEventExample />
        {/* Add more examples here */}
        {/* <UseToggleExample /> */}
        {/* <UseDebounceExample /> */}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
