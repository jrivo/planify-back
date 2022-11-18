-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "addressId" INTEGER;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
