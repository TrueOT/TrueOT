/*
  Warnings:

  - You are about to drop the column `cvssSeverity` on the `VulnReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VulnReport" DROP COLUMN "cvssSeverity",
ADD COLUMN     "device" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "newSeverity" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "originalSeverity" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Open';
