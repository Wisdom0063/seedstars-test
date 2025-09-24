/*
  Warnings:

  - You are about to drop the `customer_jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customer_pains` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gain_creators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pain_relievers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products_services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdBy` on the `business_models` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `business_models` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `value_proposition_statements` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `value_proposition_statements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "value_propositions" ADD COLUMN "customerJobs" TEXT;
ALTER TABLE "value_propositions" ADD COLUMN "customerPains" TEXT;
ALTER TABLE "value_propositions" ADD COLUMN "gainCreators" TEXT;
ALTER TABLE "value_propositions" ADD COLUMN "painRelievers" TEXT;
ALTER TABLE "value_propositions" ADD COLUMN "productsServices" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "customer_jobs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "customer_pains";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "gain_creators";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pain_relievers";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "products_services";
PRAGMA foreign_keys=on;

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
    CONSTRAINT "business_models_valuePropositionStatementId_fkey" FOREIGN KEY ("valuePropositionStatementId") REFERENCES "value_proposition_statements" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_business_models" ("channels", "costStructure", "createdAt", "customerRelationships", "customerSegments", "id", "keyActivities", "keyPartners", "keyResources", "notes", "revenueStreams", "tags", "updatedAt", "valuePropositionStatementId") SELECT "channels", "costStructure", "createdAt", "customerRelationships", "customerSegments", "id", "keyActivities", "keyPartners", "keyResources", "notes", "revenueStreams", "tags", "updatedAt", "valuePropositionStatementId" FROM "business_models";
DROP TABLE "business_models";
ALTER TABLE "new_business_models" RENAME TO "business_models";
CREATE TABLE "new_value_proposition_statements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offering" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "valuePropositionId" TEXT NOT NULL,
    CONSTRAINT "value_proposition_statements_valuePropositionId_fkey" FOREIGN KEY ("valuePropositionId") REFERENCES "value_propositions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_value_proposition_statements" ("description", "id", "offering", "valuePropositionId") SELECT "description", "id", "offering", "valuePropositionId" FROM "value_proposition_statements";
DROP TABLE "value_proposition_statements";
ALTER TABLE "new_value_proposition_statements" RENAME TO "value_proposition_statements";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
