import React from 'react';
import { createRoot } from 'react-dom/client';
import './example.css';

// 在这里通过注释方式切换不同的 Example
import Example from './useKeyboardEvent';
// import Example from './useScroll';
// import Example from './useNetwork';
// import Example from './useLocalStorage';

const App = () => {
  return (
    <div>
      <Example />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
