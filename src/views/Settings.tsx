import { useState } from 'react';
import { Sun, Moon, Bell, User, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/helpers';

type ThemePref = 'light' | 'dark' | 'system';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('Alex Kim');
  const [email, setEmail] = useState('alex@momentum.app');
  const [bio, setBio] = useState('Product designer & front-end developer. Coffee enthusiast.');
  const [notifications, setNotifications] = useState({
    dueReminders: true,
    weeklyDigest: true,
    projectUpdates: false,
    productNews: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {/* Profile */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-2">
          <User size={18} className="text-gray-400" />
          <h3 className="font-semibold">Profile</h3>
        </div>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xl font-semibold text-white">
            AK
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{email}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-accent-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-accent-500/20"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-400">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-accent-500/20"
          />
        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-2">
          <Monitor size={18} className="text-gray-400" />
          <h3 className="font-semibold">Appearance</h3>
        </div>
        <p className="mb-4 text-sm text-gray-400 dark:text-gray-500">Choose how Momentum looks to you.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {([
            { id: 'light', label: 'Light', Icon: Sun },
            { id: 'dark', label: 'Dark', Icon: Moon },
          ] as const).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                theme === id
                  ? 'border-accent-500 bg-accent-50 dark:bg-accent-500/10'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              )}
            >
              <Icon size={22} className={cn(theme === id ? 'text-accent-600 dark:text-accent-400' : 'text-gray-400')} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5 flex items-center gap-2">
          <Bell size={18} className="text-gray-400" />
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="space-y-1">
          {([
            { key: 'dueReminders', label: 'Due date reminders', desc: 'Get notified before tasks are due' },
            { key: 'weeklyDigest', label: 'Weekly digest', desc: 'A summary of your week every Monday' },
            { key: 'projectUpdates', label: 'Project updates', desc: 'When tasks in your projects change' },
            { key: 'productNews', label: 'Product news', desc: 'New features and improvements' },
          ] as const).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{desc}</p>
              </div>
              <button
                onClick={() => toggleNotif(key)}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  notifications[key] ? 'bg-accent-500' : 'bg-gray-200 dark:bg-gray-700'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                    notifications[key] ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-sm text-green-600 dark:text-green-400">Settings saved!</span>}
        <button
          onClick={handleSave}
          className="rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-600 active:scale-95"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
