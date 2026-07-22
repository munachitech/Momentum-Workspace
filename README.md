# Momentum

A premium productivity and task management application for individuals, freelancers, students, and small teams. Built with a focus on clean design, smooth interactions, and a distraction-free workflow.

## Features

### Dashboard
- Tasks due today with one-click completion
- Overdue task tracking
- Weekly progress visualization with bar charts
- Productivity statistics (completion rate, weekly stats)
- Recent activity feed
- Quick-add task bar

### Task Management
Two synchronized views:
- **Kanban Board** — To Do, In Progress, Review, Done columns with drag-and-drop
- **List View** — searchable, filterable, sortable table with inline completion

Full CRUD: create, edit, delete tasks with priority labels, due dates, and project assignment.

### Projects
- Organize tasks into color-coded projects
- Progress bars with completion percentages
- Active task counts per project
- Click a project to filter related tasks

### Focus Mode
- Distraction-free page showing today's highest-priority tasks
- Animated progress ring showing daily completion
- One-click task completion
- Streak indicator

### Settings
- Editable profile (name, email, bio)
- Notification preferences with toggle switches
- Light/Dark mode toggle with system preference detection
- Theme preference persisted to localStorage

### Design
- Modern, minimal interface inspired by Linear, Notion, and Todoist
- Inter font family with optimized typography
- Soft shadows, rounded corners, and smooth transitions
- Single accent color (blue) with a full color ramp
- Fully responsive: sidebar on desktop, bottom navigation on mobile
- Micro-interactions and hover states throughout

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — build tool and dev server
- **TypeScript** — type safety
- **Tailwind CSS 3** — utility-first styling with dark mode
- **Lucide React** — icon library

No backend, authentication, database, or external APIs. All data is realistic mock data managed in local React state.

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd momentum

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The app runs at `http://localhost:5173` in development.

## Deployment on Vercel

This project deploys to Vercel with zero configuration required.

### Option 1: Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **New Project** and import your repository.
4. Vercel auto-detects Vite — no settings changes needed.
5. Click **Deploy**.

### Option 2: Vercel CLI

```bash
# Install the Vercel CLI
npm i -g vercel

# Deploy from the project root
vercel

# Deploy to production
vercel --prod
```

### Build Settings (auto-detected)

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileNav.tsx
│   └── TaskModal.tsx
├── context/
│   ├── ThemeContext.tsx
│   └── DataContext.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── index.ts
├── utils/
│   └── helpers.ts
├── views/
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── Projects.tsx
│   ├── Focus.tsx
│   └── Settings.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## License

MIT
