/*
  Warnings:

  - You are about to alter the column `correctAnswer` on the `Quiz` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Made the column `option1` on table `Quiz` required. This step will fail if there are existing NULL values in that column.
  - Made the column `option2` on table `Quiz` required. This step will fail if there are existing NULL values in that column.
  - Made the column `option3` on table `Quiz` required. This step will fail if there are existing NULL values in that column.
  - Made the column `option4` on table `Quiz` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Quiz` MODIFY `correctAnswer` INTEGER NOT NULL,
    MODIFY `option1` VARCHAR(191) NOT NULL,
    MODIFY `option2` VARCHAR(191) NOT NULL,
    MODIFY `option3` VARCHAR(191) NOT NULL,
    MODIFY `option4` VARCHAR(191) NOT NULL;
