# Habit Tracker - Setup Guide & Documentation

## 📋 Project Overview

A personal habit tracking application with streaks, analytics, and beautiful visualizations.

**Live Demo:** (Will be available after deployment)
**Repository:** (Add your GitHub repo URL here)

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14.2** (with App Router)
  - React-based framework
  - Server & Client Components
  - Built-in API routes
  - File-based routing
  - Official Site: https://nextjs.org/

### Language
- **TypeScript 5**
  - Type safety
  - Better IDE support
  - Catch errors at compile time

### Styling
- **Tailwind CSS 3**
  - Utility-first CSS framework
  - Official Site: https://tailwindcss.com/

- **shadcn/ui**
  - Beautiful, accessible React components
  - Built on Radix UI primitives
  - Customizable with Tailwind
  - Official Site: https://ui.shadcn.com/

### Database & Backend
- **Supabase**
  - PostgreSQL database (hosted)
  - Built-in authentication
  - Row Level Security (RLS)
  - Real-time subscriptions
  - RESTful API auto-generated
  - Official Site: https://supabase.com/

### Deployment & Hosting
- **Vercel**
  - Next.js hosting (optimized)
  - Automatic deployments from Git
  - Free HTTPS & CDN
  - Serverless functions
  - Official Site: https://vercel.com/

---

## 📦 Dependencies

### Core Dependencies
```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "@supabase/supabase-js": "^2.39.0",
  "@supabase/auth-helpers-nextjs": "^0.10.0"
}
```

### UI Dependencies
```json
{
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-popover": "^1.0.7",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-tabs": "^1.0.4",
  "lucide-react": "^0.344.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.3.0",
  "@types/node": "^20.11.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0",
  "eslint": "^8.56.0",
  "eslint-config-next": "^14.2.0"
}
```

---

## 🚀 Prerequisites - Action Items for You

### 1. Node.js Installation
**You need to install Node.js if not already installed.**

- **Version Required:** Node.js 18.17 or higher
- **Download:** https://nodejs.org/ (download LTS version)
- **Verify installation:**
  ```bash
  node --version  # Should show v18.17 or higher
  npm --version   # Should show 9.0 or higher
  ```

### 2. Git Installation (Optional but recommended)
- **Download:** https://git-scm.com/downloads
- **Verify:** `git --version`

