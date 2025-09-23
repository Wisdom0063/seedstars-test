/*
  Warnings:

  - You are about to drop the column `description` on the `value_propositions` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `value_propositions` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `value_propositions` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "business_models" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_value_propositions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "segmentId" TEXT NOT NULL,
    "personaId" TEXT,
    CONSTRAINT "value_propositions_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "customer_segments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "value_propositions_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "personas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_value_propositions" ("createdAt", "createdBy", "id", "personaId", "segmentId", "tags", "updatedAt") SELECT "createdAt", "createdBy", "id", "personaId", "segmentId", "tags", "updatedAt" FROM "value_propositions";
DROP TABLE "value_propositions";
ALTER TABLE "new_value_propositions" RENAME TO "value_propositions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
