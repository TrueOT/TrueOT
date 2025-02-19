-- CreateTable
CREATE TABLE "VulnReport" (
    "id" TEXT NOT NULL,
    "cveId" TEXT NOT NULL,
    "cweId" TEXT,
    "cveName" TEXT NOT NULL,
    "cvssVersion" TEXT NOT NULL,
    "cvssScore" DOUBLE PRECISION NOT NULL,
    "cvssSeverity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VulnReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VulnReport_cveId_userId_key" ON "VulnReport" ("cveId", "userId");

-- CreateIndex
CREATE INDEX "VulnReport_userId_idx" ON "VulnReport" ("userId");

-- AddForeignKey
ALTER TABLE "VulnReport" ADD CONSTRAINT "VulnReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; 