-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_placeTypeId_fkey";

-- AlterTable
ALTER TABLE "Place" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "placeTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_placeTypeId_fkey" FOREIGN KEY ("placeTypeId") REFERENCES "PlaceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;