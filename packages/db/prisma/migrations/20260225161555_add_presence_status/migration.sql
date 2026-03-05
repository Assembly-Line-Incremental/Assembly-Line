-- CreateEnum
CREATE TYPE "PresenceStatus" AS ENUM ('ONLINE', 'IDLE', 'OFFLINE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "lastSeenAt" TIMESTAMP(3),
ADD COLUMN     "presenceStatus" "PresenceStatus" NOT NULL DEFAULT 'OFFLINE';
