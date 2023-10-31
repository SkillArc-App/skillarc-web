import { prisma } from '@/backend/db/client'

export default async function resetDB() {
  await prisma.seekerInvite.deleteMany({})
  await prisma.seeker_training_provider_program_statuses.deleteMany({})

  await prisma.desiredCertification.deleteMany({})
  await prisma.learnedSkill.deleteMany({})
  await prisma.desiredSkill.deleteMany({})
  await prisma.programSkill.deleteMany({})
  await prisma.story.deleteMany({})

  await prisma.applicantStatus.deleteMany({})
  await prisma.applicant.deleteMany({})

  await prisma.recruiter.deleteMany({})
  await prisma.userRoles.deleteMany({})
  await prisma.role.deleteMany({})

  await prisma.careerPath.deleteMany({})
  await prisma.jobPhoto.deleteMany({})
  await prisma.testimonial.deleteMany({})
  await prisma.jobTag.deleteMany({})
  await prisma.job.deleteMany({})

  await prisma.employer.deleteMany({})

  await prisma.masterCertification.deleteMany({})
  await prisma.profileSkill.deleteMany({})
  await prisma.masterSkill.deleteMany({})

  await prisma.personalExperience.deleteMany({})
  await prisma.otherExperience.deleteMany({})
  await prisma.educationExperience.deleteMany({})
  await prisma.professionalInterests.deleteMany({})
  await prisma.program.deleteMany({})
  await prisma.reference.deleteMany({})
  await prisma.seekerTrainingProvider.deleteMany({})
  await prisma.trainingProviderProfile.deleteMany({})

  await prisma.trainingProvider.deleteMany({})
  await prisma.onboardingSession.deleteMany({})
  await prisma.profile.deleteMany({})
  return await prisma.user.deleteMany({})
}
