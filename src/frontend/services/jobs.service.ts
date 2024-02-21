import { OneMatchedJobPosting } from '@/app/components/JobCard'
import axios from 'axios'
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
  jobId: string
  createdAt: Date
  updatedAt: Date
}

export type Job = {
  id: string
  employerId: string
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
  createdAt: Date
  updatedAt: Date
}

export type JobPhoto = {
  id: string
  photoUrl: string
  jobId: string
  createdAt: Date
  updatedAt: Date
}

export type Testimonial = {
  id: string
  job_id: string
  name: string
  title: string
  testimonial: string
  photoUrl: string | null
  created_at: Date
  updated_at: Date
}

export type GetOneJobPosting = {
  employer: Employer
  learnedSkills: {
    id: string
    masterSkillId: string
    masterSkill: MasterSkill
  }[]
  desiredSkills: {
    id: string
    masterSkillId: string
    masterSkill: MasterSkill
  }[]
  desiredCertifications: {
    id: string
    masterCertificationId: string
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
} & Job

const getOne = async (jobId: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<GetOneJobPosting>(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`)

  return res.data
}

const getAll = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<GetOneJobPosting[]>(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

const getJobMatches = async (token: string) => {
  const res = await get<{ matchedJobs: OneMatchedJobPosting[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/job_matches`,
    token,
  )

  return res.data
}

export const FrontendJobService = {
  getOne,
  getAll,
  getJobMatches,
}
