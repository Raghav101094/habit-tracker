# Setup Checklist ✓

Use this checklist to track your progress in setting up the Habit Tracker.

---

## ✅ Phase 1: Initial Setup (COMPLETED)

- [x] Next.js installed
- [x] TypeScript configured
- [x] Tailwind CSS set up
- [x] All dependencies installed
- [x] Project structure created
- [x] Documentation created

**Status:** ✅ DONE BY CLAUDE

---

## 🎯 Phase 2: Your Action Items (TODO)

### A. Supabase Account Setup

- [ ] Go to https://supabase.com/
- [ ] Sign up for an account (use GitHub login recommended)
- [ ] Create a new project named "habit-tracker"
- [ ] Choose a strong database password (save it somewhere safe!)
- [ ] Select your region (closest to you)
- [ ] Wait 2-3 minutes for project creation

**Time Estimate:** 5-10 minutes

---

### B. Get Supabase Credentials

- [ ] Open Supabase project dashboard
- [ ] Click Settings (gear icon) → API
- [ ] Copy "Project URL" (looks like: https://xxxxx.supabase.co)
- [ ] Copy "anon public" key (long string under Project API keys)

**Time Estimate:** 2 minutes

---

### C. Update Environment Variables

- [ ] Open file: `/Users/raghav/habit-tracker/.env.local`
- [ ] Replace `your_supabase_project_url_here` with your actual Project URL
- [ ] Replace `your_supabase_anon_key_here` with your actual anon key
- [ ] Save the file

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Time Estimate:** 1 minute

---

### D. Set Up Database

- [ ] Go to Supabase dashboard
- [ ] Click "SQL Editor" in sidebar
- [ ] Click "New Query"
- [ ] Copy the SQL script from QUICK_START.md (the long SQL code)
- [ ] Paste it into the SQL editor
- [ ] Click "Run" button
- [ ] Verify you see "Success. No rows returned"

**Time Estimate:** 3 minutes

---

### E. Test the Application

- [ ] Open terminal
- [ ] Run: `cd /Users/raghav/habit-tracker`
- [ ] Run: `npm run dev`
- [ ] Open browser to: http://localhost:3000
- [ ] Verify you see the landing page with "Habit Tracker" title
- [ ] Verify no console errors (press F12 → Console tab)

**Time Estimate:** 2 minutes

---

## 🎉 Phase 3: Ready to Build (NEXT)

Once all the above checkboxes are checked:

- [ ] Notify Claude that setup is complete
- [ ] Request to start building features

**Features we'll build:**
1. Authentication (Login/Signup)
2. Dashboard layout
3. Habit creation form
4. Daily tracking interface
5. Streak calculation
6. Statistics display
7. Calendar heatmap
8. Mobile responsive design

---

## 📋 Quick Reference

### Important Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Install new package
npm install package-name
```

### Important Files

- **Environment Variables:** `/Users/raghav/habit-tracker/.env.local`
- **Landing Page:** `/Users/raghav/habit-tracker/app/page.tsx`
- **Supabase Client:** `/Users/raghav/habit-tracker/lib/supabase.ts`
- **Global Styles:** `/Users/raghav/habit-tracker/app/globals.css`

### Important Links

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/

---

## ⚠️ Common Issues

### Issue: npm run dev doesn't work
**Solutions:**
- Make sure you're in the right directory: `cd /Users/raghav/habit-tracker`
- Try: `rm -rf node_modules package-lock.json && npm install`

### Issue: Port 3000 already in use
**Solutions:**
- Stop other apps using port 3000
- OR use different port: `npm run dev -- -p 3001`

### Issue: Supabase connection error
**Solutions:**
- Check `.env.local` has correct values
- Restart dev server (Ctrl+C then npm run dev)
- Verify no extra spaces in environment variables

### Issue: TypeScript errors
**Solutions:**
- Run: `npm run build` to see all errors
- Check that all imports are correct
- Restart VS Code if using it

---

## 📞 Need Help?

If stuck:
1. Check QUICK_START.md for detailed instructions
2. Check SETUP_GUIDE.md for troubleshooting
3. Ask Claude for help!

---

## 🎯 Current Status

**Project:** Habit Tracker
**Location:** `/Users/raghav/habit-tracker`
**Phase:** ⏳ Waiting for Supabase setup
**Next Step:** Complete Phase 2 checklist above

---

**Last Updated:** January 13, 2026
