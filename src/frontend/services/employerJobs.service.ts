import { get } from '@/frontend/http-common'

export type Applicant = {
  id: string
  chatEnabled: boolean
  certifiedBy?: string
  createdAt: string
  jobId: string
  jobName: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  profileLink: string
  programs: any[]
  status: string
  statusReasons: string[]
}

export type Job = {
  id: string
  employerId: string
  employerName: string
  name: string
  description: string
}

const getJobs = async (token: string) => {
  const res = await get<{ jobs: Job[]; applicants: Applicant[] }>(
    `${process.env.NEXT_PUBLIC_API_URL}/employers/jobs`,
    token
  )

  return res.data
}

export const FrontendEmployerJobsService = {
  get: getJobs,
}
