-- CreateTable
CREATE TABLE "customer_segments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "personas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "location" TEXT,
    "education" TEXT,
    "incomePerMonth" TEXT,
    "painPoints" TEXT,
    "purchasingBehavior" TEXT,
    "channels" TEXT,
    "quote" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "segmentId" TEXT NOT NULL,
    CONSTRAINT "personas_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "customer_segments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
