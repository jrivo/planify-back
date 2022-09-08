-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_reviewId_fkey";

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "activityId" DROP NOT NULL,
ALTER COLUMN "reviewId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
