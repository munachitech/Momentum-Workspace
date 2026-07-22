import { useMemo, useState } from 'react';
import { Plus, FolderKanban, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { cn } from '@/utils/helpers';

const colorOptions = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];

interface ProjectsProps {
  onNavigate: (view: string) => void;
}

export default function Projects({ onNavigate }: ProjectsProps) {
  const { projects, tasks, addProject, deleteProject, setSelectedProjectId } = useData();
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(colorOptions[0]);

  const projectStats = useMemo(() => {
    return projects.map((p) => {
      const pTasks = tasks.filter((t) => t.projectId === p.id);
      const total = pTasks.length;
      const done = pTasks.filter((t) => t.status === 'done').length;
      const active = total - done;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return { ...p, total, done, active, pct };
    });
  }, [projects, tasks]);

  const handleCreate = () => {
    if (!name.trim()) return;
    addProject({ name: name.trim(), color, description: '' });
    setName('');
    setColor(colorOptions[0]);
    setShowNew(false);
  };

  const handleOpen = (id: string) => {
    setSelectedProjectId(id);
    onNavigate('tasks');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400 dark:text-gray-500">{projects.length} projects</p>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-600 active:scale-95"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {showNew && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 font-semibold">Create New Project</h3>
          <div className="space-y-4">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-accent-500/20"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <div>
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Color</p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn('h-8 w-8 rounded-full transition-transform', color === c && 'scale-110 ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600 dark:ring-offset-gray-900')}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowNew(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleCreate} className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white hover:bg-accent-600">Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projectStats.map((p) => (
          <div
            key={p.id}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-soft transition-all hover:shadow-card dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${p.color}15` }}>
                  <FolderKanban size={20} style={{ color: p.color }} />
                </div>
                <div>
                  <h3 className="font-semibold leading-tight">{p.name}</h3>
                  {p.description && <p className="text-xs text-gray-400 dark:text-gray-500">{p.description}</p>}
                </div>
              </div>
              <button
                onClick={() => deleteProject(p.id)}
                className="text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-600"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mb-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-gray-400 dark:text-gray-500">{p.done} of {p.total} done</span>
                <span className="font-semibold" style={{ color: p.color }}>{p.pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1">
                  <Circle size={12} /> {p.active} active
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} /> {p.done} done
                </span>
              </div>
              <button
                onClick={() => handleOpen(p.id)}
                className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400"
              >
                View tasks →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
