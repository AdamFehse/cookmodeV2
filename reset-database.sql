-- ============================================
-- SUPABASE DATABASE RESET SCRIPT
-- This will clear all data from your kitchen tables
-- ============================================

-- WARNING: This will permanently delete ALL data!
-- Make sure you really want to do this before running.

-- Clear all kitchen data (in order to handle foreign key constraints)
TRUNCATE TABLE ingredient_checks CASCADE;
TRUNCATE TABLE step_completions CASCADE;
TRUNCATE TABLE recipe_status CASCADE;
TRUNCATE TABLE order_counts CASCADE;
TRUNCATE TABLE recipe_chef_names CASCADE;

-- Reset auto-increment sequences (if your tables use them)
-- Uncomment these lines if your tables have auto-incrementing ID columns
-- ALTER SEQUENCE ingredient_checks_id_seq RESTART WITH 1;
-- ALTER SEQUENCE step_completions_id_seq RESTART WITH 1;
-- ALTER SEQUENCE recipe_status_id_seq RESTART WITH 1;
-- ALTER SEQUENCE order_counts_id_seq RESTART WITH 1;
-- ALTER SEQUENCE recipe_chef_names_id_seq RESTART WITH 1;

-- Optional: Add some sample data to test
-- INSERT INTO order_counts (recipe_slug, count, updated_by, updated_at) 
-- VALUES ('veggie-korma-coconut-cashew', 2, 'System', NOW());

SELECT 'Database reset complete! All kitchen data has been cleared.' as message;