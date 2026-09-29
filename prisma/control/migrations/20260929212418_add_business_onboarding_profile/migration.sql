-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('CAFE', 'RESTAURANT', 'QSR', 'CLOUD_KITCHEN', 'BAKERY', 'FOOD_TRUCK', 'OTHER');

-- CreateEnum
CREATE TYPE "LocationOperatingMode" AS ENUM ('DINE_IN', 'TAKEAWAY', 'DELIVERY_ONLY', 'HYBRID', 'OTHER');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "businessType" "BusinessType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "gstin" TEXT,
ADD COLUMN     "legalName" TEXT;

-- CreateTable
CREATE TABLE "BusinessOnboardingProfile" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "firstLocationName" TEXT NOT NULL,
    "firstLocationSlug" TEXT NOT NULL,
    "operatingMode" "LocationOperatingMode" NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'IN',
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessOnboardingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessOnboardingProfile_businessId_key" ON "BusinessOnboardingProfile"("businessId");

-- AddForeignKey
ALTER TABLE "BusinessOnboardingProfile" ADD CONSTRAINT "BusinessOnboardingProfile_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
