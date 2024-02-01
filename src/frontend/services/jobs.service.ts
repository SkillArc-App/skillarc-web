import { OneMatchedJobPosting } from '@/app/jobs/page'
import axios from 'axios'
import { MasterCertification } from './certification.service'
import { Employer } from './employer.service'
import { MasterSkill } from './skills.service'

export type CareerPath = {
  id: string
  title: string
  upper_limit: string
  lower_limit: string
  order: number
  job_id: string
  created_at: Date
  updated_at: Date
}

export type Job = {
  id: string
  employer_id: string
  benefits_description: string
  responsibilities_description: string | null
  employment_title: string
  location: string
  employment_type: 'FULLTIME' | 'PARTTIME'
  hide_job: boolean
  schedule: string | null
  work_days: string | null
  requirements_description: string | null
  industry: string[]
  created_at: Date
  updated_at: Date
}

export type JobPhoto = {
  id: string
  photo_url: string
  job_id: string
  created_at: Date
  updated_at: Date
}

export type Testimonial = {
  id: string
  job_id: string
  name: string
  title: string
  testimonial: string
  photo_url: string | null
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

interface JobQueryData {
  matchedJobs: OneMatchedJobPosting[]
}

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
  const res = await axios
    .create({ withCredentials: false })
    .get<{ matchedJobs: OneMatchedJobPosting[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/job_matches`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

  return res.data
}

export const FrontendJobService = {
  getOne,
  getAll,
  getJobMatches,
}
