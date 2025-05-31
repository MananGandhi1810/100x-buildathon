/*
  Warnings:

  - You are about to drop the column `containerPort` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deployment" ADD COLUMN     "ports" TEXT;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "containerPort",
ADD COLUMN     "containerPorts" TEXT;
