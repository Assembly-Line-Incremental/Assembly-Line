-- CreateTable profiles (unified user + profile)
CREATE TABLE IF NOT EXISTS "profiles" (
  "id"              TEXT        NOT NULL,
  "user_id"         TEXT        NOT NULL,
  "username"        TEXT        NOT NULL,
  "display_name"    TEXT        NOT NULL,
  "email"           TEXT        NOT NULL,
  "email_verified"  BOOLEAN     NOT NULL DEFAULT false,
  "avatar_url"      TEXT,
  "image"           TEXT,
  "settings"        JSONB,
  "supporter_tier"  INTEGER     NOT NULL DEFAULT 0,
  "created_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"      TIMESTAMP(3) NOT NULL,

  CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable saves
CREATE TABLE IF NOT EXISTS "saves" (
  "id"                TEXT        NOT NULL,
  "user_id"           TEXT        NOT NULL,
  "slot_number"       INTEGER     NOT NULL,
  "name"              TEXT        NOT NULL,
  "game_state"        JSONB       NOT NULL,
  "last_calculated_at" TIMESTAMP(3) NOT NULL,
  "total_playtime"    INTEGER     NOT NULL DEFAULT 0,
  "created_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"        TIMESTAMP(3) NOT NULL,

  CONSTRAINT "saves_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "saves_slot_check" CHECK ("slot_number" >= 1 AND "slot_number" <= 5)
);

-- Unique constraints
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
CREATE UNIQUE INDEX "saves_user_id_slot_number_key" ON "saves"("user_id", "slot_number");

-- Indexes
CREATE INDEX "profiles_user_id_idx" ON "profiles"("user_id");
CREATE INDEX "saves_user_id_idx" ON "saves"("user_id");
CREATE INDEX "saves_updated_at_idx" ON "saves"("updated_at");

-- Foreign keys
ALTER TABLE "saves"
  ADD CONSTRAINT "saves_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "profiles"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "saves" ENABLE ROW LEVEL SECURITY;

-- profiles: users can only access their own row
CREATE POLICY "profiles_select_own" ON "profiles"
  FOR SELECT USING ("user_id" = auth.uid()::text);

CREATE POLICY "profiles_insert_own" ON "profiles"
  FOR INSERT WITH CHECK ("user_id" = auth.uid()::text);

CREATE POLICY "profiles_update_own" ON "profiles"
  FOR UPDATE USING ("user_id" = auth.uid()::text);

CREATE POLICY "profiles_delete_own" ON "profiles"
  FOR DELETE USING ("user_id" = auth.uid()::text);

-- saves: users can only access their own saves
CREATE POLICY "saves_select_own" ON "saves"
  FOR SELECT USING ("user_id" = auth.uid()::text);

CREATE POLICY "saves_insert_own" ON "saves"
  FOR INSERT WITH CHECK ("user_id" = auth.uid()::text);

CREATE POLICY "saves_update_own" ON "saves"
  FOR UPDATE USING ("user_id" = auth.uid()::text);

CREATE POLICY "saves_delete_own" ON "saves"
  FOR DELETE USING ("user_id" = auth.uid()::text);

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON "profiles"
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_saves_updated_at
  BEFORE UPDATE ON "saves"
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();
