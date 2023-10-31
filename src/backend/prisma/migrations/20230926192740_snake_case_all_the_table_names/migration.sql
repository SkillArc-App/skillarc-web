ALTER TABLE "public"."Account" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "public"."Account" RENAME COLUMN "providerAccountId" TO "provider_account_id";

ALTER TABLE "public"."Session" RENAME COLUMN "sessionToken" TO "session_token";
ALTER TABLE "public"."Session" RENAME COLUMN "userId" TO "user_id";

ALTER TABLE "public"."User" RENAME COLUMN "emailVerified" TO "email_verified";
ALTER TABLE "public"."User" RENAME COLUMN "firstName" TO "first_name";
ALTER TABLE "public"."User" RENAME COLUMN "lastName" TO "last_name";
ALTER TABLE "public"."User" RENAME COLUMN "zipCode" TO "zip_code";
ALTER TABLE "public"."User" RENAME COLUMN "phoneNumber" TO "phone_number";
ALTER TABLE "public"."User" RENAME COLUMN "onboardingSessionId" TO "onboarding_session_id";
ALTER TABLE "public"."User" RENAME COLUMN "userType" TO "user_type";

ALTER TABLE "public"."UserRoles" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "public"."UserRoles" RENAME COLUMN "roleId" TO "role_id";

ALTER TABLE "public"."TempUser" RENAME COLUMN "emailVerified" TO "email_verified";
ALTER TABLE "public"."TempUser" RENAME COLUMN "firstName" TO "first_name";
ALTER TABLE "public"."TempUser" RENAME COLUMN "lastName" TO "last_name";
ALTER TABLE "public"."TempUser" RENAME COLUMN "zipCode" TO "zip_code";
ALTER TABLE "public"."TempUser" RENAME COLUMN "phoneNumber" TO "phone_number";
ALTER TABLE "public"."TempUser" RENAME COLUMN "onboardingSessionId" TO "onboarding_session_id";

ALTER TABLE "public"."Profile" RENAME COLUMN "userId" TO "user_id";

ALTER TABLE "public"."NetworkInterests" RENAME COLUMN "profileId" TO "profile_id";

ALTER TABLE "public"."ProfessionalInterests" RENAME COLUMN "profileId" TO "profile_id";

ALTER TABLE "public"."DesiredOutcomes" RENAME COLUMN "profileId" TO "profile_id";

ALTER TABLE "public"."Credential" RENAME COLUMN "profileId" TO "profile_id";
ALTER TABLE "public"."Credential" RENAME COLUMN "organizationId" TO "organization_id";
ALTER TABLE "public"."Credential" RENAME COLUMN "issueDate" TO "issue_date";

ALTER TABLE "public"."OtherExperience" RENAME COLUMN "organizationId" TO "organization_id";
ALTER TABLE "public"."OtherExperience" RENAME COLUMN "organizationName" TO "organization_name";
ALTER TABLE "public"."OtherExperience" RENAME COLUMN "profileId" TO "profile_id";
ALTER TABLE "public"."OtherExperience" RENAME COLUMN "startDate" TO "start_date";
ALTER TABLE "public"."OtherExperience" RENAME COLUMN "isCurrent" TO "is_current";
ALTER TABLE "public"."OtherExperience" RENAME COLUMN "endDate" TO "end_date";

ALTER TABLE "public"."EducationExperience" RENAME COLUMN "organizationId" TO "organization_id";
ALTER TABLE "public"."EducationExperience" RENAME COLUMN "organizationName" TO "organization_name";
ALTER TABLE "public"."EducationExperience" RENAME COLUMN "profileId" TO "profile_id";
ALTER TABLE "public"."EducationExperience" RENAME COLUMN "graduationDate" TO "graduation_date";

ALTER TABLE "public"."PersonalExperience" RENAME COLUMN "profileId" TO "profile_id";
ALTER TABLE "public"."PersonalExperience" RENAME COLUMN "startDate" TO "start_date";
ALTER TABLE "public"."PersonalExperience" RENAME COLUMN "endDate" TO "end_date";

ALTER TABLE "public"."OnboardingSession" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "public"."OnboardingSession" RENAME COLUMN "startedAt" TO "started_at";
ALTER TABLE "public"."OnboardingSession" RENAME COLUMN "completedAt" TO "completed_at";
ALTER TABLE "public"."OnboardingSession" RENAME COLUMN "currentStep" TO "current_step";

ALTER TABLE "public"."ProfileSkill" RENAME COLUMN "masterSkillId" TO "master_skill_id";
ALTER TABLE "public"."ProfileSkill" RENAME COLUMN "profileId" TO "profile_id";

ALTER TABLE "public"."Skills" RENAME COLUMN "profileId" TO "profile_id";

ALTER TABLE "public"."Story" RENAME COLUMN "profileId" TO "profile_id";

ALTER TABLE "public"."Job" RENAME COLUMN "employerId" TO "employer_id";
ALTER TABLE "public"."Job" RENAME COLUMN "benefitsDescription" TO "benefits_description";
ALTER TABLE "public"."Job" RENAME COLUMN "responsibilitiesDescription" TO "responsibilities_description";
ALTER TABLE "public"."Job" RENAME COLUMN "employmentTitle" TO "employment_title";
ALTER TABLE "public"."Job" RENAME COLUMN "employmentType" TO "employment_type";
ALTER TABLE "public"."Job" RENAME COLUMN "hideJob" TO "hide_job";
ALTER TABLE "public"."Job" RENAME COLUMN "workDays" TO "work_days";
ALTER TABLE "public"."Job" RENAME COLUMN "requirementsDescription" TO "requirements_description";


