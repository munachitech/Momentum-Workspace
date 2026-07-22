import { LayoutDashboard, CheckSquare, FolderKanban, Target, Settings } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { cn } from '@/utils/helpers';

interface SidebarProps {
  view: string;
  onNavigate: (view: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', Icon: CheckSquare },
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'focus', label: 'Focus Mode', Icon: Target },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export default function Sidebar({ view, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  const { projects, selectedProjectId, setSelectedProjectId, tasks } = useData();

  const handleNav = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  const handleProjectClick = (id: string) => {
    setSelectedProjectId(selectedProjectId === id ? null : id);
    onNavigate('tasks');
    onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2.5 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500 text-white shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l3-9 4 18 3-9h4" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">Momentum</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
          <div className="space-y-1">
            {navItems.map(({ id, label, Icon }) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon size={18} strokeWidth={2} />
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 px-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Projects
            </p>
          </div>
          <div className="space-y-0.5">
            {projects.map((p) => {
              const count = tasks.filter((t) => t.projectId === p.id && t.status !== 'done').length;
              const active = selectedProjectId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleProjectClick(p.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50'
                  )}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="flex-1 truncate text-left">{p.name}</span>
                  {count > 0 && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-sm font-semibold text-white">
              AK
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Alex Kim</p>
              <p className="truncate text-xs text-gray-400 dark:text-gray-500">alex@momentum.app</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
