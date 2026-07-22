import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface TopbarProps {
  title: string;
  onOpenMobile: () => void;
  onQuickAdd: () => void;
}

export default function Topbar({ title, onOpenMobile, onQuickAdd }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 md:px-6">
      <button
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-lg font-semibold tracking-tight md:text-xl">{title}</h1>

      <div className="flex-1" />

      <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 dark:border-gray-800 dark:bg-gray-800/50 md:flex">
        <Search size={15} />
        <span>Search tasks...</span>
        <kbd className="ml-4 rounded border border-gray-300 px-1.5 text-xs dark:border-gray-600">⌘K</kbd>
      </div>

      <button
        onClick={toggleTheme}
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
        <Bell size={20} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500" />
      </button>

      <button
        onClick={onQuickAdd}
        className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-600 active:scale-95"
      >
        <span className="text-lg leading-none">+</span>
        <span className="hidden sm:inline">New Task</span>
      </button>
    </header>
  );
}
