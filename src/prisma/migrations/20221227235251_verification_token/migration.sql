/*
  Warnings:

  - A unique constraint covering the columns `[verficationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verficationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_verficationToken_key" ON "User"("verficationToken");
