-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SEEKER', 'TRAINING_PROVIDER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'SEEKER';

-- CreateTable
CREATE TABLE "TrainingProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trainingProviderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramSkill" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeekerInvite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "trainingProviderId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeekerInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProvderInvite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "roleDescription" TEXT NOT NULL,
    "trainingProviderId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingProvderInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeekerTrainingProvider" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "trainingProviderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeekerTrainingProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL,
    "authorProfileId" TEXT NOT NULL,
    "seekerProfileId" TEXT NOT NULL,
    "trainingProviderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProvderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingProvderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingProvderProfile_userId_key" ON "TrainingProvderProfile"("userId");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_trainingProviderId_fkey" FOREIGN KEY ("trainingProviderId") REFERENCES "TrainingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSkill" ADD CONSTRAINT "ProgramSkill_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSkill" ADD CONSTRAINT "ProgramSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "MasterSkill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerInvite" ADD CONSTRAINT "SeekerInvite_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerInvite" ADD CONSTRAINT "SeekerInvite_trainingProviderId_fkey" FOREIGN KEY ("trainingProviderId") REFERENCES "TrainingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProvderInvite" ADD CONSTRAINT "TrainingProvderInvite_trainingProviderId_fkey" FOREIGN KEY ("trainingProviderId") REFERENCES "TrainingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerTrainingProvider" ADD CONSTRAINT "SeekerTrainingProvider_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerTrainingProvider" ADD CONSTRAINT "SeekerTrainingProvider_trainingProviderId_fkey" FOREIGN KEY ("trainingProviderId") REFERENCES "TrainingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_authorProfileId_fkey" FOREIGN KEY ("authorProfileId") REFERENCES "TrainingProvderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_seekerProfileId_fkey" FOREIGN KEY ("seekerProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_trainingProviderId_fkey" FOREIGN KEY ("trainingProviderId") REFERENCES "TrainingProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProvderProfile" ADD CONSTRAINT "TrainingProvderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
