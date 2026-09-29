-- CreateEnum
CREATE TYPE "PlanPriceInterval" AS ENUM ('MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "PlanPriceUnit" AS ENUM ('BUSINESS', 'LOCATION');

-- CreateEnum
CREATE TYPE "PlanPriceType" AS ENUM ('FIXED', 'STARTING_AT');

-- CreateTable
CREATE TABLE "PlanPrice" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "amountMinor" INTEGER NOT NULL,
    "interval" "PlanPriceInterval" NOT NULL,
    "intervalCount" INTEGER NOT NULL DEFAULT 1,
    "unit" "PlanPriceUnit" NOT NULL DEFAULT 'BUSINESS',
    "priceType" "PlanPriceType" NOT NULL DEFAULT 'FIXED',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanPrice_planId_isActive_idx" ON "PlanPrice"("planId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PlanPrice_planId_currency_interval_intervalCount_unit_price_key" ON "PlanPrice"("planId", "currency", "interval", "intervalCount", "unit", "priceType");

-- AddForeignKey
ALTER TABLE "PlanPrice" ADD CONSTRAINT "PlanPrice_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
