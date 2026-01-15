# Database Migration Instructions - Start Date Feature

This guide will help you add the `start_date` column to your habits table in Supabase.

---

## 🎯 What's New

You've just added two major features:

1. **Per-Habit Start Date**: Each habit now has its own start date
2. **Year-to-Date (YTD) Column**: New statistics column that auto-adjusts each year

---

## 📋 Migration Steps

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/cuisdeehtysebwfjtnoy
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run Migration SQL

Copy and paste this SQL script into the editor:

```sql
-- Migration: Add start_date column to habits table
-- This allows tracking per-habit start dates for accurate statistics

-- Add start_date column (defaults to created_at date for existing habits)
ALTER TABLE habits
ADD COLUMN start_date DATE DEFAULT CURRENT_DATE;

-- Update existing habits to use their created_at date as start_date
UPDATE habits
SET start_date = DATE(created_at)
WHERE start_date IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN habits.start_date IS 'Date when user started tracking this habit. Used to calculate accurate statistics and show grey dash for pre-start dates.';
```

### Step 3: Execute the Query

1. Click the **Run** button (or press Ctrl/Cmd + Enter)
2. You should see: **Success. No rows returned**
3. That's it! The migration is complete.

---

## ✅ Verify Migration

To verify the migration worked, run this query:

```sql
SELECT id, name, start_date, created_at
FROM habits
ORDER BY created_at DESC;
```

You should see:
- All existing habits have `start_date` set to their creation date
- No `NULL` values in the `start_date` column

---

## 🎉 What Changed in Your App

### 1. When Adding a New Habit

- You'll see a **Start Date** picker in the dialog
- Defaults to today's date
- You can choose any past date

### 2. On Habit Cards (Today Tab)

- Each habit now shows **"Since [date]"** under the name
- New **pencil icon (✏️)** to edit habit details
- Edit dialog allows changing: name, icon, color, and start date

### 3. In Stats Overview Table

- New **"Year (YTD)"** column between Monthly % and Longest Streak
- Shows completion percentage from start of current year (or habit start date, whichever is later)
- Auto-resets every January 1st
- **Grey dash (—)** for dates before habit start date
- Color-coded: green ≥80%, amber 50-79%, red <50%

### 4. In Calendar Heatmaps (Detailed Activity)

- Dates before start date show as **grey squares**
- Legend updated with "Before start date" indicator
- Statistics only count days after start date

---

## 🔧 How Statistics Changed

### Before Migration:
- Monthly %: Counted ALL days in month (even days before you started)
- Result: Lower percentages, inaccurate stats

### After Migration:
- Monthly %: Only counts days from start date onwards
- YTD %: Counts from start of year OR start date (whichever is later)
- Result: Accurate percentages that reflect your actual tracking period

---

## 📊 Example Scenarios

### Scenario 1: Habit Started Mid-Month
```
Habit: Meditation
Start Date: January 15, 2026
Today: January 20, 2026

Before: Monthly % = 5/20 = 25% ❌ (incorrect, includes Jan 1-14)
After:  Monthly % = 5/6 = 83% ✅ (correct, only counts Jan 15-20)
```

### Scenario 2: YTD Auto-Adjustment
```
Habit: Workout
Start Date: November 1, 2025

In 2025:
- YTD counts from Nov 1, 2025 to Dec 31, 2025
- YTD % = completed_days / 61 days

In 2026 (automatically):
- YTD counts from Jan 1, 2026 to today
- YTD % = completed_days / days_since_jan_1
- Resets every year!
```

### Scenario 3: Editing Start Date
```
You realize you started meditation on Jan 1, not Jan 10
1. Click pencil icon (✏️) on habit card
2. Change start date from Jan 10 → Jan 1
3. Warning appears: "This will recalculate all statistics"
4. Click "Save Changes"
5. All stats update immediately with new date range
```

---

## 🎨 Visual Indicators

