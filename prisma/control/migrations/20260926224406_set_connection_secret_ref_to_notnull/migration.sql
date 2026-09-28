/*
  Warnings:

  - Made the column `connectionSecretRef` on table `TenantDatabase` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TenantDatabase" ALTER COLUMN "connectionSecretRef" SET NOT NULL;
