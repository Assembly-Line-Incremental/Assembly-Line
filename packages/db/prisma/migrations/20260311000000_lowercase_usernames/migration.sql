-- Enforce case-insensitive uniqueness by normalising all usernames to lowercase.
--
-- Step 1: Abort if any two users share the same lowercase name (manual dedup required).
DO $$
BEGIN
  IF EXISTS (
    SELECT LOWER(name) FROM "user" GROUP BY LOWER(name) HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Duplicate usernames detected after case normalisation. '
      'Resolve duplicates manually before applying this migration.';
  END IF;
END $$;

-- Step 2: Lowercase every name that is not already lowercase.
UPDATE "user" SET name = LOWER(name) WHERE name <> LOWER(name);
