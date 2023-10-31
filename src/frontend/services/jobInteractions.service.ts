import axios from 'axios'
import { http } from '../http-common'
import { JobInteraction } from '@prisma/client'

// const getOne = async (jobInteractionId: string) => {
//   const res = await http.get<JobInteraction>(`/api/jobInteractions/${jobInteractionId}`)
//   return res.data
// }

const update = async (jobInteraction: Partial<JobInteraction>) => {
  const res = await http.put<JobInteraction>(
    `/api/jobInteractions/${jobInteraction.id}`,
    jobInteraction,
  )
  return res.data
}

const create = async (jobInteraction: Partial<JobInteraction>) => {
  const res = await http.post<JobInteraction>(`/api/jobInteractions`, jobInteraction)
  return res.data
}

const apply = async (jobId: string, token: string) => {
  // const res = await http.post(`/api/jobs/${jobId}/apply`)
  const res = await axios.create({ withCredentials: false }).post(
    `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/apply`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )

  return res.data
}

export const FrontendJobInteractionsService = {
  apply,
  create,
  update,
}
