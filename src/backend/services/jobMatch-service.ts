import {
  PrismaClient,
  Job,
  JobInteraction,
  MasterSkill,
  ProfileSkill,
  DesiredSkill,
  Employer,
} from '@prisma/client'

const prisma = new PrismaClient()

type OneJobPosting = {
  desiredSkills: {
    id: string
    masterSkillId: string
    masterSkill: MasterSkill
  }[]
  jobInteractions?: {
    percentMatch: number
    id: string
  }
  employer: Employer
} & Job

export async function matchJobsToUser(userId: string): Promise<OneJobPosting[]> {
  // Query for the current users relevant info (skills)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: { include: { profileSkills: true } }, onboardingSession: true },
  })

  if (!user || !user.profile || !user.profile.profileSkills) {
    return [] // Handle the case when user, user.profile, or user.profile.skills is null or undefined
  }

  // Query for all jobs that are not marked hidden
  const jobPostings = await prisma.job.findMany({
    where: { hide_job: false },
    include: {
      desiredSkills: { include: { masterSkill: true } },
      employer: true,
      desiredCertifications: { include: { masterCertification: true } },
    },
  })

  //  Query for all JobInteractions associated with the user
  const jobInteractions = await prisma.jobInteraction.findMany({
    where: { user_id: userId },
  })

  const matchedJobs: OneJobPosting[] = []
  const onboardingSessionResponses = user.onboardingSession?.responses as {
    opportunityInterests: { response: string[] }
  }
  const opportunityInterests = onboardingSessionResponses?.opportunityInterests?.response

  // Iterate through jobs array and perform the following:
  for (const job of jobPostings) {
    // calculate a % match value between job desired skills and user profile skills
    const matchPercentage = calculateMatchPercentage(
      user.profile.profileSkills,
      opportunityInterests.map((interest) => interest.toLowerCase()),
      job.desiredSkills,
      job.industry,
    )

    // check if the user already has a jobInteractions table with this job by filtering the users jobInteraction[] array with the job id.
    const existingJobInteraction = jobInteractions.find(
      (interaction) => interaction.job_id === job.id,
    )

    // create or update the jobInteractions table with this % match
    if (existingJobInteraction && existingJobInteraction.id) {
      await prisma.jobInteraction.upsert({
        where: {
          id: existingJobInteraction.id,
        },
        create: {
          user_id: userId,
          job_id: job.id,
          percent_match: matchPercentage,
          has_viewed: false,
          intent_to_apply: false,
        },
        // update jobInteractions table
        update: {
          percent_match: matchPercentage,
        },
      })
    }

    if (existingJobInteraction == undefined) {
      await prisma.jobInteraction.create({
        data: {
          user_id: userId,
          job_id: job.id,
          percent_match: matchPercentage,
          has_viewed: false,
          intent_to_apply: false,
        },
      })
    }

    // Add the job to the matchedJobs array only if intentToApply is false
    if (
      !existingJobInteraction ||
      (existingJobInteraction && existingJobInteraction.intent_to_apply == false)
    )
      matchedJobs.push({
        ...job,
        desiredSkills: job.desiredSkills.map((skill) => ({
          id: skill.id,
          masterSkillId: skill.master_skill_id,
          masterSkill: skill.masterSkill,
        })),
        jobInteractions: existingJobInteraction
          ? { percentMatch: matchPercentage, id: existingJobInteraction.id }
          : undefined,
      })
  }

  // Sort jobs from greatest % match to lowest
  matchedJobs.sort((a, b) => {
    const matchA = getJobMatchPercentage(a)
    const matchB = getJobMatchPercentage(b)
    return matchB - matchA
  })

  // Implement the "skip" here
  // pass in query string for skip quantity

  // Return the jobs
  return matchedJobs
}

function calculateMatchPercentage(
  userSkills: ProfileSkill[],
  opportunityInterests: string[],
  desiredSkills: DesiredSkill[],
  industry: string[],
): number {
  if (opportunityInterests.length > 0 && industry.length > 0) {
    const industryMatch = industry.some((industry) => {
      return opportunityInterests.includes(industry.toLowerCase())
    })

    if (industryMatch) return 1
  }

  const userSkillIds = Array.from(new Set(userSkills.map((skill) => skill.master_skill_id)))
  const desiredSkillIds = desiredSkills.map((skill) => skill.master_skill_id)

  // if desiredSkills.length = 0. return 0
  if (desiredSkillIds.length == 0) return 0

  const commonSkillIds = userSkillIds.filter((skillId) => desiredSkillIds.includes(skillId))
  const matchPercentage = (commonSkillIds.length / desiredSkillIds.length) * 100

  // Round the number to the nearest whole integer
  const roundedPercentage = Math.round(matchPercentage)

  return roundedPercentage
}

function getJobMatchPercentage(job: OneJobPosting): number {
  // Retrieve the match percentage from the job object
  return job.jobInteractions?.percentMatch || 0
}
