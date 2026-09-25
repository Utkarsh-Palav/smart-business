-- CreateEnum
CREATE TYPE "ReviewCardMode" AS ENUM ('STANDALONE', 'MANAGED');

-- DropForeignKey
ALTER TABLE "ReviewCard" DROP CONSTRAINT "ReviewCard_businessId_fkey";

-- AlterTable
ALTER TABLE "ReviewCard" ADD COLUMN     "mode" "ReviewCardMode" NOT NULL DEFAULT 'STANDALONE',
ALTER COLUMN "businessId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ReviewCard_mode_idx" ON "ReviewCard"("mode");

-- CreateIndex
CREATE INDEX "ReviewCard_status_idx" ON "ReviewCard"("status");

-- AddForeignKey
ALTER TABLE "ReviewCard" ADD CONSTRAINT "ReviewCard_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
