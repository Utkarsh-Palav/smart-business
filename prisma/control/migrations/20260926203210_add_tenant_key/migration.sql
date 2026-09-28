/*
  Warnings:

  - A unique constraint covering the columns `[tenantKey]` on the table `TenantDatabase` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantKey` to the `TenantDatabase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TenantDatabase" ADD COLUMN     "tenantKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TenantDatabase_tenantKey_key" ON "TenantDatabase"("tenantKey");
