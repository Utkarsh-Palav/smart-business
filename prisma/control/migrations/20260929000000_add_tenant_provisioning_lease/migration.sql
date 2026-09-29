-- AlterTable
ALTER TABLE "TenantDatabase"
ADD COLUMN "provisioningLeaseId" TEXT,
ADD COLUMN "provisioningLeaseExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "TenantDatabase_status_provisioningLeaseExpiresAt_idx"
ON "TenantDatabase"("status", "provisioningLeaseExpiresAt");
