import axios from 'axios'

export type ProfileSkill = {
  id: string
  master_skill_id: string
  profile_id: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export type Skills = {
  id: string
  name: string | null
  type: string | null
  profile_id: string
  description: string | null
  created_at: Date
  updated_at: Date
}

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
