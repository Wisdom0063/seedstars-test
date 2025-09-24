-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_value_proposition_statements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offering" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "valuePropositionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "value_proposition_statements_valuePropositionId_fkey" FOREIGN KEY ("valuePropositionId") REFERENCES "value_propositions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_value_proposition_statements" ("description", "id", "offering", "valuePropositionId") SELECT "description", "id", "offering", "valuePropositionId" FROM "value_proposition_statements";
DROP TABLE "value_proposition_statements";
ALTER TABLE "new_value_proposition_statements" RENAME TO "value_proposition_statements";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
