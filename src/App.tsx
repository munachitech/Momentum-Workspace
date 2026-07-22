import { useState, useCallback } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { DataProvider, useData } from '@/context/DataContext';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import TaskModal from '@/components/TaskModal';
import Dashboard from '@/views/Dashboard';
import Tasks from '@/views/Tasks';
import Projects from '@/views/Projects';
import Focus from '@/views/Focus';
import Settings from '@/views/Settings';

const titles: Record<string, string> = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  projects: 'Projects',
  focus: 'Focus Mode',
  settings: 'Settings',
};

function AppContent() {
  const [view, setView] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const { addTask, projects, selectedProjectId } = useData();

  const navigate = useCallback((v: string) => setView(v), []);

  const handleQuickAdd = (data: any) => {
    addTask(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        view={view}
        onNavigate={navigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="md:pl-64">
        <Topbar
          title={titles[view] ?? 'Momentum'}
          onOpenMobile={() => setMobileOpen(true)}
          onQuickAdd={() => setQuickAddOpen(true)}
        />

        <main className="px-4 pb-24 pt-6 md:px-8 md:pb-8">
          {view === 'dashboard' && <Dashboard onNavigate={navigate} onQuickAdd={() => setQuickAddOpen(true)} />}
          {view === 'tasks' && <Tasks />}
          {view === 'projects' && <Projects onNavigate={navigate} />}
          {view === 'focus' && <Focus />}
          {view === 'settings' && <Settings />}
        </main>
      </div>

      <MobileNav view={view} onNavigate={navigate} />

      <TaskModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSave={handleQuickAdd}
        projects={projects}
        defaultProjectId={selectedProjectId ?? undefined}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}
