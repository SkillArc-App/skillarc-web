import { Reference } from '@prisma/client'
import axios from 'axios'

const addReference = async (seekerProfileId: string, reference: string, token: string) => {
  const res = await axios.create({ withCredentials: false }).post<Reference>(
    `${process.env.NEXT_PUBLIC_API_URL}/references`,
    {
      reference,
      seeker_profile_id: seekerProfileId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return res.data
}

const getOne = async (referenceId: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<Reference>(`${process.env.NEXT_PUBLIC_API_URL}/references/${referenceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

  return res.data
}

const update = async (reference: Partial<Reference>, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .put<Reference>(`${process.env.NEXT_PUBLIC_API_URL}/references/${reference.id}`, reference, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

  return res.data
}

export const FrontendReferenceService = {
  getOne,
  addReference,
  update,
}
