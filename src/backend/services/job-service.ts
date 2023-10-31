import { employment_type } from '@prisma/client'
import { prisma } from '../db/client'

const apply = async ({ jobId, profileId }: { jobId: string; profileId: string }) => {
  return await prisma.applicant.create({
    data: {
      job_id: jobId,
      profile_id: profileId,
      statuses: {
        create: [
          {
            status: 'new',
          },
        ],
      },
    },
  })
}

const findOne = async (id: string) => {
  return await prisma.job.findUnique({
    where: {
      id: id,
    },
    include: {
      employer: true,
      careerPaths: true,
      jobPhotos: true,
      testimonials: true,
      desiredSkills: { include: { masterSkill: true } },
      learnedSkills: { include: { masterSkill: true } },
      jobTag: { include: { tag: true } },
      desiredCertifications: { include: { masterCertification: true } },
      jobInteractions: true,
    },
  })
}

const findMany = async () => {
  return await prisma.job.findMany({
    include: {
      employer: true,
    },
  })
}

const createPhoto = async (data: { photoUrl: string; jobId: string }) => {
  return await prisma.jobPhoto.create({
    data: {
      photo_url: data.photoUrl,
      job_id: data.jobId,
    },
  })
}

const createOne = async (data: {
  employerId: string
  benefitsDescription: string
  responsibilitiesDescription: string
  employmentTitle: string
  location: string
  employmentType: employment_type
  hideJob: boolean
  schedule: string
  workDays: string
  requirementsDescription: string
  industry: string
}) => {
  return await prisma.job.create({
    data: {
      employer_id: data.employerId,
      benefits_description: data.benefitsDescription,
      responsibilities_description: data.responsibilitiesDescription,
      employment_title: data.employmentTitle,
      location: data.location,
      employment_type: data.employmentType,
      hide_job: data.hideJob,
      schedule: data.schedule,
      work_days: data.workDays,
      requirements_description: data.requirementsDescription,
      industry: data.industry,
    },
  })
}

const updateOne = async (
  id: string,
  data: {
    employerId: string
    benefitsDescription: string
    responsibilitiesDescription: string
    employmentTitle: string
    location: string
    employmentType: employment_type
    hideJob: boolean
    schedule: string
    workDays: string
    requirementsDescription: string
    industry: string
  },
) => {
  return await prisma.job.update({
    where: {
      id: id,
    },
    data: {
      employer_id: data.employerId,
      benefits_description: data.benefitsDescription,
      responsibilities_description: data.responsibilitiesDescription,
      employment_title: data.employmentTitle,
      location: data.location,
      employment_type: data.employmentType,
      hide_job: data.hideJob,
      schedule: data.schedule,
      work_days: data.workDays,
      requirements_description: data.requirementsDescription,
      industry: data.industry,
    },
  })
}

const deleteOne = async (id: string) => {
  return await prisma.job.delete({
    where: {
      id: id,
    },
  })
}

export const APIJobService = {
  apply,
  findOne,
  findMany,
  createPhoto,
  createOne,
  updateOne,
  deleteOne,
}
