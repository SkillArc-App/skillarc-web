/*
  Warnings:

  - You are about to drop the column `issue_date` on the `Credential` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "issue_date",
ADD COLUMN     "issued_date" TEXT;

-- RenameForeignKey
ALTER TABLE "Account" RENAME CONSTRAINT "Account_userId_fkey" TO "Account_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "Applicant" RENAME CONSTRAINT "Applicant_jobId_fkey" TO "Applicant_job_id_fkey";

-- RenameForeignKey
ALTER TABLE "Applicant" RENAME CONSTRAINT "Applicant_profileId_fkey" TO "Applicant_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "ApplicantStatus" RENAME CONSTRAINT "ApplicantStatus_applicantId_fkey" TO "ApplicantStatus_applicant_id_fkey";

-- RenameForeignKey
ALTER TABLE "CareerPath" RENAME CONSTRAINT "CareerPath_jobId_fkey" TO "CareerPath_job_id_fkey";

-- RenameForeignKey
ALTER TABLE "Credential" RENAME CONSTRAINT "Credential_organizationId_fkey" TO "Credential_organization_id_fkey";

-- RenameForeignKey
ALTER TABLE "Credential" RENAME CONSTRAINT "Credential_profileId_fkey" TO "Credential_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "DesiredCertification" RENAME CONSTRAINT "DesiredCertification_jobId_fkey" TO "DesiredCertification_job_id_fkey";

-- RenameForeignKey
ALTER TABLE "DesiredCertification" RENAME CONSTRAINT "DesiredCertification_masterCertificationId_fkey" TO "DesiredCertification_master_certification_id_fkey";

-- RenameForeignKey
ALTER TABLE "DesiredOutcomes" RENAME CONSTRAINT "DesiredOutcomes_profileId_fkey" TO "DesiredOutcomes_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "DesiredSkill" RENAME CONSTRAINT "DesiredSkill_jobId_fkey" TO "DesiredSkill_job_id_fkey";

-- RenameForeignKey
ALTER TABLE "DesiredSkill" RENAME CONSTRAINT "DesiredSkill_masterSkillId_fkey" TO "DesiredSkill_master_skill_id_fkey";

-- RenameForeignKey
ALTER TABLE "EducationExperience" RENAME CONSTRAINT "EducationExperience_organizationId_fkey" TO "EducationExperience_organization_id_fkey";

-- RenameForeignKey
ALTER TABLE "EducationExperience" RENAME CONSTRAINT "EducationExperience_profileId_fkey" TO "EducationExperience_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "EmployerInvite" RENAME CONSTRAINT "EmployerInvite_employerId_fkey" TO "EmployerInvite_employer_id_fkey";

-- RenameForeignKey
ALTER TABLE "Job" RENAME CONSTRAINT "Job_employerId_fkey" TO "Job_employer_id_fkey";

-- RenameForeignKey
ALTER TABLE "JobInteraction" RENAME CONSTRAINT "JobInteraction_jobId_fkey" TO "JobInteraction_job_id_fkey";

-- RenameForeignKey
ALTER TABLE "JobInteraction" RENAME CONSTRAINT "JobInteraction_userId_fkey" TO "JobInteraction_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "JobPhoto" RENAME CONSTRAINT "JobPhoto_jobId_fkey" TO "JobPhoto_job_id_fkey";

-- RenameForeignKey
ALTER TABLE "JobTag" RENAME CONSTRAINT "JobTag_jobId_fkey" TO "JobTag_job_id_fkey";

-- RenameForeignKey
ALTER TABLE "JobTag" RENAME CONSTRAINT "JobTag_tagId_fkey" TO "JobTag_tag_id_fkey";

-- RenameForeignKey
ALTER TABLE "LearnedSkill" RENAME CONSTRAINT "LearnedSkill_jobId_fkey" TO "LearnedSkill_job_id_fkey";

-- RenameForeignKey
ALTER TABLE "LearnedSkill" RENAME CONSTRAINT "LearnedSkill_masterSkillId_fkey" TO "LearnedSkill_master_skill_id_fkey";

-- RenameForeignKey
ALTER TABLE "NetworkInterests" RENAME CONSTRAINT "NetworkInterests_profileId_fkey" TO "NetworkInterests_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "OnboardingSession" RENAME CONSTRAINT "OnboardingSession_userId_fkey" TO "OnboardingSession_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "OtherExperience" RENAME CONSTRAINT "OtherExperience_organizationId_fkey" TO "OtherExperience_organization_id_fkey";

-- RenameForeignKey
ALTER TABLE "OtherExperience" RENAME CONSTRAINT "OtherExperience_profileId_fkey" TO "OtherExperience_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "PersonalExperience" RENAME CONSTRAINT "PersonalExperience_profileId_fkey" TO "PersonalExperience_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProfessionalInterests" RENAME CONSTRAINT "ProfessionalInterests_profileId_fkey" TO "ProfessionalInterests_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "Profile" RENAME CONSTRAINT "Profile_userId_fkey" TO "Profile_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProfileCertification" RENAME CONSTRAINT "ProfileCertification_masterCertificationId_fkey" TO "ProfileCertification_master_certification_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProfileCertification" RENAME CONSTRAINT "ProfileCertification_profileId_fkey" TO "ProfileCertification_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProfileSkill" RENAME CONSTRAINT "ProfileSkill_masterSkillId_fkey" TO "ProfileSkill_master_skill_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProfileSkill" RENAME CONSTRAINT "ProfileSkill_profileId_fkey" TO "ProfileSkill_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "Program" RENAME CONSTRAINT "Program_trainingProviderId_fkey" TO "Program_training_provider_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProgramSkill" RENAME CONSTRAINT "ProgramSkill_programId_fkey" TO "ProgramSkill_program_id_fkey";

-- RenameForeignKey
ALTER TABLE "ProgramSkill" RENAME CONSTRAINT "ProgramSkill_skillId_fkey" TO "ProgramSkill_skill_id_fkey";

-- RenameForeignKey
ALTER TABLE "Recruiter" RENAME CONSTRAINT "Recruiter_employerId_fkey" TO "Recruiter_employer_id_fkey";

-- RenameForeignKey
ALTER TABLE "Recruiter" RENAME CONSTRAINT "Recruiter_userId_fkey" TO "Recruiter_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "Reference" RENAME CONSTRAINT "Reference_authorProfileId_fkey" TO "Reference_author_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "Reference" RENAME CONSTRAINT "Reference_seekerProfileId_fkey" TO "Reference_seeker_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "Reference" RENAME CONSTRAINT "Reference_trainingProviderId_fkey" TO "Reference_training_provider_id_fkey";

-- RenameForeignKey
ALTER TABLE "SeekerInvite" RENAME CONSTRAINT "SeekerInvite_programId_fkey" TO "SeekerInvite_program_id_fkey";

-- RenameForeignKey
ALTER TABLE "SeekerInvite" RENAME CONSTRAINT "SeekerInvite_trainingProviderId_fkey" TO "SeekerInvite_training_provider_id_fkey";

-- RenameForeignKey
ALTER TABLE "SeekerTrainingProvider" RENAME CONSTRAINT "SeekerTrainingProvider_programId_fkey" TO "SeekerTrainingProvider_program_id_fkey";

-- RenameForeignKey
ALTER TABLE "SeekerTrainingProvider" RENAME CONSTRAINT "SeekerTrainingProvider_trainingProviderId_fkey" TO "SeekerTrainingProvider_training_provider_id_fkey";

-- RenameForeignKey
ALTER TABLE "SeekerTrainingProvider" RENAME CONSTRAINT "SeekerTrainingProvider_userId_fkey" TO "SeekerTrainingProvider_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "Session" RENAME CONSTRAINT "Session_userId_fkey" TO "Session_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "Skills" RENAME CONSTRAINT "Skills_profileId_fkey" TO "Skills_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "Story" RENAME CONSTRAINT "Story_profileId_fkey" TO "Story_profile_id_fkey";

-- RenameForeignKey
ALTER TABLE "Testimonial" RENAME CONSTRAINT "Testimonial_jobId_fkey" TO "Testimonial_job_id_fkey";

-- RenameForeignKey
ALTER TABLE "TrainingProviderInvite" RENAME CONSTRAINT "TrainingProviderInvite_trainingProviderId_fkey" TO "TrainingProviderInvite_training_provider_id_fkey";

-- RenameForeignKey
ALTER TABLE "TrainingProviderProfile" RENAME CONSTRAINT "TrainingProviderProfile_trainingProviderId_fkey" TO "TrainingProviderProfile_training_provider_id_fkey";

-- RenameForeignKey
ALTER TABLE "TrainingProviderProfile" RENAME CONSTRAINT "TrainingProviderProfile_userId_fkey" TO "TrainingProviderProfile_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "UserRoles" RENAME CONSTRAINT "UserRoles_roleId_fkey" TO "UserRoles_role_id_fkey";

-- RenameForeignKey
ALTER TABLE "UserRoles" RENAME CONSTRAINT "UserRoles_userId_fkey" TO "UserRoles_user_id_fkey";

-- RenameIndex
ALTER INDEX "Account_provider_providerAccountId_key" RENAME TO "Account_provider_provider_account_id_key";

-- RenameIndex
ALTER INDEX "OnboardingSession_userId_key" RENAME TO "OnboardingSession_user_id_key";

-- RenameIndex
ALTER INDEX "Profile_userId_key" RENAME TO "Profile_user_id_key";

-- RenameIndex
ALTER INDEX "Session_sessionToken_key" RENAME TO "Session_session_token_key";

-- RenameIndex
ALTER INDEX "TempUser_onboardingSessionId_key" RENAME TO "TempUser_onboarding_session_id_key";

-- RenameIndex
ALTER INDEX "TrainingProviderProfile_userId_key" RENAME TO "TrainingProviderProfile_user_id_key";

-- RenameIndex
ALTER INDEX "User_onboardingSessionId_key" RENAME TO "User_onboarding_session_id_key";
