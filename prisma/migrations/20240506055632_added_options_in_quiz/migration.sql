/*
  Warnings:

  - You are about to drop the column `questions` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `question` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Quiz` DROP COLUMN `questions`,
    ADD COLUMN `option1` VARCHAR(191) NULL,
    ADD COLUMN `option2` VARCHAR(191) NULL,
    ADD COLUMN `option3` VARCHAR(191) NULL,
    ADD COLUMN `option4` VARCHAR(191) NULL,
    ADD COLUMN `option5` VARCHAR(191) NULL,
    ADD COLUMN `option6` VARCHAR(191) NULL,
    ADD COLUMN `question` VARCHAR(191) NOT NULL;