### Stats Overview Table:
- ✓ Green circle = Completed
- ✗ Red circle = Missed
- — Grey dash = Before start date (NEW!)

### Calendar Heatmaps:
- 🟢 Green square = Completed
- 🔴 Red square = Missed
- ⬜ Grey square = Before start date (NEW!)
- 🔲 Light grey square = Future date

---

## 🚀 Next Steps

1. **Run the migration SQL** (Step 1-3 above)
2. **Test locally**:
   ```bash
   cd /Users/raghav/habit-tracker
   npm run dev
   ```
3. **Try adding a new habit** - verify start date picker appears
4. **Click edit icon** on existing habits - verify you can edit them
5. **Check stats tab** - verify YTD column appears
6. **Deploy to Vercel**:
   ```bash
   git add .
   git commit -m "Add per-habit start date and YTD features

   Features:
   - Per-habit start date tracking
   - Edit habit dialog with start date picker
   - Year-to-Date (YTD) statistics column
   - Grey dash indicator for pre-start dates
   - Accurate percentage calculations
   - 'Since [date]' display on habit cards

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   git push
   ```

---

## ⚠️ Important Notes

### For Existing Habits:
- **Start date automatically set to creation date**
- No data loss
- Statistics will be recalculated correctly
- You can edit start date if it's incorrect

### For New Habits:
- Start date defaults to today
- You can choose any past date
- Cannot choose future dates

### When Editing Start Date:
- **All statistics recalculate immediately**
- Streaks may change
- Monthly and YTD percentages will update
- Grey dashes will appear for dates before new start date

---

## 🐛 Troubleshooting

### Migration Fails
- **Error: column already exists**
  - Migration already ran, no action needed
  - Verify with: `SELECT start_date FROM habits LIMIT 1;`

### Start Date Picker Not Showing
- Clear browser cache and refresh
- Check browser console for errors
- Verify migration ran successfully

### Stats Not Updating
- Refresh the page
- Switch between Today/Stats tabs
- Check that start_date is set in database

### YTD Column Not Visible
- Scroll horizontally on the stats table
- Table is responsive, may need to scroll on mobile

---

## 📱 Mobile Considerations

- Edit icon may be smaller on mobile
- Stats table scrolls horizontally
- Calendar heatmaps adapt to screen size
- All features work on mobile browsers

---

## 🎯 Testing Checklist

Before deploying, verify:

- ✅ Migration ran successfully (no errors)
- ✅ Can add new habit with start date picker
- ✅ Edit icon appears on all habit cards
- ✅ Can edit existing habits
- ✅ "Since [date]" shows under habit names
- ✅ YTD column appears in stats table
- ✅ Grey dashes show for pre-start dates
- ✅ Calendar heatmaps show grey squares for pre-start dates
- ✅ All percentages calculate correctly
- ✅ Warning appears when changing start date

---

## 📊 Feature Summary

| Feature | Location | Description |
|---------|----------|-------------|
| **Start Date Picker** | Add Habit Dialog | Choose when you started tracking |
| **Edit Icon (✏️)** | Habit Cards | Edit name, icon, color, start date |
| **"Since [date]"** | Habit Cards | Shows tracking start date |
| **YTD Column** | Stats Table | Year-to-date completion % |
| **Grey Dash (—)** | Stats Table | Dates before start date |
| **Grey Squares** | Calendar Heatmap | Days before start date |
| **Warning Dialog** | Edit Habit | Alert when changing start date |

---

## 🎊 Success!

Once you've run the migration and tested:

1. All existing habits have accurate start dates
2. New habits can specify start date
3. Statistics are now accurate and fair
4. YTD tracking works automatically
5. Visual indicators make it clear when tracking started

**Your habit tracker is now even more powerful!** 🚀

---

**Need Help?** Check the browser console for errors or verify the migration in Supabase SQL Editor.

**Migration Status:** Ready to run
**Estimated Time:** 2-3 minutes
**Risk Level:** Low (no data loss)
