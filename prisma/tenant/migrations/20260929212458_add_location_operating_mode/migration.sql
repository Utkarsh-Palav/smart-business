-- CreateEnum
CREATE TYPE "LocationOperatingMode" AS ENUM ('DINE_IN', 'TAKEAWAY', 'DELIVERY_ONLY', 'HYBRID', 'OTHER');

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "operatingMode" "LocationOperatingMode" NOT NULL DEFAULT 'DINE_IN';
