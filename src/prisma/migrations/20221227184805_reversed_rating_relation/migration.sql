/*
  Warnings:

  - You are about to drop the column `ratingId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `ratingId` on the `Place` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[placeId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activityId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_ratingId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_ratingId_fkey";

-- DropIndex
DROP INDEX "Activity_ratingId_key";

-- DropIndex
DROP INDEX "Place_ratingId_key";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "ratingId";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "ratingId";

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "activityId" INTEGER,
ADD COLUMN     "placeId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Rating_placeId_key" ON "Rating"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_activityId_key" ON "Rating"("activityId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
