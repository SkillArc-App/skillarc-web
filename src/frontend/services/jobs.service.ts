import { OneMatchedJobPosting } from '@/pages/jobs'
import {
  CareerPath,
  Employer,
  Job,
  JobPhoto,
  MasterCertification,
  MasterSkill,
  Testimonial,
} from '@prisma/client'
import axios from 'axios'

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
