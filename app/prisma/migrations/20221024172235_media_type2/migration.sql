/*
  Warnings:

  - The `type` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MAIN_IMAGE', 'IMAGE', 'DOCUMENT');

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_placeId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "type",
ADD COLUMN     "type" "MediaType",
ALTER COLUMN "placeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;
