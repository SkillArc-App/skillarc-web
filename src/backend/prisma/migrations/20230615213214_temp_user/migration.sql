-- CreateTable
CREATE TABLE "TempUser" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "zipCode" TEXT,
    "phoneNumber" TEXT,
    "onboardingSessionId" TEXT,

    CONSTRAINT "TempUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_email_key" ON "TempUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_onboardingSessionId_key" ON "TempUser"("onboardingSessionId");
