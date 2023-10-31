-- CreateTable
CREATE TABLE "PersonalExperience" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonalExperience" ADD CONSTRAINT "PersonalExperience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
