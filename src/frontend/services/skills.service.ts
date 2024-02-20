import axios from 'axios'
import { http } from '../http-common'

export type MasterSkill = {
  id: string
  skill: string
  type: 'PERSONAL' | 'TECHNICAL'
}

const getOne = async (masterSkillId: string) => {
  const res = await http.get<MasterSkill>(`/api/masterSkills/${masterSkillId}`)
  return res.data
}

const getAll = async () => {
  const res = await axios
    .create({ withCredentials: false })
    .get(`${process.env.NEXT_PUBLIC_API_URL}/master_skills`)

  return res.data
}

export const FrontendMasterSkillsService = {
  getOne,
  getAll,
}
