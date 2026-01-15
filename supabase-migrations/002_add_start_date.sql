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
