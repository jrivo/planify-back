-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_placeId_fkey";

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "placeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;
