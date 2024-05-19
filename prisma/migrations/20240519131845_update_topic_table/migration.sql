/*
  Warnings:

  - Added the required column `prompt` to the `Topic` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Topic` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Chapter_courseId_idx` ON `Chapter`;

-- DropIndex
DROP INDEX `Topic_chapterId_idx` ON `Topic`;

-- AlterTable
ALTER TABLE `Topic` ADD COLUMN `prompt` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Chapter_courseId_position_idx` ON `Chapter`(`courseId`, `position`);

-- CreateIndex
CREATE INDEX `Topic_chapterId_Order_idx` ON `Topic`(`chapterId`, `Order`);
