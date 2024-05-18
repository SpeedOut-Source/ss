/*
  Warnings:

  - You are about to drop the column `chapterId` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `topicId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Lesson_chapterId_idx` ON `Lesson`;

-- AlterTable
ALTER TABLE `Lesson` DROP COLUMN `chapterId`,
    ADD COLUMN `topicId` VARCHAR(191) NOT NULL,
    ALTER COLUMN `order` DROP DEFAULT;

-- CreateTable
CREATE TABLE `Topic` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `Order` INTEGER NOT NULL,
    `chapterId` VARCHAR(191) NOT NULL,

    INDEX `Topic_chapterId_idx`(`chapterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Lesson_topicId_idx` ON `Lesson`(`topicId`);
