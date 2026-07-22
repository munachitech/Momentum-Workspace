import { useMemo } from 'react';
import { Target, Check, Flame, ArrowRight } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { PRIORITY_ORDER } from '@/types';
import { PRIORITY_STYLES, isToday, cn } from '@/utils/helpers';
import type { Task } from '@/types';

export default function Focus() {
  const { tasks, projects, toggleComplete } = useData();

  const focusTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'done' && isToday(t.dueDate))
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
      .slice(0, 6);
  }, [tasks]);

  const completed = tasks.filter((t) => t.status === 'done' && isToday(t.dueDate)).length;
  const totalToday = tasks.filter((t) => isToday(t.dueDate)).length;
  const progress = totalToday > 0 ? Math.round((completed / totalToday) * 100) : 0;

  const circleRadius = 80;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex min-h-full flex-col items-center animate-fade-in">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400">
            <Target size={28} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Focus Mode</h2>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Your highest priority tasks for today. One thing at a time.</p>
        </div>

        {/* Progress ring */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative">
            <svg width="200" height="200" className="-rotate-90">
              <circle cx="100" cy="100" r={circleRadius} fill="none" strokeWidth="10" className="stroke-gray-100 dark:stroke-gray-800" />
              <circle
                cx="100"
                cy="100"
                r={circleRadius}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                className="stroke-accent-500 transition-all duration-700"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold tracking-tight">{progress}%</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{completed} / {totalToday} today</span>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-orange-50 px-4 py-2 text-sm text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          <Flame size={16} />
          <span className="font-medium">5 day streak</span>
          <span className="text-orange-400 dark:text-orange-500/70">— keep it going!</span>
        </div>

        {/* Focus tasks */}
        <div className="space-y-3">
          {focusTasks.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
              <Check size={32} className="mx-auto mb-3 text-green-500" />
              <p className="font-medium">All clear!</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">No high-priority tasks left for today.</p>
            </div>
          ) : (
            focusTasks.map((task, i) => {
              const project = projects.find((p) => p.id === task.projectId);
              return (
                <div
                  key={task.id}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-soft transition-all hover:shadow-card dark:border-gray-800 dark:bg-gray-900"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                    {i + 1}
                  </span>
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 transition-colors hover:border-accent-500 hover:bg-accent-50 dark:border-gray-600 dark:hover:bg-accent-500/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={cn('inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium', PRIORITY_STYLES[task.priority].badge)}>
                        {PRIORITY_STYLES[task.priority].label}
                      </span>
                      {project && (
                        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                          {project.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 dark:text-gray-600" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
