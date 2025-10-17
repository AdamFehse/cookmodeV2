-- CookMode V2 Database Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql

-- Enable real-time for all tables
-- (You'll also need to enable this in Supabase Dashboard -> Database -> Replication)

-- ============================================
-- TABLE 1: Ingredient Checks
-- Tracks which ingredients have been gathered/checked
-- ============================================
CREATE TABLE IF NOT EXISTS ingredient_checks (
  id BIGSERIAL PRIMARY KEY,
  recipe_slug TEXT NOT NULL,
  ingredient_index INTEGER NOT NULL,
  component_name TEXT,
  ingredient_text TEXT,
  is_checked BOOLEAN DEFAULT false,
  checked_by TEXT,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one row per recipe + ingredient combination
  UNIQUE(recipe_slug, ingredient_index, component_name)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_ingredient_checks_recipe ON ingredient_checks(recipe_slug);
CREATE INDEX IF NOT EXISTS idx_ingredient_checks_checked ON ingredient_checks(is_checked);

-- Enable Row Level Security (RLS)
ALTER TABLE ingredient_checks ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read and write (since all cooks share access)
CREATE POLICY "Allow all access to ingredient_checks"
  ON ingredient_checks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- TABLE 2: Step Completions
-- Tracks which cooking steps have been completed
-- ============================================
CREATE TABLE IF NOT EXISTS step_completions (
  id BIGSERIAL PRIMARY KEY,
  recipe_slug TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  step_text TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_by TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one row per recipe + step combination
  UNIQUE(recipe_slug, step_index)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_step_completions_recipe ON step_completions(recipe_slug);
CREATE INDEX IF NOT EXISTS idx_step_completions_completed ON step_completions(is_completed);

-- Enable Row Level Security (RLS)
ALTER TABLE step_completions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read and write
CREATE POLICY "Allow all access to step_completions"
  ON step_completions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- TABLE 3: Recipe Status
-- Tracks overall recipe status (gathered, complete, plated, packed)
-- ============================================
CREATE TABLE IF NOT EXISTS recipe_status (
  id BIGSERIAL PRIMARY KEY,
  recipe_slug TEXT NOT NULL UNIQUE,
  status TEXT CHECK (status IN ('gathered', 'complete', 'plated', 'packed')),
  updated_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_recipe_status_slug ON recipe_status(recipe_slug);
CREATE INDEX IF NOT EXISTS idx_recipe_status_status ON recipe_status(status);

-- Enable Row Level Security (RLS)
ALTER TABLE recipe_status ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read and write
CREATE POLICY "Allow all access to recipe_status"
  ON recipe_status
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- TABLE 4: Order Counts (Multiplier per recipe)
-- Tracks how many orders of each recipe are being made
-- ============================================
CREATE TABLE IF NOT EXISTS order_counts (
  id BIGSERIAL PRIMARY KEY,
  recipe_slug TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 1 CHECK (count >= 1 AND count <= 50),
  updated_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_order_counts_slug ON order_counts(recipe_slug);

-- Enable Row Level Security (RLS)
ALTER TABLE order_counts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read and write
CREATE POLICY "Allow all access to order_counts"
  ON order_counts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- TABLE 5: Recipe Chef Names
-- Tracks which chef is assigned to each recipe
-- ============================================
CREATE TABLE IF NOT EXISTS recipe_chef_names (
  id BIGSERIAL PRIMARY KEY,
  recipe_slug TEXT NOT NULL UNIQUE,
  chef_name TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_recipe_chef_names_slug ON recipe_chef_names(recipe_slug);

-- Enable Row Level Security (RLS)
ALTER TABLE recipe_chef_names ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read and write
CREATE POLICY "Allow all access to recipe_chef_names"
  ON recipe_chef_names
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger to auto-update updated_at on recipe_chef_names changes
CREATE TRIGGER update_recipe_chef_names_updated_at
  BEFORE UPDATE ON recipe_chef_names
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- OPTIONAL: Production Days (Future Enhancement)
-- Tracks which recipes are scheduled for which days
-- ============================================
CREATE TABLE IF NOT EXISTS production_days (
  id BIGSERIAL PRIMARY KEY,
  production_date DATE NOT NULL,
  recipe_slug TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  assigned_cook TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(production_date, recipe_slug)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_production_days_date ON production_days(production_date);
CREATE INDEX IF NOT EXISTS idx_production_days_recipe ON production_days(recipe_slug);

-- Enable Row Level Security (RLS)
ALTER TABLE production_days ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read and write
CREATE POLICY "Allow all access to production_days"
  ON production_days
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on recipe_status changes
CREATE TRIGGER update_recipe_status_updated_at
  BEFORE UPDATE ON recipe_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at on order_counts changes
CREATE TRIGGER update_order_counts_updated_at
  BEFORE UPDATE ON order_counts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENABLE REALTIME (Important!)
-- After running this script, go to:
-- Database -> Replication -> Enable realtime for these tables:
-- ✓ ingredient_checks
-- ✓ step_completions
-- ✓ recipe_status
-- ✓ order_counts
-- ✓ recipe_chef_names
-- ============================================

-- Success message
SELECT 'Database schema created successfully! Now enable realtime replication in Dashboard.' AS message;
