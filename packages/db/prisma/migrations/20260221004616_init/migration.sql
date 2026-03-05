-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('METAL', 'CIRCUIT', 'ENERGY', 'HEAT', 'GEAR', 'CHIP', 'PLASMA', 'NANOFIBER', 'QUANTUM_CORE', 'DARK_MATTER');

-- CreateEnum
CREATE TYPE "SupporterTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('BOOST', 'CHALLENGE', 'SEASONAL');

-- CreateEnum
CREATE TYPE "LeaderboardCategory" AS ENUM ('TOTAL_PRODUCTION', 'SPEED_RUN', 'PRESTIGE_COUNT', 'ERA_REACHED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_save" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Save',
    "currentEra" INTEGER NOT NULL DEFAULT 1,
    "prestigeCount" INTEGER NOT NULL DEFAULT 0,
    "totalPlaytime" BIGINT NOT NULL DEFAULT 0,
    "isHardcore" BOOLEAN NOT NULL DEFAULT false,
    "lastTickAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_save_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource" (
    "id" TEXT NOT NULL,
    "saveId" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "amount" DECIMAL(30,6) NOT NULL DEFAULT 0,
    "totalProduced" DECIMAL(30,6) NOT NULL DEFAULT 0,
    "totalSpent" DECIMAL(30,6) NOT NULL DEFAULT 0,

    CONSTRAINT "resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine_definition" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "era" INTEGER NOT NULL,
    "baseCost" JSONB NOT NULL,
    "costMultiplier" DECIMAL(10,4) NOT NULL,
    "baseProduction" JSONB NOT NULL,
    "baseConsumption" JSONB NOT NULL,
    "baseHeat" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "unlockCondition" JSONB,
    "maxLevel" INTEGER,

    CONSTRAINT "machine_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_machine" (
    "id" TEXT NOT NULL,
    "saveId" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedSlot" INTEGER,

    CONSTRAINT "player_machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "heat_state" (
    "id" TEXT NOT NULL,
    "saveId" TEXT NOT NULL,
    "currentHeat" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "maxHeat" DECIMAL(10,4) NOT NULL DEFAULT 100,
    "dissipationRate" DECIMAL(10,4) NOT NULL DEFAULT 1,
    "overheatingSince" TIMESTAMP(3),

    CONSTRAINT "heat_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "synergy_definition" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "era" INTEGER NOT NULL,
    "conditions" JSONB NOT NULL,
    "effects" JSONB NOT NULL,

    CONSTRAINT "synergy_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_synergy" (
    "id" TEXT NOT NULL,
    "saveId" TEXT NOT NULL,
    "synergyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_synergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prestige_state" (
    "id" TEXT NOT NULL,
    "saveId" TEXT NOT NULL,
    "prestigePoints" DECIMAL(30,6) NOT NULL DEFAULT 0,
    "totalEarned" DECIMAL(30,6) NOT NULL DEFAULT 0,
    "timesPrestiged" INTEGER NOT NULL DEFAULT 0,
    "lastPrestigeAt" TIMESTAMP(3),

    CONSTRAINT "prestige_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_definition" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "era" INTEGER NOT NULL,
    "cost" JSONB NOT NULL,
    "effects" JSONB NOT NULL,
    "prerequisites" TEXT[],
    "isPersistent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tech_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_tech" (
    "id" TEXT NOT NULL,
    "saveId" TEXT NOT NULL,
    "techId" TEXT NOT NULL,
    "isResearched" BOOLEAN NOT NULL DEFAULT false,
    "researchedAt" TIMESTAMP(3),

    CONSTRAINT "player_tech_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_definition" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "condition" JSONB NOT NULL,
    "reward" JSONB NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "milestone_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_milestone" (
    "id" TEXT NOT NULL,
    "saveId" TEXT NOT NULL,
    "milestoneId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "player_milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supporter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "SupporterTier" NOT NULL,
    "polarCustomerId" TEXT,
    "polarSubId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "supporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "effects" JSONB NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_event" (
    "id" TEXT NOT NULL,
    "saveId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "progress" JSONB NOT NULL DEFAULT '{}',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "rewardClaimed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "player_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard_entry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "saveId" TEXT NOT NULL,
    "category" "LeaderboardCategory" NOT NULL,
    "score" DECIMAL(30,6) NOT NULL,
    "era" INTEGER NOT NULL,
    "isSupporter" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaderboard_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "game_save_userId_slot_key" ON "game_save"("userId", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "resource_saveId_type_key" ON "resource"("saveId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "machine_definition_slug_key" ON "machine_definition"("slug");

-- CreateIndex
CREATE INDEX "machine_definition_era_idx" ON "machine_definition"("era");

-- CreateIndex
CREATE UNIQUE INDEX "player_machine_saveId_machineId_key" ON "player_machine"("saveId", "machineId");

-- CreateIndex
CREATE UNIQUE INDEX "heat_state_saveId_key" ON "heat_state"("saveId");

-- CreateIndex
CREATE UNIQUE INDEX "synergy_definition_slug_key" ON "synergy_definition"("slug");

-- CreateIndex
CREATE INDEX "synergy_definition_era_idx" ON "synergy_definition"("era");

-- CreateIndex
CREATE UNIQUE INDEX "player_synergy_saveId_synergyId_key" ON "player_synergy"("saveId", "synergyId");

-- CreateIndex
CREATE UNIQUE INDEX "prestige_state_saveId_key" ON "prestige_state"("saveId");

-- CreateIndex
CREATE UNIQUE INDEX "tech_definition_slug_key" ON "tech_definition"("slug");

-- CreateIndex
CREATE INDEX "tech_definition_era_idx" ON "tech_definition"("era");

-- CreateIndex
CREATE UNIQUE INDEX "player_tech_saveId_techId_key" ON "player_tech"("saveId", "techId");

-- CreateIndex
CREATE UNIQUE INDEX "milestone_definition_slug_key" ON "milestone_definition"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "player_milestone_saveId_milestoneId_key" ON "player_milestone"("saveId", "milestoneId");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_userId_slug_key" ON "achievement"("userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "supporter_userId_key" ON "supporter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_key" ON "event"("slug");

-- CreateIndex
CREATE INDEX "event_startsAt_endsAt_idx" ON "event"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "player_event_saveId_eventId_key" ON "player_event"("saveId", "eventId");

-- CreateIndex
CREATE INDEX "leaderboard_entry_category_score_idx" ON "leaderboard_entry"("category", "score" DESC);

-- CreateIndex
CREATE INDEX "leaderboard_entry_saveId_idx" ON "leaderboard_entry"("saveId");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_entry_userId_category_key" ON "leaderboard_entry"("userId", "category");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_save" ADD CONSTRAINT "game_save_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource" ADD CONSTRAINT "resource_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "game_save"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_machine" ADD CONSTRAINT "player_machine_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "game_save"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_machine" ADD CONSTRAINT "player_machine_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machine_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heat_state" ADD CONSTRAINT "heat_state_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "game_save"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_synergy" ADD CONSTRAINT "player_synergy_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "game_save"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_synergy" ADD CONSTRAINT "player_synergy_synergyId_fkey" FOREIGN KEY ("synergyId") REFERENCES "synergy_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prestige_state" ADD CONSTRAINT "prestige_state_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "game_save"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_tech" ADD CONSTRAINT "player_tech_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "game_save"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_tech" ADD CONSTRAINT "player_tech_techId_fkey" FOREIGN KEY ("techId") REFERENCES "tech_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_milestone" ADD CONSTRAINT "player_milestone_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "game_save"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_milestone" ADD CONSTRAINT "player_milestone_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestone_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement" ADD CONSTRAINT "achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supporter" ADD CONSTRAINT "supporter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_event" ADD CONSTRAINT "player_event_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "game_save"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_event" ADD CONSTRAINT "player_event_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_entry" ADD CONSTRAINT "leaderboard_entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_entry" ADD CONSTRAINT "leaderboard_entry_saveId_fkey" FOREIGN KEY ("saveId") REFERENCES "game_save"("id") ON DELETE CASCADE ON UPDATE CASCADE;
