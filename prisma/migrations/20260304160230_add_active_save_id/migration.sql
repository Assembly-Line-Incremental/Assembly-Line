-- AlterTable
ALTER TABLE "user" ADD COLUMN     "activeSaveId" TEXT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_activeSaveId_fkey" FOREIGN KEY ("activeSaveId") REFERENCES "game_save"("id") ON DELETE SET NULL ON UPDATE CASCADE;
