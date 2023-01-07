/*
  Warnings:

  - You are about to drop the column `rating` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "displayActivitiesMode" AS ENUM ('ALL', 'NEARBY');

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_placeId_fkey";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "rating",
ADD COLUMN     "ratingId" INTEGER;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "rating",
ADD COLUMN     "activityId" INTEGER,
ADD COLUMN     "ratingId" INTEGER,
ALTER COLUMN "placeId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "displayActivities" "displayActivitiesMode" NOT NULL DEFAULT 'ALL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "one" INTEGER NOT NULL DEFAULT 0,
    "two" INTEGER NOT NULL DEFAULT 0,
    "three" INTEGER NOT NULL DEFAULT 0,
    "four" INTEGER NOT NULL DEFAULT 0,
    "five" INTEGER NOT NULL DEFAULT 0,
    "average" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "placeId" INTEGER,
    "activityId" INTEGER,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_placeId_key" ON "Rating"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_activityId_key" ON "Rating"("activityId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
