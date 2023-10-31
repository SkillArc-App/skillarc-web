-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULLTIME', 'PARTTIME');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "benefitsDescription" TEXT NOT NULL,
    "responsibilitiesDescription" TEXT NOT NULL,
    "employmentTitle" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerPath" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "upperLimit" TEXT NOT NULL,
    "lowerLimit" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "CareerPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnedSkill" (
    "id" TEXT NOT NULL,
    "masterSkillId" TEXT NOT NULL,

    CONSTRAINT "LearnedSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesiredSkill" (
    "id" TEXT NOT NULL,
    "masterSkillId" TEXT NOT NULL,

    CONSTRAINT "DesiredSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "bio" TEXT NOT NULL,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterSkill" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "MasterSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobToLearnedSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DesiredSkillToJob" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JobToLearnedSkill_AB_unique" ON "_JobToLearnedSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_JobToLearnedSkill_B_index" ON "_JobToLearnedSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DesiredSkillToJob_AB_unique" ON "_DesiredSkillToJob"("A", "B");

-- CreateIndex
CREATE INDEX "_DesiredSkillToJob_B_index" ON "_DesiredSkillToJob"("B");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnedSkill" ADD CONSTRAINT "LearnedSkill_masterSkillId_fkey" FOREIGN KEY ("masterSkillId") REFERENCES "MasterSkill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesiredSkill" ADD CONSTRAINT "DesiredSkill_masterSkillId_fkey" FOREIGN KEY ("masterSkillId") REFERENCES "MasterSkill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToLearnedSkill" ADD CONSTRAINT "_JobToLearnedSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobToLearnedSkill" ADD CONSTRAINT "_JobToLearnedSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "LearnedSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DesiredSkillToJob" ADD CONSTRAINT "_DesiredSkillToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "DesiredSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DesiredSkillToJob" ADD CONSTRAINT "_DesiredSkillToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
