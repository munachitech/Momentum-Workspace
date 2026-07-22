import type { Task, Project, ActivityItem } from '@/types';

const today = new Date();
const iso = (offsetDays: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};
const isoFull = (offsetDays: number, hours = 9): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
};

export const projects: Project[] = [
  { id: 'p1', name: 'Website Redesign', color: '#3b82f6', description: 'Q3 overhaul of the marketing site' },
  { id: 'p2', name: 'Mobile App', color: '#10b981', description: 'iOS and Android client' },
  { id: 'p3', name: 'Content Pipeline', color: '#f59e0b', description: 'Blog and newsletter production' },
  { id: 'p4', name: 'Client Onboarding', color: '#ef4444', description: 'Streamlining new client setup' },
  { id: 'p5', name: 'Personal', color: '#8b5cf6', description: 'Errands and life admin' },
];

export const tasks: Task[] = [
  { id: 't1', title: 'Design hero section mockups', description: 'Three variants for the new landing page', status: 'in-progress', priority: 'high', dueDate: iso(0), projectId: 'p1', createdAt: isoFull(-3) },
  { id: 't2', title: 'Write API integration spec', description: 'Document the REST endpoints for mobile', status: 'todo', priority: 'urgent', dueDate: iso(0), projectId: 'p2', createdAt: isoFull(-2) },
  { id: 't3', title: 'Review pull request #142', status: 'review', priority: 'medium', dueDate: iso(0), projectId: 'p2', createdAt: isoFull(-1) },
  { id: 't4', title: 'Publish newsletter draft', description: 'Finalize the July issue', status: 'todo', priority: 'high', dueDate: iso(0), projectId: 'p3', createdAt: isoFull(-4) },
  { id: 't5', title: 'Fix navigation overlap on mobile', status: 'todo', priority: 'urgent', dueDate: iso(-1), projectId: 'p1', createdAt: isoFull(-5) },
  { id: 't6', title: 'Onboarding checklist template', status: 'done', priority: 'medium', dueDate: iso(-2), projectId: 'p4', createdAt: isoFull(-7), completedAt: isoFull(-2) },
  { id: 't7', title: 'Set up analytics dashboard', description: 'Connect Plausible and GA4', status: 'in-progress', priority: 'high', dueDate: iso(1), projectId: 'p1', createdAt: isoFull(-3) },
  { id: 't8', title: 'Record podcast intro', status: 'todo', priority: 'low', dueDate: iso(2), projectId: 'p3', createdAt: isoFull(-1) },
  { id: 't9', title: 'Client kickoff call prep', status: 'in-progress', priority: 'high', dueDate: iso(1), projectId: 'p4', createdAt: isoFull(-2) },
  { id: 't10', title: 'Refactor auth middleware', status: 'review', priority: 'medium', dueDate: iso(2), projectId: 'p2', createdAt: isoFull(-4) },
  { id: 't11', title: 'Renew domain subscription', status: 'todo', priority: 'medium', dueDate: iso(3), projectId: 'p5', createdAt: isoFull(0) },
  { id: 't12', title: 'Draft Q3 content calendar', status: 'done', priority: 'high', dueDate: iso(-1), projectId: 'p3', createdAt: isoFull(-6), completedAt: isoFull(-1) },
  { id: 't13', title: 'Design system component audit', status: 'todo', priority: 'low', dueDate: iso(4), projectId: 'p1', createdAt: isoFull(-1) },
  { id: 't14', title: 'Push notification setup', description: 'FCM integration for Android', status: 'in-progress', priority: 'medium', dueDate: iso(3), projectId: 'p2', createdAt: isoFull(-2) },
  { id: 't15', title: 'Update privacy policy', status: 'done', priority: 'low', dueDate: iso(-3), projectId: 'p4', createdAt: isoFull(-8), completedAt: isoFull(-3) },
  { id: 't16', title: 'Schedule dentist appointment', status: 'todo', priority: 'low', dueDate: iso(5), projectId: 'p5', createdAt: isoFull(0) },
  { id: 't17', title: 'Migrate images to CDN', status: 'review', priority: 'medium', dueDate: iso(1), projectId: 'p1', createdAt: isoFull(-3) },
  { id: 't18', title: 'Write onboarding email sequence', status: 'todo', priority: 'high', dueDate: iso(2), projectId: 'p4', createdAt: isoFull(-1) },
  { id: 't19', title: 'Bug triage — login redirect', status: 'done', priority: 'urgent', dueDate: iso(-2), projectId: 'p2', createdAt: isoFull(-5), completedAt: isoFull(-2) },
  { id: 't20', title: 'Quarterly goals review', status: 'todo', priority: 'medium', dueDate: iso(6), projectId: 'p5', createdAt: isoFull(0) },
];

export const activity: ActivityItem[] = [
  { id: 'a1', type: 'completed', taskId: 't19', taskTitle: 'Bug triage — login redirect', timestamp: isoFull(0, 11) },
  { id: 'a2', type: 'completed', taskId: 't12', taskTitle: 'Draft Q3 content calendar', timestamp: isoFull(0, 10) },
  { id: 'a3', type: 'created', taskId: 't20', taskTitle: 'Quarterly goals review', timestamp: isoFull(0, 9) },
  { id: 'a4', type: 'moved', taskId: 't3', taskTitle: 'Review pull request #142', timestamp: isoFull(0, 8) },
  { id: 'a5', type: 'completed', taskId: 't15', taskTitle: 'Update privacy policy', timestamp: isoFull(-1, 16) },
  { id: 'a6', type: 'created', taskId: 't16', taskTitle: 'Schedule dentist appointment', timestamp: isoFull(-1, 14) },
  { id: 'a7', type: 'updated', taskId: 't7', taskTitle: 'Set up analytics dashboard', timestamp: isoFull(-1, 13) },
  { id: 'a8', type: 'completed', taskId: 't6', taskTitle: 'Onboarding checklist template', timestamp: isoFull(-2, 15) },
];
