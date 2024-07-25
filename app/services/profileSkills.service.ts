import { Skill } from 'app/common/types/Profile'
import { PartialRequired } from 'app/common/types/partial-required'
import { destroy, post, put } from '../http-common'

export type ProfileSkill = {
  id: string
  profileId: string
  masterSkillId: string
  description: string | null
}

const create = async (profileSkill: PartialRequired<ProfileSkill, 'profileId'>, token: string) => {
  const res = await post<Skill>(`/profiles/${profileSkill.profileId}/skills`, profileSkill, token)

  return res.data
}

const update = async (profileSkill: PartialRequired<ProfileSkill, 'profileId'>, token: string) => {
  const res = await put<Skill>(
    `/profiles/${profileSkill.profileId}/skills/${profileSkill.id}`,
    profileSkill,
    token,
  )

  return res.data
}

const deleteOne = async (
  { id, profileId }: PartialRequired<ProfileSkill, 'profileId' | 'id'>,
  token: string,
) => {
  const res = await destroy<Skill>(`/profiles/${profileId}/skills/${id}`, token)

  return res.data
}

export const FrontendProfileSkillsService = {
  create,
  update,
  deleteOne,
}
