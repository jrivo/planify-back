-- CreateEnum
CREATE TYPE "ReviewSource" AS ENUM ('GOOGLE', 'PLANIFY');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "source" "ReviewSource" NOT NULL DEFAULT 'PLANIFY';