### 3. Code Editor
- **Recommended:** VS Code (https://code.visualstudio.com/)
- **Extensions to install:**
  - ESLint
  - Tailwind CSS IntelliSense
  - Prettier

---

## 🔑 Required Signups - Action Items for You

### 1. Supabase Account (Required)

**Steps:**
1. Go to https://supabase.com/
2. Click "Start your project" or "Sign Up"
3. Sign up with GitHub (recommended) or email
4. Create a new project:
   - **Project name:** `habit-tracker` (or any name you like)
   - **Database password:** Choose a strong password (save it!)
   - **Region:** Choose closest to you
   - Click "Create new project" (takes ~2 minutes)

**After project is created, get your credentials:**
1. Go to Project Settings (gear icon in sidebar)
2. Click "API" section
3. **Copy these values (you'll need them):**
   - `Project URL` (looks like: `https://xxxxx.supabase.co`)
   - `anon public` key (under "Project API keys")

**Database Setup:**
1. Go to SQL Editor in Supabase dashboard
2. I'll provide you the SQL script to run later

---

### 2. Vercel Account (Required for deployment)

**Steps:**
1. Go to https://vercel.com/
2. Click "Sign Up"
3. Sign up with GitHub (highly recommended)
4. No project setup needed yet - we'll deploy later

**Why GitHub signup is recommended:**
- Automatic deployments when you push code
- Easy project imports
- Better integration

---

### 3. GitHub Account (Optional but recommended)

**Steps:**
1. Go to https://github.com/
2. Sign up if you don't have an account
3. Create a new repository for this project (we'll do this later)

---

## 📁 Project Structure

```
habit-tracker/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Protected routes
│   │   ├── dashboard/
│   │   ├── habits/
│   │   └── stats/
│   ├── api/                      # API routes
│   │   ├── habits/
│   │   └── logs/
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── habits/
│   │   ├── HabitCard.tsx
│   │   ├── HabitForm.tsx
│   │   └── HabitList.tsx
│   ├── stats/
│   │   ├── StreakDisplay.tsx
│   │   ├── MonthlyStats.tsx
│   │   └── CalendarHeatmap.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Navigation.tsx
├── lib/                          # Utility functions
│   ├── supabase/
│   │   ├── client.ts            # Supabase client
│   │   └── server.ts            # Supabase server client
│   ├── utils.ts                 # Helper functions
│   └── calculations.ts          # Streak & stats logic
├── types/                        # TypeScript types
│   └── database.ts              # Database types
├── public/                       # Static assets
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Template for env vars
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
├── SETUP_GUIDE.md              # This file
└── README.md                    # Project documentation
```

---

## 🔧 Installation Steps (I'll handle this)

I will run these commands for you:

```bash
# 1. Create Next.js app with TypeScript
npx create-next-app@latest habit-tracker

# 2. Navigate to project
cd habit-tracker

# 3. Install Tailwind CSS (if not included)
npm install -D tailwindcss postcss autoprefixer

# 4. Install shadcn/ui
npx shadcn-ui@latest init

# 5. Install Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 6. Install additional UI components (as needed)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs

# 7. Install icon library
npm install lucide-react

# 8. Install date utilities
npm install date-fns
```

---

## 🔐 Environment Variables Setup

After Supabase account is created, you'll need to add these to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**I'll create an `.env.example` file as a template.**

---

## 🗄️ Database Schema (SQL)

Once you have your Supabase project, run this SQL in the SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handled by Supabase Auth)
-- No need to create this, Supabase provides auth.users

-- Habits table
CREATE TABLE habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '✓',
  color TEXT DEFAULT '#3b82f6',
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habit logs table
CREATE TABLE habit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(habit_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX idx_habit_logs_date ON habit_logs(date);

-- Row Level Security (RLS) Policies
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- Habits policies
CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- Habit logs policies
CREATE POLICY "Users can view their own habit logs"
  ON habit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habit logs"
  ON habit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit logs"
  ON habit_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit logs"
  ON habit_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();
```

---

## 🚢 Deployment Process (Later)

### Deploy to Vercel

1. Push code to GitHub repository
2. Go to Vercel dashboard
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Add environment variables (from .env.local)
6. Click "Deploy"
7. Get your live URL: `https://your-app.vercel.app`

### Environment Variables on Vercel
Add these in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 💡 Development Workflow

### Starting Development Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## 📚 Key Concepts & Learning Resources

### Next.js App Router
- File-based routing
- Server Components (default)
- Client Components (use 'use client')
- Learn: https://nextjs.org/docs

### Supabase Auth
- Email/password authentication
- Magic links
- Social auth (Google, GitHub, etc.)
- Learn: https://supabase.com/docs/guides/auth

### Row Level Security (RLS)
- Database-level security
- Users can only access their own data
- Policies define access rules
- Learn: https://supabase.com/docs/guides/auth/row-level-security

### Tailwind CSS
- Utility classes: `flex`, `bg-blue-500`, `p-4`, etc.
- Responsive: `md:flex`, `lg:grid`, etc.
- Learn: https://tailwindcss.com/docs

---

## 🤝 Sharing with Friends

### Option 1: Public Deployment (Recommended)
1. Deploy to Vercel (free)
2. Share URL: `https://your-habit-tracker.vercel.app`
3. Friends sign up with their email
4. Each user has isolated data (via RLS)

### Option 2: GitHub Repository
1. Push code to GitHub (public repo)
2. Friends can clone and run locally
3. They need their own Supabase project

### Option 3: Private Sharing
1. Add friends as team members in Vercel (paid plans)
2. Share staging/preview URLs

---

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Weekly/Monthly goals
- [ ] Habit categories/tags
- [ ] Custom habit schedules (not daily)
- [ ] Data export (CSV/JSON)
- [ ] Dark mode persistence
- [ ] Habit templates

### Phase 3 Features
- [ ] Social features (share streaks)
- [ ] Habit reminders (email/push)
- [ ] Mobile app (React Native)
- [ ] AI insights & suggestions
- [ ] Habit accountability partners
- [ ] Gamification (badges, levels)

### Technical Improvements
- [ ] Add comprehensive testing (Jest, Playwright)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Error tracking (Sentry)
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Database backups

---

## 🐛 Troubleshooting

### Common Issues

**1. Supabase Connection Errors**
- Check `.env.local` file has correct values
- Ensure environment variables start with `NEXT_PUBLIC_`
- Restart dev server after changing env vars

**2. Build Errors**
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors: `npm run build`
- Clear Next.js cache: `rm -rf .next`

**3. Authentication Issues**
- Check Supabase Auth settings (Email confirmations, etc.)
- Verify RLS policies are enabled
- Check browser console for errors

**4. Deployment Issues**
- Ensure environment variables are set in Vercel
- Check build logs for errors
- Verify Node.js version compatibility

---

## 📞 Support & Resources

### Official Documentation
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/

### Community
- Next.js Discord: https://nextjs.org/discord
- Supabase Discord: https://discord.supabase.com/
- Stack Overflow tags: `nextjs`, `supabase`, `tailwindcss`

---

## 📝 Notes

- All costs are FREE for this project (within free tier limits)
- Supabase free tier: 500MB database, 50,000 monthly active users
- Vercel free tier: Unlimited personal projects, 100GB bandwidth
- Scale up when needed (paid plans available)

---

**Last Updated:** January 13, 2026
**Version:** 1.0.0
**Maintainer:** Raghav
