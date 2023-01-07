/*
  Warnings:

  - You are about to drop the column `reviewStatusId` on the `Review` table. All the data in the column will be lost.
  - Made the column `rating` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "reviewStatusId",
ALTER COLUMN "rating" SET NOT NULL;
