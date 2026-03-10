-- ============================================================
-- Migration 003: Add count and duration tracking to habits
-- ============================================================

-- Step 1: Add feature-flag columns to habits table
ALTER TABLE habits
  ADD COLUMN count_enabled    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN count_max        SMALLINT,
  ADD COLUMN duration_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-- count_max must be between 1 and 5 when set
ALTER TABLE habits
  ADD CONSTRAINT habits_count_max_range
    CHECK (count_max IS NULL OR (count_max >= 1 AND count_max <= 5));

-- Step 2: Add tracking columns to habit_logs table
ALTER TABLE habit_logs
  ADD COLUMN count    SMALLINT,
  ADD COLUMN duration INTEGER;

-- duration must be non-negative when set
ALTER TABLE habit_logs
  ADD CONSTRAINT habit_logs_duration_non_negative
    CHECK (duration IS NULL OR duration >= 0);

-- count must be between 1 and 5 when set
ALTER TABLE habit_logs
  ADD CONSTRAINT habit_logs_count_range
    CHECK (count IS NULL OR (count >= 1 AND count <= 5));
