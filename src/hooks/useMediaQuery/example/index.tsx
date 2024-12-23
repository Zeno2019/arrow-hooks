import React from 'react';
import useMediaQuery from '../index';

const MediaQueryExample = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const isPrint = useMediaQuery('print');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div>
      <h2>Media Query Examples</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Screen Size</h3>
        <p>
          Large Screen (≥1024px): {' '}
          <strong style={{ color: isLargeScreen ? '#52c41a' : '#ff4d4f' }}>
            {isLargeScreen ? 'Yes' : 'No'}
          </strong>
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>System Theme</h3>
        <p>
          Dark Mode: {' '}
          <strong style={{ color: isDarkMode ? '#52c41a' : '#ff4d4f' }}>
            {isDarkMode ? 'Enabled' : 'Disabled'}
          </strong>
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Print Mode</h3>
        <p>
          Print Media: {' '}
          <strong style={{ color: isPrint ? '#52c41a' : '#ff4d4f' }}>
            {isPrint ? 'Active' : 'Inactive'}
          </strong>
        </p>
      </div>

      <div>
        <h3>Accessibility</h3>
        <p>
          Reduced Motion: {' '}
          <strong style={{ color: prefersReducedMotion ? '#52c41a' : '#ff4d4f' }}>
            {prefersReducedMotion ? 'Enabled' : 'Disabled'}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default MediaQueryExample;
