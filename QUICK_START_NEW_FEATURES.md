# 🚀 Quick Start - New Features

## ✅ What's New?

1. **Per-Habit Start Date** - Each habit tracks when you started
2. **Year-to-Date (YTD) Column** - See your yearly progress
3. **Edit Habits** - Change name, icon, color, and start date anytime

---

## ⚡ 3-Step Deployment

### Step 1: Run Database Migration (2 minutes)

1. Open Supabase: https://supabase.com/dashboard/project/cuisdeehtysebwfjtnoy
2. Click **SQL Editor** → **New Query**
3. Copy/paste this SQL:

```sql
ALTER TABLE habits ADD COLUMN start_date DATE DEFAULT CURRENT_DATE;
UPDATE habits SET start_date = DATE(created_at) WHERE start_date IS NULL;
```

4. Click **Run**
5. Should see: "Success. No rows returned"

### Step 2: Deploy to Vercel (3 minutes)

```bash
cd /Users/raghav/habit-tracker
git add .
git commit -m "Add per-habit start date and YTD features"
git push
```

Wait 2-3 minutes for auto-deployment.

### Step 3: Test Live Site (2 minutes)

Visit: https://habit-tracker-two-phi.vercel.app/

Test:
- ✅ Add new habit (see start date picker)
- ✅ Click edit icon (✏️) on existing habit
- ✅ Go to Stats tab (see YTD column)
- ✅ Look for grey dashes (—) for pre-start dates

---

## 🎯 What You'll See

### On Habit Cards:
```
[ ] 🧘 Meditation          ✏️ 🗑️
    Since Jan 15, 2026
    🔥 5 day streak  85% this month
```
- **"Since [date]"** shows start date
- **Pencil icon (✏️)** opens edit dialog

### In Stats Table:
```
Habit │ Last 10 Days │ Monthly │ Year(YTD) │ Streak
Med   │ — — ✓ ✓ ✓    │   85%   │    78%    │ 🔥 5
```
- **YTD column** shows yearly progress
- **Grey dash (—)** for dates before start

### In Calendar Heatmaps:
```
⬜⬜⬜🟢🟢🔴🟢
Grey = Before start
Green = Completed
Red = Missed
```

---

## 📊 Key Benefits

### Before:
```
Added habit on Jan 15
Stats on Jan 20: 5/20 = 25% ❌ (includes Jan 1-14)
```

### After:
```
Added habit on Jan 15
Stats on Jan 20: 5/6 = 83% ✅ (only counts Jan 15-20)
```

**Result:** Accurate percentages that reflect your actual tracking!

---

## 🎨 New Features Overview

| Feature | Where | What |
|---------|-------|------|
| **Start Date Picker** | Add Habit Dialog | Choose when tracking started |
| **Edit Icon (✏️)** | Every Habit Card | Edit habit details anytime |
| **"Since [date]"** | Under Habit Name | Shows start date |
| **YTD Column** | Stats Table | Year-to-date percentage |
| **Grey Dash (—)** | Stats Table | Before start date |
| **Grey Squares** | Calendar Heatmap | Pre-start dates |

---

## 💡 Quick Tips

1. **Accurate Stats**: Set correct start dates when adding habits
2. **Edit Anytime**: Click ✏️ to update habit details
3. **YTD Resets**: Automatically resets every January 1st
4. **Warning**: Changing start date recalculates all stats

---

## 🐛 Troubleshooting

### Migration error "column already exists"?
- Already ran successfully, no action needed

### Start date picker not showing?
- Clear browser cache and refresh

### YTD column not visible?
- Scroll right on stats table (horizontal scroll)

---

## 📚 Full Documentation

- **Detailed Guide:** [NEW_FEATURES_SUMMARY.md](NEW_FEATURES_SUMMARY.md)
- **Migration Steps:** [MIGRATION_INSTRUCTIONS.md](MIGRATION_INSTRUCTIONS.md)
- **Stats Guide:** [STATS_TABLE_GUIDE.md](STATS_TABLE_GUIDE.md)

---

## ✅ Deployment Checklist

- [ ] Run database migration SQL
- [ ] Verify migration success
- [ ] Commit and push changes
- [ ] Wait for Vercel deployment (2-3 min)
- [ ] Test on live site
- [ ] Add new habit with custom start date
- [ ] Edit existing habit
- [ ] Check Stats tab for YTD column
- [ ] Share updated app with friends! 🎉

---

**Total Time:** ~10 minutes
**Difficulty:** Easy
**Risk:** Low (no data loss)
**Result:** More accurate habit tracking! 🚀
