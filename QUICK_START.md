# Quick Start Guide for Raghav

## What I've Done ✅

I've set up your complete Habit Tracker project with:

1. ✅ Next.js 14 with TypeScript
2. ✅ Tailwind CSS configured
3. ✅ shadcn/ui components ready
4. ✅ Supabase client library installed
5. ✅ Project structure created
6. ✅ Basic landing page
7. ✅ All configuration files

## What You Need To Do 🎯

### Step 1: Create Supabase Account (10 minutes)

1. Go to https://supabase.com/
2. Click "Start your project" or "Sign Up"
3. Sign up with GitHub (recommended) or email
4. Create a new project:
   - Project name: `habit-tracker`
   - Database password: **Choose a strong password and SAVE IT!**
   - Region: Choose closest to your location (e.g., "Southeast Asia (Singapore)" or "US East")
   - Click "Create new project"
   - **Wait 2-3 minutes** for the project to be created

### Step 2: Get Your Supabase Credentials (2 minutes)

Once your project is ready:

1. In the Supabase dashboard, click the **Settings** icon (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. You'll see two important values:

   **Copy these:**
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public key** (long string under "Project API keys" → "anon public")

### Step 3: Update Environment Variables (1 minute)

1. Open the file: `/Users/raghav/habit-tracker/.env.local`
2. Replace the placeholder values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

3. Save the file

### Step 4: Set Up Database Tables (3 minutes)

1. Go back to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire SQL script below and paste it:

<details>
<summary>Click to expand SQL script</summary>

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
\`\`\`

</details>

5. Click **Run** button (bottom right)
6. You should see "Success. No rows returned"

### Step 5: Run the App (1 minute)

1. Open your terminal
2. Navigate to the project:
   ```bash
   cd /Users/raghav/habit-tracker
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to:
   **http://localhost:3000**

5. You should see the Habit Tracker landing page! 🎉

---

## Verification Checklist ✓

Before we start coding the features, verify:

- [ ] Supabase project is created
- [ ] Environment variables are set in `.env.local`
- [ ] SQL script ran successfully (no errors)
- [ ] Development server is running (`npm run dev`)
- [ ] You can see the landing page at http://localhost:3000

---

## Next Steps

Once you've completed the steps above, let me know and I'll start building:

1. **Authentication** (Login/Signup pages)
2. **Dashboard** (Main habit tracking interface)
3. **Habit Management** (Add/Edit/Delete habits)
4. **Daily Tracking** (Check off habits for today)
5. **Streak Calculation** (Real-time streak updates)
6. **Statistics & Analytics** (Monthly completion rates)
7. **Calendar Heatmap** (Visual progress)

---

## Troubleshooting

### Issue: "Module not found" errors
**Solution:** Run `npm install` again

### Issue: Port 3000 is already in use
**Solution:** Either:
- Stop the other app using port 3000, OR
- Run: `npm run dev -- -p 3001` (uses port 3001 instead)

### Issue: Supabase connection error
**Solution:**
- Check `.env.local` has correct values
- Restart dev server: `Ctrl+C` then `npm run dev`
- Verify values don't have extra spaces or quotes

---

## Files You Should Know About

📁 **Important files:**
- `/Users/raghav/habit-tracker/.env.local` - Your Supabase credentials
- `/Users/raghav/habit-tracker/SETUP_GUIDE.md` - Complete technical documentation
- `/Users/raghav/habit-tracker/app/page.tsx` - Landing page
- `/Users/raghav/habit-tracker/lib/supabase.ts` - Supabase client configuration

---

**Ready to continue?** Complete the steps above and let me know! I'll start building the full application. 🚀
