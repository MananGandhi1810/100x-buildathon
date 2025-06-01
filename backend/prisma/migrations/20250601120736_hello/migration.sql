/*
  Warnings:

  - A unique constraint covering the columns `[containerId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "containerId" TEXT,
ADD COLUMN     "containerPort" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_containerId_key" ON "Project"("containerId");
