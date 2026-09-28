-- AlterTable
ALTER TABLE "TenantDatabase" ADD COLUMN     "neonBranchId" TEXT,
ADD COLUMN     "neonProjectId" TEXT,
ALTER COLUMN "connectionSecretRef" DROP NOT NULL;
