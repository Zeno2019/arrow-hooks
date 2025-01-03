import React from 'react';
import ReactDOM from 'react-dom/client';
import KeyboardEventExample from './hooks/useKeyboardEvent/example';
import EventListenerExample from './hooks/useEventListener/example';
import WindowSizeExample from './hooks/useWindowSize/example';
import HoverExample from './hooks/useHover/example';
import ResizeObserverExample from './hooks/useResizeObserver/example';
import IntersectionObserverExample from './hooks/useIntersectionObserver/example';
import InfinityScrollExample from './hooks/useInfiniteScroll/example';
import MediaQueryExample from './hooks/useMediaQuery/example';
import CookieExample from './hooks/useCookie/example'

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Arrow Hooks Examples</h1>
      <div style={{ marginTop: '2rem' }}>
        {/* Uncomment the example you want to see */}
        {/* <KeyboardEventExample /> */}
        {/* <EventListenerExample /> */}
        {/* <WindowSizeExample /> */}
        {/* <HoverExample /> */}
        {/* <ResizeObserverExample /> */}
        {/* <InfinityScrollExample /> */}
        {/* <MediaQueryExample /> */}
        {/* <IntersectionObserverExample /> */}
        <CookieExample />
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
