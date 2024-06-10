import { get } from '../http-common'

export type MasterSkill = {
  id: string
  skill: string
  type: 'PERSONAL' | 'TECHNICAL'
}

const getAll = async () => {
  const res = await get(`/master_skills`)

  return res.data
}

export const FrontendMasterSkillsService = {
  getAll,
}
