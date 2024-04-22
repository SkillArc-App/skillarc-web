import { JobWithSeekerStatus } from '@/app/components/JobCard'
import { get } from '../http-common'
import { MasterCertification } from './certification.service'
import { Employer } from './employer.service'
import { MasterSkill } from './skills.service'

export type CareerPath = {
  id: string
  title: string
  upperLimit: string
  lowerLimit: string
  order: number
}

export type JobPhoto = {
  id: string
  photoUrl: string
  jobId: string
}

export type Testimonial = {
  id: string
  name: string
  title: string
  testimonial: string
  photoUrl: string | null
}

export type AdminJob = {
  id: string
  benefitsDescription: string
  responsibilitiesDescription: string | null
  employmentTitle: string
  location: string
  employmentType: 'FULLTIME' | 'PARTTIME'
  hideJob: boolean
  schedule: string | null
  workDays: string | null
  requirementsDescription: string | null
  industry: string[]
  createdAt: string
  category: 'marketplace' | 'staffing'
  employer: Employer
  learnedSkills: {
    id: string
    masterSkill: MasterSkill
  }[]
  desiredSkills: {
    id: string
    masterSkill: MasterSkill
  }[]
  desiredCertifications: {
    id: string
    masterCertification: MasterCertification
  }[]
  careerPaths: CareerPath[]
  jobPhotos: JobPhoto[]
  jobTag: {
    id: string
    tag: {
      id: string
      name: string
    }
  }[]
  numberOfApplicants: number
  testimonials: Testimonial[]
}

export type Job = {
  id: string
  benefitsDescription: string
  responsibilitiesDescription: string | null
  employmentTitle: string
  location: string
  employmentType: 'FULLTIME' | 'PARTTIME'
  schedule: string | null
  workDays: string | null
  requirementsDescription: string | null
  category: 'marketplace' | 'staffing'
  employer: Employer
  learnedSkills: {
    id: string
    masterSkill: MasterSkill
  }[]
  desiredSkills: {
    id: string
    masterSkill: MasterSkill
  }[]
  desiredCertifications: {
    id: string
    masterCertification: MasterCertification
  }[]
  careerPaths: CareerPath[]
  jobPhotos: JobPhoto[]
  jobTag: {
    id: string
    tag: {
      id: string
      name: string
    }
  }[]
  testimonials: Testimonial[]
}

const getOne = async (jobId: string) => {
  const res = await get<Job>(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`)

  return res.data
}

const getJobMatches = async (token: string) => {
  const res = await get<{ matchedJobs: JobWithSeekerStatus[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/job_matches`,
    token,
  )

  return res.data
}

export const FrontendJobService = {
  getOne,
  getJobMatches,
}
