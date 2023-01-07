/*
  Warnings:

  - You are about to drop the column `userId` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profilePictureId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_userId_fkey";

-- DropIndex
DROP INDEX "Media_userId_key";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "mainImageId" INTEGER;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "mainImageId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePictureId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_profilePictureId_key" ON "User"("profilePictureId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
