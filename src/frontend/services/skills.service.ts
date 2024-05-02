import { get } from '../http-common'

export type MasterSkill = {
  id: string
  skill: string
  type: 'PERSONAL' | 'TECHNICAL'
}

const getOne = async (masterSkillId: string) => {
  const res = await get<MasterSkill>(`/api/masterSkills/${masterSkillId}`)
  return res.data
}

const getAll = async () => {
  const res = await get(`/master_skills`)

  return res.data
}

export const FrontendMasterSkillsService = {
  getOne,
  getAll,
}
