/*
  Warnings:

  - You are about to drop the `TrainingProvderInvite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingProvderProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `referenceText` to the `Reference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `SeekerTrainingProvider` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_authorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingProvderInvite" DROP CONSTRAINT "TrainingProvderInvite_trainingProviderId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingProvderProfile" DROP CONSTRAINT "TrainingProvderProfile_userId_fkey";

-- AlterTable
ALTER TABLE "Reference" ADD COLUMN     "referenceText" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SeekerTrainingProvider" ADD COLUMN     "programId" TEXT NOT NULL;

-- DropTable
DROP TABLE "TrainingProvderInvite";

-- DropTable
DROP TABLE "TrainingProvderProfile";

-- CreateTable
CREATE TABLE "TrainingProviderInvite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "roleDescription" TEXT NOT NULL,
    "trainingProviderId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingProviderInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProviderProfile" (
    "id" TEXT NOT NULL,
    "trainingProviderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingProviderProfile_userId_key" ON "TrainingProviderProfile"("userId");

-- AddForeignKey
ALTER TABLE "TrainingProviderInvite" ADD CONSTRAINT "TrainingProviderInvite_trainingProviderId_fkey" FOREIGN KEY ("trainingProviderId") REFERENCES "TrainingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerTrainingProvider" ADD CONSTRAINT "SeekerTrainingProvider_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_authorProfileId_fkey" FOREIGN KEY ("authorProfileId") REFERENCES "TrainingProviderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProviderProfile" ADD CONSTRAINT "TrainingProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProviderProfile" ADD CONSTRAINT "TrainingProviderProfile_trainingProviderId_fkey" FOREIGN KEY ("trainingProviderId") REFERENCES "TrainingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
