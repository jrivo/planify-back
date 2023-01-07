-- CreateTable
CREATE TABLE "_PlaceToTrip" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlaceToTrip_AB_unique" ON "_PlaceToTrip"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaceToTrip_B_index" ON "_PlaceToTrip"("B");

-- AddForeignKey
ALTER TABLE "_PlaceToTrip" ADD CONSTRAINT "_PlaceToTrip_A_fkey" FOREIGN KEY ("A") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaceToTrip" ADD CONSTRAINT "_PlaceToTrip_B_fkey" FOREIGN KEY ("B") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
