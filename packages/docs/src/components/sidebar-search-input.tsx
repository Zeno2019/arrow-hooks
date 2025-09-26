'use client';

import { useSearch } from './search-provider';

interface SidebarSearchInputProps {
  className?: string;
}

export function SidebarSearchInput({ className = '' }: SidebarSearchInputProps) {
  const { setOpen } = useSearch();

  // 检测操作系统以显示正确的快捷键
  const isMac = typeof window !== 'undefined' && navigator.userAgent.includes('Mac');
  const shortcutKey = isMac ? '⌘+K' : 'Ctrl+K';

  const handleClick = () => {
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div
      className={`sidebar-search-input group cursor-pointer rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='button'
      aria-label='打开搜索对话框'
      aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <svg
            className='size-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
          <span className='sidebar-search-input__placeholder'>搜索文档...</span>
        </div>
        <kbd className='sidebar-search-input__shortcut pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          {shortcutKey}
        </kbd>
      </div>
    </div>
  );
}
