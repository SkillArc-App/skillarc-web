import { PersonalExperience } from '@prisma/client'
import { http } from '../http-common'
import axios from 'axios'

const create = async (
  personalExperience: Partial<PersonalExperience>,
  profileId: string,
  token: string,
) => {
  const res = await axios
    .create({ withCredentials: false })
    .post(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/personal_experiences`,
      personalExperience,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

const update = async (
  personalExperience: Partial<PersonalExperience>,
  profileId: string,
  token: string,
) => {
  const res = await axios
    .create({ withCredentials: false })
    .put(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/personal_experiences/${personalExperience.id}`,
      personalExperience,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

const deleteOne = async (personalExperienceId: string, profileId: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .delete(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/personal_experiences/${personalExperienceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

export const FrontendPersonalExperiencesService = {
  update,
  create,
  deleteOne,
}
