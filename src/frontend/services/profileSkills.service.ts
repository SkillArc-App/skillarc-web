import { ProfileSkill, Skills } from '@prisma/client'
import { http } from '../http-common'
import axios from 'axios'

const create = async (profileSkill: Partial<ProfileSkill>, profileId: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .post<Skills>(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/skills`, profileSkill, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

const update = async (profileSkill: Partial<ProfileSkill>, profileId: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .put<Skills>(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/skills/${profileSkill.id}`,
      profileSkill,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

  return res.data
}

const deleteOne = async (profileSkillId: string, profileId: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .delete<Skills>(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/skills/${profileSkillId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

  return res.data
}

export const FrontendProfileSkillsService = {
  create,
  update,
  deleteOne,
}
