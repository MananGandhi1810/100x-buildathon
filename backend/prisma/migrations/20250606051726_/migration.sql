/*
  Warnings:

  - You are about to drop the column `containerId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `containerPort` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `githubUrl` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[repoUrl]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Project_containerId_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "containerId",
DROP COLUMN "containerPort",
DROP COLUMN "githubUrl",
ADD COLUMN     "repoUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_repoUrl_key" ON "Project"("repoUrl");
