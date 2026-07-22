import { LayoutDashboard, CheckSquare, FolderKanban, Target, Settings } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface MobileNavProps {
  view: string;
  onNavigate: (view: string) => void;
}

const items = [
  { id: 'dashboard', label: 'Home', Icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', Icon: CheckSquare },
  { id: 'focus', label: 'Focus', Icon: Target },
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export default function MobileNav({ view, onNavigate }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-gray-200 bg-white/90 px-2 py-1.5 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/90 md:hidden">
      {items.map(({ id, label, Icon }) => {
        const active = view === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-xs transition-colors',
              active ? 'text-accent-600 dark:text-accent-400' : 'text-gray-400 dark:text-gray-500'
            )}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
