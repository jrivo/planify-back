/*
  Warnings:

  - The values [PENDING] on the enum `ReviewStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `activityId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `placeId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `ratingId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ratingId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ratingId]` on the table `Place` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReviewStatus_new" AS ENUM ('UNVERIFIED', 'APPROVED', 'REJECTED');
ALTER TABLE "Review" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Review" ALTER COLUMN "status" TYPE "ReviewStatus_new" USING ("status"::text::"ReviewStatus_new");
ALTER TYPE "ReviewStatus" RENAME TO "ReviewStatus_old";
ALTER TYPE "ReviewStatus_new" RENAME TO "ReviewStatus";
DROP TYPE "ReviewStatus_old";
ALTER TABLE "Review" ALTER COLUMN "status" SET DEFAULT 'UNVERIFIED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_placeId_fkey";

-- DropIndex
DROP INDEX "Rating_activityId_key";

-- DropIndex
DROP INDEX "Rating_placeId_key";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "ratingId" INTEGER;

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "activityId",
DROP COLUMN "placeId";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "ratingId",
ADD COLUMN     "score" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'UNVERIFIED';

-- CreateIndex
CREATE UNIQUE INDEX "Activity_ratingId_key" ON "Activity"("ratingId");

-- CreateIndex
CREATE UNIQUE INDEX "Place_ratingId_key" ON "Place"("ratingId");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE SET NULL ON UPDATE CASCADE;
