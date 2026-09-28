-- CreateEnum
CREATE TYPE "PublicRouteStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'RETIRED');

-- CreateTable
CREATE TABLE "TableRoute" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "tenantKey" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "status" "PublicRouteStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TableRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TableRoute_token_key" ON "TableRoute"("token");

-- CreateIndex
CREATE INDEX "TableRoute_businessId_idx" ON "TableRoute"("businessId");

-- CreateIndex
CREATE INDEX "TableRoute_tenantKey_idx" ON "TableRoute"("tenantKey");

-- CreateIndex
CREATE INDEX "TableRoute_tableId_idx" ON "TableRoute"("tableId");

-- CreateIndex
CREATE INDEX "TableRoute_status_idx" ON "TableRoute"("status");

-- AddForeignKey
ALTER TABLE "TableRoute" ADD CONSTRAINT "TableRoute_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
