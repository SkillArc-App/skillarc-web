import axios from 'axios'

export type Applicant = {
  id: string
  jobId: string
  jobName: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  profileLink: string
  programs: any[]
  status: string
}

export type Job = {
  id: string
  employerId: string
  employerName: string
  name: string
  description: string
}

const get = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<{ jobs: Job[]; applicants: Applicant[] }>(
      `${process.env.NEXT_PUBLIC_API_URL}/employers/jobs`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

  return res.data
}

export const FrontendEmployerJobsService = {
  get,
}
