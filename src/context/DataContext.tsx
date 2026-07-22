import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Task, Project, ActivityItem, Status, Priority } from '@/types';
import { projects as initialProjects, tasks as initialTasks, activity as initialActivity } from '@/data/mockData';

interface DataContextValue {
  tasks: Task[];
  projects: Project[];
  activity: ActivityItem[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  addTask: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;
  toggleComplete: (id: string) => void;
  addProject: (data: Omit<Project, 'id'>) => void;
  deleteProject: (id: string) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const uid = () => Math.random().toString(36).slice(2, 11);

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const logActivity = useCallback((type: ActivityItem['type'], task: Task) => {
    setActivity((prev) => [
      { id: uid(), type, taskId: task.id, taskTitle: task.title, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const addTask = useCallback((data: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = { ...data, id: uid(), createdAt: new Date().toISOString() };
    setTasks((prev) => [task, ...prev]);
    logActivity('created', task);
  }, [logActivity]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    setActivity((prev) => {
      const t = tasks.find((x) => x.id === id);
      if (!t) return prev;
      return [
        { id: uid(), type: 'updated', taskId: id, taskTitle: t.title, timestamp: new Date().toISOString() },
        ...prev,
      ];
    });
  }, [tasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, status: Status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    const t = tasks.find((x) => x.id === id);
    if (t) logActivity('moved', { ...t, status });
  }, [tasks, logActivity]);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const done = t.status === 'done';
        const newStatus: Status = done ? 'todo' : 'done';
        const updated = { ...t, status: newStatus, completedAt: done ? undefined : new Date().toISOString() };
        return updated;
      })
    );
    const t = tasks.find((x) => x.id === id);
    if (t) {
      const willComplete = t.status !== 'done';
      logActivity(willComplete ? 'completed' : 'updated', t);
    }
  }, [tasks, logActivity]);

  const addProject = useCallback((data: Omit<Project, 'id'>) => {
    setProjects((prev) => [...prev, { ...data, id: uid() }]);
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    setSelectedProjectId((curr) => (curr === id ? null : curr));
  }, []);

  return (
    <DataContext.Provider
      value={{
        tasks,
        projects,
        activity,
        selectedProjectId,
        setSelectedProjectId,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        toggleComplete,
        addProject,
        deleteProject,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
