-- DropForeignKey
ALTER TABLE "SeekerTrainingProvider" DROP CONSTRAINT "SeekerTrainingProvider_programId_fkey";

-- AlterTable
ALTER TABLE "SeekerTrainingProvider" ALTER COLUMN "programId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SeekerTrainingProvider" ADD CONSTRAINT "SeekerTrainingProvider_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;
