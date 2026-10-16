-- Prevent duplicate control-plane routes for the same tenant table.
CREATE UNIQUE INDEX "TableRoute_tenantKey_tableId_key" ON "TableRoute"("tenantKey", "tableId");
