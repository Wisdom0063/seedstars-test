/*
  Warnings:

  - You are about to drop the column `description` on the `business_models` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `business_models` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `business_models` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_business_models" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "valuePropositionStatementId" TEXT NOT NULL,
    "keyPartners" TEXT,
    "keyActivities" TEXT,
    "keyResources" TEXT,
    "customerRelationships" TEXT,
    "channels" TEXT,
    "customerSegments" TEXT,
    "costStructure" TEXT,
    "revenueStreams" TEXT,
    "tags" TEXT,
    "notes" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    CONSTRAINT "business_models_valuePropositionStatementId_fkey" FOREIGN KEY ("valuePropositionStatementId") REFERENCES "value_proposition_statements" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_business_models" ("channels", "costStructure", "createdAt", "createdBy", "customerRelationships", "customerSegments", "id", "keyActivities", "keyPartners", "keyResources", "notes", "revenueStreams", "tags", "updatedAt", "updatedBy", "valuePropositionStatementId") SELECT "channels", "costStructure", "createdAt", "createdBy", "customerRelationships", "customerSegments", "id", "keyActivities", "keyPartners", "keyResources", "notes", "revenueStreams", "tags", "updatedAt", "updatedBy", "valuePropositionStatementId" FROM "business_models";
DROP TABLE "business_models";
ALTER TABLE "new_business_models" RENAME TO "business_models";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
