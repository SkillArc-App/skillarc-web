import { get } from '@/http-common'

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
  status: string
  statusReason: string
}

export type EmployerJob = {
  id: string
  employerId: string
  employerName: string
  name: string
  description: string
}

const getJobs = async (token: string) => {
  const res = await get<{ jobs: EmployerJob[]; applicants: Applicant[] }>(`/employers/jobs`, token)

  return res.data
}

export const FrontendEmployerJobsService = {
  get: getJobs,
}
