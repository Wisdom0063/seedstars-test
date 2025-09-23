-- CreateTable
CREATE TABLE "value_propositions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "segmentId" TEXT NOT NULL,
    "personaId" TEXT,
    CONSTRAINT "value_propositions_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "customer_segments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "value_propositions_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "personas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customer_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "importance" TEXT NOT NULL,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "valuePropositionId" TEXT NOT NULL,
    CONSTRAINT "customer_jobs_valuePropositionId_fkey" FOREIGN KEY ("valuePropositionId") REFERENCES "value_propositions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customer_pains" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "valuePropositionId" TEXT NOT NULL,
    CONSTRAINT "customer_pains_valuePropositionId_fkey" FOREIGN KEY ("valuePropositionId") REFERENCES "value_propositions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gain_creators" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "valuePropositionId" TEXT NOT NULL,
    CONSTRAINT "gain_creators_valuePropositionId_fkey" FOREIGN KEY ("valuePropositionId") REFERENCES "value_propositions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pain_relievers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "valuePropositionId" TEXT NOT NULL,
    CONSTRAINT "pain_relievers_valuePropositionId_fkey" FOREIGN KEY ("valuePropositionId") REFERENCES "value_propositions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "products_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "features" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "valuePropositionId" TEXT NOT NULL,
    CONSTRAINT "products_services_valuePropositionId_fkey" FOREIGN KEY ("valuePropositionId") REFERENCES "value_propositions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "value_proposition_statements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offering" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "valuePropositionId" TEXT NOT NULL,
    CONSTRAINT "value_proposition_statements_valuePropositionId_fkey" FOREIGN KEY ("valuePropositionId") REFERENCES "value_propositions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
