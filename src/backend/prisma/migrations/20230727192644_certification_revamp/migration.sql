-- CreateTable
CREATE TABLE "MasterCertification" (
    "id" TEXT NOT NULL,
    "certification" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesiredCertification" (
    "id" TEXT NOT NULL,
    "masterCertificationId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesiredCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileCertification" (
    "id" TEXT NOT NULL,
    "masterCertificationId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileCertification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DesiredCertification" ADD CONSTRAINT "DesiredCertification_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesiredCertification" ADD CONSTRAINT "DesiredCertification_masterCertificationId_fkey" FOREIGN KEY ("masterCertificationId") REFERENCES "MasterCertification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCertification" ADD CONSTRAINT "ProfileCertification_masterCertificationId_fkey" FOREIGN KEY ("masterCertificationId") REFERENCES "MasterCertification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCertification" ADD CONSTRAINT "ProfileCertification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
