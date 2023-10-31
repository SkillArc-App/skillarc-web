-- CreateTable
CREATE TABLE "ProfileSkill" (
    "id" TEXT NOT NULL,
    "masterSkillId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ProfileSkill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileSkill" ADD CONSTRAINT "ProfileSkill_masterSkillId_fkey" FOREIGN KEY ("masterSkillId") REFERENCES "MasterSkill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileSkill" ADD CONSTRAINT "ProfileSkill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
