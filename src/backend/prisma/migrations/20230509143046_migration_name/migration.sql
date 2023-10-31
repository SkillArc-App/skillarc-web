/*
  Warnings:

  - You are about to drop the `_DesiredSkillToJob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JobToLearnedSkill` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobId` to the `DesiredSkill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `LearnedSkill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DesiredSkillToJob" DROP CONSTRAINT "_DesiredSkillToJob_A_fkey";

-- DropForeignKey
ALTER TABLE "_DesiredSkillToJob" DROP CONSTRAINT "_DesiredSkillToJob_B_fkey";

-- DropForeignKey
ALTER TABLE "_JobToLearnedSkill" DROP CONSTRAINT "_JobToLearnedSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobToLearnedSkill" DROP CONSTRAINT "_JobToLearnedSkill_B_fkey";

-- AlterTable
ALTER TABLE "DesiredSkill" ADD COLUMN     "jobId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LearnedSkill" ADD COLUMN     "jobId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DesiredSkillToJob";

-- DropTable
DROP TABLE "_JobToLearnedSkill";

-- AddForeignKey
ALTER TABLE "LearnedSkill" ADD CONSTRAINT "LearnedSkill_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesiredSkill" ADD CONSTRAINT "DesiredSkill_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
