/*
  Warnings:

  - You are about to drop the column `profileId` on the `SeekerTrainingProvider` table. All the data in the column will be lost.
  - Added the required column `userId` to the `SeekerTrainingProvider` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SeekerTrainingProvider" DROP CONSTRAINT "SeekerTrainingProvider_profileId_fkey";

-- AlterTable
ALTER TABLE "SeekerTrainingProvider" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SeekerTrainingProvider" ADD CONSTRAINT "SeekerTrainingProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
