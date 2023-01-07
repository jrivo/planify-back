/*
  Warnings:

  - You are about to drop the `ReviewStatus` table. If the table is not empty, all the data it contains will be lost.

*/

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewStatusId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "googleAddressId" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "googlePlaceId" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "googleAuthor" TEXT,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "ReviewStatus";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
