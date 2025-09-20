-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_views" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'PERSONAS',
    "layout" TEXT NOT NULL DEFAULT 'CARD',
    "filters" TEXT,
    "sortBy" TEXT,
    "sortOrder" TEXT NOT NULL DEFAULT 'ASC',
    "groupBy" TEXT,
    "visibleFields" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_views" ("createdAt", "description", "filters", "groupBy", "id", "isDefault", "layout", "name", "sortBy", "sortOrder", "updatedAt", "visibleFields") SELECT "createdAt", "description", "filters", "groupBy", "id", "isDefault", "layout", "name", "sortBy", "sortOrder", "updatedAt", "visibleFields" FROM "views";
DROP TABLE "views";
ALTER TABLE "new_views" RENAME TO "views";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
