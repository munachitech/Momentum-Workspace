import { useMemo } from 'react';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, Plus, ChevronRight } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { isToday, isOverdue, isThisWeek, formatRelative, PRIORITY_STYLES, cn } from '@/utils/helpers';
import type { ActivityItem } from '@/types';

interface DashboardProps {
  onNavigate: (view: string) => void;
  onQuickAdd: () => void;
}

export default function Dashboard({ onNavigate, onQuickAdd }: DashboardProps) {
  const { tasks, projects, activity, toggleComplete } = useData();

  const stats = useMemo(() => {
    const dueToday = tasks.filter((t) => isToday(t.dueDate) && t.status !== 'done');
    const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status));
    const completedThisWeek = tasks.filter((t) => t.status === 'done' && t.completedAt && isThisWeek(t.completedAt));
    const totalThisWeek = tasks.filter((t) => isThisWeek(t.dueDate));
    const completionRate = totalThisWeek.length > 0 ? Math.round((completedThisWeek.length / totalThisWeek.length) * 100) : 0;
    return { dueToday, overdue, completedThisWeek, completionRate, totalThisWeek };
  }, [tasks]);

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const dayOfWeek = today.getDay();
    return days.map((day, i) => {
      const diff = i - dayOfWeek;
      const date = new Date(today);
      date.setDate(today.getDate() + diff);
      const dateStr = date.toDateString();
      const dayTasks = tasks.filter((t) => new Date(t.dueDate).toDateString() === dateStr);
      const completed = dayTasks.filter((t) => t.status === 'done').length;
      const total = dayTasks.length;
      return { day, completed, total, isToday: i === dayOfWeek };
    });
  }, [tasks]);

  const maxWeekly = Math.max(...weeklyData.map((d) => d.total), 1);

  const activityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'created': return <Plus size={16} className="text-accent-500" />;
      case 'moved': return <ChevronRight size={16} className="text-orange-500" />;
      case 'updated': return <Clock size={16} className="text-gray-400" />;
    }
  };

  const activityText = (item: ActivityItem) => {
    switch (item.type) {
      case 'completed': return 'completed';
      case 'created': return 'created';
      case 'moved': return 'moved';
      case 'updated': return 'updated';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Clock size={20} />} label="Due Today" value={stats.dueToday.length} accent="text-accent-600 bg-accent-50 dark:bg-accent-500/10 dark:text-accent-400" />
        <StatCard icon={<AlertTriangle size={20} />} label="Overdue" value={stats.overdue.length} accent="text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Completed This Week" value={stats.completedThisWeek.length} accent="text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400" />
        <StatCard icon={<TrendingUp size={20} />} label="Completion Rate" value={`${stats.completionRate}%`} accent="text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly progress */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Weekly Progress</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">Tasks completed vs. total this week</p>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 sm:gap-4">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div className="relative flex w-full max-w-[2.5rem] flex-col justify-end" style={{ height: '140px' }}>
                    {d.total > 0 && (
                      <div
                        className="w-full rounded-t-md bg-gray-100 dark:bg-gray-800"
                        style={{ height: `${(d.total / maxWeekly) * 100}%` }}
                      >
                        <div
                          className={cn(
                            'w-full rounded-t-md bg-gradient-to-t from-accent-400 to-accent-500 transition-all duration-500',
                            d.isToday && 'from-accent-500 to-accent-400'
                          )}
                          style={{ height: `${(d.completed / d.total) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <span className={cn('text-xs font-medium', d.isToday ? 'text-accent-600 dark:text-accent-400' : 'text-gray-400 dark:text-gray-500')}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-accent-500" /> Completed</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-gray-200 dark:bg-gray-800" /> Total</span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-5 font-semibold">Recent Activity</h3>
          <div className="space-y-1">
            {activity.slice(0, 7).map((item, i) => (
              <div key={item.id} className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="mt-0.5 shrink-0">{activityIcon(item.type)}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-medium capitalize">{activityText(item)}</span>{' '}
                    <span className="text-gray-500 dark:text-gray-400">{item.taskTitle}</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatRelative(item.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Due today + Quick add */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Due Today</h3>
            <button onClick={() => onNavigate('tasks')} className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {stats.dueToday.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">Nothing due today. You're all caught up!</p>
            ) : (
              stats.dueToday.slice(0, 5).map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                return (
                  <div key={task.id} className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 transition-colors hover:border-accent-500 dark:border-gray-600"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{project?.name}</p>
                    </div>
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', PRIORITY_STYLES[task.priority].dot)} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick add */}
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-accent-500 to-accent-600 p-6 text-white shadow-soft dark:border-gray-800">
          <h3 className="mb-2 font-semibold">Quick Add</h3>
          <p className="mb-5 text-sm text-white/80">Add a task in seconds to keep your momentum going.</p>
          <button
            onClick={onQuickAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/20 px-4 py-3 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30 active:scale-95"
          >
            <Plus size={18} />
            New Task
          </button>
          <div className="mt-6 space-y-2 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span>Active tasks</span>
              <span className="font-semibold text-white">{tasks.filter((t) => t.status !== 'done').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Projects</span>
              <span className="font-semibold text-white">{projects.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft dark:border-gray-800 dark:bg-gray-900">
      <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-xl', accent)}>
        {icon}
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>
    </div>
  );
}