ALTER TABLE "public"."JobInteraction" RENAME COLUMN "jobId" TO "job_id";
ALTER TABLE "public"."JobInteraction" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "public"."JobInteraction" RENAME COLUMN "hasViewed" TO "has_viewed";
ALTER TABLE "public"."JobInteraction" RENAME COLUMN "percentMatch" TO "percent_match";
ALTER TABLE "public"."JobInteraction" RENAME COLUMN "intentToApply" TO "intent_to_apply";

ALTER TABLE "public"."JobTag" RENAME COLUMN "jobId" TO "job_id";
ALTER TABLE "public"."JobTag" RENAME COLUMN "tagId" TO "tag_id";

ALTER TABLE "public"."Applicant" RENAME COLUMN "jobId" TO "job_id";
ALTER TABLE "public"."Applicant" RENAME COLUMN "profileId" TO "profile_id";

ALTER TABLE "public"."ApplicantStatus" RENAME COLUMN "applicantId" TO "applicant_id";

ALTER TABLE "public"."Recruiter" RENAME COLUMN "userId" to "user_id";
ALTER TABLE "public"."Recruiter" RENAME COLUMN "employerId" to "employer_id";

ALTER TABLE "public"."JobPhoto" RENAME COLUMN "photoUrl" to "photo_url";
ALTER TABLE "public"."JobPhoto" RENAME COLUMN "jobId" to "job_id";

ALTER TABLE "public"."CareerPath" RENAME COLUMN "upperLimit" TO "upper_limit";
ALTER TABLE "public"."CareerPath" RENAME COLUMN "lowerLimit" TO "lower_limit";
ALTER TABLE "public"."CareerPath" RENAME COLUMN "jobId" TO "job_id";

ALTER TABLE "public"."Testimonial" RENAME COLUMN "jobId" TO "job_id";
ALTER TABLE "public"."Testimonial" RENAME COLUMN "photoUrl" TO "photo_url";

ALTER TABLE "public"."LearnedSkill" RENAME COLUMN "masterSkillId" TO "master_skill_id";
ALTER TABLE "public"."LearnedSkill" RENAME COLUMN "jobId" TO "job_id";

ALTER TABLE "public"."DesiredSkill" RENAME COLUMN "masterSkillId" to "master_skill_id";
ALTER TABLE "public"."DesiredSkill" RENAME COLUMN "jobId" to "job_id";

ALTER TABLE "public"."Employer" RENAME COLUMN "logoUrl" TO "logo_url";

ALTER TABLE "public"."DesiredCertification" RENAME COLUMN "masterCertificationId" TO "master_certification_id";
ALTER TABLE "public"."DesiredCertification" RENAME COLUMN "jobId" TO "job_id";

ALTER TABLE "public"."ProfileCertification" RENAME COLUMN "masterCertificationId" TO "master_certification_id";
ALTER TABLE "public"."ProfileCertification" RENAME COLUMN "profileId" TO "profile_id";

ALTER TABLE "public"."Program" RENAME COLUMN "trainingProviderId" TO "training_provider_id";

ALTER TABLE "public"."ProgramSkill" RENAME COLUMN "programId" TO "program_id";
ALTER TABLE "public"."ProgramSkill" RENAME COLUMN "skillId" TO "skill_id";

ALTER TABLE "public"."EmployerInvite" RENAME COLUMN "firstName" TO "first_name";
ALTER TABLE "public"."EmployerInvite" RENAME COLUMN "lastName" TO "last_name";
ALTER TABLE "public"."EmployerInvite" RENAME COLUMN "employerId" TO "employer_id";
ALTER TABLE "public"."EmployerInvite" RENAME COLUMN "usedAt" TO "used_at";

ALTER TABLE "public"."SeekerInvite" RENAME COLUMN "firstName" TO "first_name";
ALTER TABLE "public"."SeekerInvite" RENAME COLUMN "lastName" TO "last_name";
ALTER TABLE "public"."SeekerInvite" RENAME COLUMN "programId" TO "program_id";
ALTER TABLE "public"."SeekerInvite" RENAME COLUMN "trainingProviderId" TO "training_provider_id";
ALTER TABLE "public"."SeekerInvite" RENAME COLUMN "usedAt" TO "used_at";

ALTER TABLE "public"."TrainingProviderInvite" RENAME COLUMN "firstName" TO "first_name";
ALTER TABLE "public"."TrainingProviderInvite" RENAME COLUMN "lastName" TO "last_name";
ALTER TABLE "public"."TrainingProviderInvite" RENAME COLUMN "roleDescription" TO "role_description";
ALTER TABLE "public"."TrainingProviderInvite" RENAME COLUMN "trainingProviderId" TO "training_provider_id";
ALTER TABLE "public"."TrainingProviderInvite" RENAME COLUMN "usedAt" TO "used_at";

ALTER TABLE "public"."SeekerTrainingProvider" RENAME COLUMN "programId" TO "program_id";
ALTER TABLE "public"."SeekerTrainingProvider" RENAME COLUMN "trainingProviderId" TO "training_provider_id";
ALTER TABLE "public"."SeekerTrainingProvider" RENAME COLUMN "userId" TO "user_id";

ALTER TABLE "public"."Reference" RENAME COLUMN "authorProfileId" TO "author_profile_id";
ALTER TABLE "public"."Reference" RENAME COLUMN "referenceText" TO "reference_text";
ALTER TABLE "public"."Reference" RENAME COLUMN "seekerProfileId" TO "seeker_profile_id";
ALTER TABLE "public"."Reference" RENAME COLUMN "trainingProviderId" TO "training_provider_id";

ALTER TABLE "public"."TrainingProviderProfile" RENAME COLUMN "trainingProviderId" TO "training_provider_id";
ALTER TABLE "public"."TrainingProviderProfile" RENAME COLUMN "userId" TO "user_id";
