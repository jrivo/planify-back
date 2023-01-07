-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;
