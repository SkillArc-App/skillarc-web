import { Skill } from '@/common/types/Profile'
import axios from 'axios'

export type ProfileSkill = {
  id: string
  description: string | null
}

const create = async (profileSkill: Partial<ProfileSkill>, profileId: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .post<Skill>(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/skills`, profileSkill, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

const update = async (profileSkill: Partial<ProfileSkill>, profileId: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .put<Skill>(
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
    .delete<Skill>(
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
