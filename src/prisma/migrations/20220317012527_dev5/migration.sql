-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userStatusId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userStatusId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userStatusId_fkey" FOREIGN KEY ("userStatusId") REFERENCES "UserStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
