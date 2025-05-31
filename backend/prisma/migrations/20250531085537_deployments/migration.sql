/*
  Warnings:

  - You are about to drop the `EnvSecrets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectFramework" AS ENUM ('Node', 'React', 'Express', 'Next', 'Flask', 'Django', 'Docker', 'Other');

-- DropForeignKey
ALTER TABLE "EnvSecrets" DROP CONSTRAINT "EnvSecrets_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropTable
DROP TABLE "EnvSecrets";

-- DropTable
DROP TABLE "Project";

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "githubUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "framework" "ProjectFramework" NOT NULL,
    "imageName" TEXT,
    "deployCommit" TEXT,
    "containerId" TEXT,
    "containerPort" TEXT,
    "containerLogs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastDeploy" TIMESTAMP(3),
    "branchName" TEXT DEFAULT 'main',
    "baseDirectory" TEXT DEFAULT '',
    "webhookId" TEXT,
    "domainName" TEXT,
    "userId" TEXT NOT NULL,
    "dockerfile" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "env_secrets" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "env_secrets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_containerId_key" ON "projects"("containerId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_webhookId_key" ON "projects"("webhookId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_domainName_key" ON "projects"("domainName");

-- CreateIndex
CREATE UNIQUE INDEX "env_secrets_key_projectId_key" ON "env_secrets"("key", "projectId");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "env_secrets" ADD CONSTRAINT "env_secrets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
