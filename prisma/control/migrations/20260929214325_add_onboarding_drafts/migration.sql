-- CreateEnum
CREATE TYPE "BusinessOnboardingStatus" AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'PAYMENT_FAILED', 'PAID', 'PROVISIONING', 'PROVISIONING_FAILED', 'COMPLETED', 'EXPIRED');

-- CreateTable
CREATE TABLE "BusinessOnboardingDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT,
    "businessName" TEXT NOT NULL,
    "businessSlug" TEXT NOT NULL,
    "businessType" "BusinessType" NOT NULL,
    "legalName" TEXT,
    "gstin" TEXT,
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
    "planPriceId" TEXT,
    "quotedAmountMinor" INTEGER,
    "quotedCurrency" TEXT,
    "quotedInterval" "PlanPriceInterval",
    "quotedIntervalCount" INTEGER,
    "quotedUnit" "PlanPriceUnit",
    "quotedPriceType" "PlanPriceType",
    "quotedAt" TIMESTAMP(3),
    "status" "BusinessOnboardingStatus" NOT NULL DEFAULT 'DRAFT',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessOnboardingDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessOnboardingDraft_businessId_key" ON "BusinessOnboardingDraft"("businessId");

-- CreateIndex
CREATE INDEX "BusinessOnboardingDraft_userId_status_idx" ON "BusinessOnboardingDraft"("userId", "status");

-- CreateIndex
CREATE INDEX "BusinessOnboardingDraft_status_expiresAt_idx" ON "BusinessOnboardingDraft"("status", "expiresAt");

-- AddForeignKey
ALTER TABLE "BusinessOnboardingDraft" ADD CONSTRAINT "BusinessOnboardingDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessOnboardingDraft" ADD CONSTRAINT "BusinessOnboardingDraft_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessOnboardingDraft" ADD CONSTRAINT "BusinessOnboardingDraft_planPriceId_fkey" FOREIGN KEY ("planPriceId") REFERENCES "PlanPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
