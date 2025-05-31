/*
  Warnings:

  - You are about to drop the column `deploymentId` on the `EnvSecrets` table. All the data in the column will be lost.
  - You are about to drop the column `customDomain` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `subDomain` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Deployment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "EnvSecrets" DROP CONSTRAINT "EnvSecrets_deploymentId_fkey";

-- DropIndex
DROP INDEX "Project_customDomain_key";

-- DropIndex
DROP INDEX "Project_subDomain_key";

-- AlterTable
ALTER TABLE "EnvSecrets" DROP COLUMN "deploymentId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "customDomain",
DROP COLUMN "subDomain",
ADD COLUMN     "branch" TEXT,
ADD COLUMN     "commitHash" TEXT,
ADD COLUMN     "containerId" TEXT,
ADD COLUMN     "deployedAt" TIMESTAMP(3),
ADD COLUMN     "ports" TEXT;

-- DropTable
DROP TABLE "Deployment";
