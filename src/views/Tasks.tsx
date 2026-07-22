import { useState, useMemo } from 'react';
import { Search, LayoutGrid, List, Plus, MoreHorizontal, Calendar, Trash2, Check } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { Task, Status, Priority } from '@/types';
import { STATUS_ORDER, STATUS_LABELS, PRIORITY_ORDER } from '@/types';
import { PRIORITY_STYLES, formatDate, isOverdue, isToday, cn } from '@/utils/helpers';
import TaskModal from '@/components/TaskModal';

type ViewMode = 'kanban' | 'list';
type SortKey = 'due' | 'priority' | 'title';

export default function Tasks() {
  const { tasks, projects, selectedProjectId, addTask, updateTask, deleteTask, moveTask, toggleComplete } = useData();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('due');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<Status | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (selectedProjectId) result = result.filter((t) => t.projectId === selectedProjectId);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    if (filterPriority !== 'all') result = result.filter((t) => t.priority === filterPriority);
    return result;
  }, [tasks, selectedProjectId, search, filterPriority]);

  const sortedTasks = useMemo(() => {
    const arr = [...filteredTasks];
    arr.sort((a, b) => {
      if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    return arr;
  }, [filteredTasks, sortBy]);

  const handleSave = (data: Omit<Task, 'id' | 'createdAt'> | Partial<Task>, id?: string) => {
    if (id) {
      updateTask(id, data);
    } else {
      addTask(data as Omit<Task, 'id' | 'createdAt'>);
    }
  };

  const openNew = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    setDragOverCol(status);
  };
  const handleDrop = (status: Status) => {
    if (draggedId) moveTask(draggedId, status);
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <div className="flex h-full flex-col animate-fade-in">
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {selectedProject && (
            <span className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium dark:bg-gray-800">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedProject.color }} />
              {selectedProject.name}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-40 rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-all focus:w-56 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-accent-500/20 sm:w-44"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | 'all')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="due">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Title</option>
          </select>
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn('rounded-l-lg p-2 transition-colors', viewMode === 'kanban' ? 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('rounded-r-lg p-2 transition-colors', viewMode === 'list' ? 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')}
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-600 active:scale-95"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>

      {/* Views */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {STATUS_ORDER.map((status) => {
            const colTasks = sortedTasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={() => handleDrop(status)}
                className={cn(
                  'flex w-72 shrink-0 flex-col rounded-2xl border bg-gray-50/50 transition-colors dark:bg-gray-900/50',
                  dragOverCol === status ? 'border-accent-400 bg-accent-50/50 dark:border-accent-500/50 dark:bg-accent-500/5' : 'border-gray-200 dark:border-gray-800'
                )}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', statusDot(status))} />
                    <h3 className="text-sm font-semibold">{STATUS_LABELS[status]}</h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{colTasks.length}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-3 scrollbar-thin" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                  {colTasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      project={projects.find((p) => p.id === task.projectId)}
                      onEdit={() => openEdit(task)}
                      onDelete={() => deleteTask(task.id)}
                      onDragStart={() => handleDragStart(task.id)}
                      dragging={draggedId === task.id}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <p className="py-8 text-center text-xs text-gray-300 dark:text-gray-600">Drop tasks here</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 scrollbar-thin">
          {sortedTasks.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">No tasks found. Try adjusting your filters.</p>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900/90">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">Task</th>
                  <th className="hidden px-4 py-3 md:table-cell">Project</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {sortedTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId);
                  return (
                    <tr key={task.id} className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                            task.status === 'done'
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 hover:border-accent-500 dark:border-gray-600'
                          )}
                        >
                          {task.status === 'done' && <Check size={12} strokeWidth={3} />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEdit(task)} className={cn('block max-w-xs truncate text-left text-sm font-medium', task.status === 'done' && 'text-gray-400 line-through dark:text-gray-500')}>
                          {task.title}
                        </button>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        {project && (
                          <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                            {project.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium', PRIORITY_STYLES[task.priority].badge)}>
                          <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_STYLES[task.priority].dot)} />
                          {PRIORITY_STYLES[task.priority].label}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <span className={cn('flex items-center gap-1.5 text-sm', isOverdue(task.dueDate, task.status) ? 'text-red-500' : 'text-gray-500 dark:text-gray-400')}>
                          <Calendar size={14} />
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-block rounded-md px-2 py-0.5 text-xs font-medium', statusBadge(task.status))}>
                          {STATUS_LABELS[task.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteTask(task.id)} className="text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-600">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        task={editingTask}
        projects={projects}
        defaultProjectId={selectedProjectId ?? undefined}
      />
    </div>
  );
}

function statusDot(status: Status): string {
  switch (status) {
    case 'todo': return 'bg-gray-400';
    case 'in-progress': return 'bg-accent-500';
    case 'review': return 'bg-orange-500';
    case 'done': return 'bg-green-500';
  }
}

function statusBadge(status: Status): string {
  switch (status) {
    case 'todo': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    case 'in-progress': return 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400';
    case 'review': return 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
    case 'done': return 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400';
  }
}

interface KanbanCardProps {
  task: Task;
  project?: { name: string; color: string };
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  dragging: boolean;
}

function KanbanCard({ task, project, onEdit, onDelete, onDragStart, dragging }: KanbanCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);
  const today = isToday(task.dueDate);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onEdit}
      className={cn(
        'group cursor-grab rounded-xl border border-gray-200 bg-white p-3 shadow-soft transition-all hover:shadow-card active:cursor-grabbing dark:border-gray-800 dark:bg-gray-900',
        dragging && 'opacity-50'
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className={cn('text-sm font-medium leading-snug', task.status === 'done' && 'text-gray-400 line-through dark:text-gray-500')}>
          {task.title}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="shrink-0 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-gray-600"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      {task.description && (
        <p className="mb-2 line-clamp-2 text-xs text-gray-400 dark:text-gray-500">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={cn('inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium', PRIORITY_STYLES[task.priority].badge)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_STYLES[task.priority].dot)} />
          {PRIORITY_STYLES[task.priority].label}
        </span>
        <div className="flex items-center gap-2">
          {project && (
            <span className="hidden items-center gap-1 text-xs text-gray-400 dark:text-gray-500 sm:flex">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
              {project.name}
            </span>
          )}
          <span className={cn('flex items-center gap-1 text-xs', overdue ? 'text-red-500' : today ? 'text-accent-600 dark:text-accent-400' : 'text-gray-400 dark:text-gray-500')}>
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
