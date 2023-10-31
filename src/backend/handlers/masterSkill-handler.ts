import { NextApiRequest, NextApiResponse } from 'next'
import { APIMasterSkillService } from '../services/masterSkill-service'

export const getOneMasterSkill = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.masterSkillId as string
  const masterSkill = await APIMasterSkillService.findOne(id)
  return res.status(200).json(masterSkill)
}

export const getAllMasterSkills = async (req: NextApiRequest, res: NextApiResponse) => {
  const masterSkills = await APIMasterSkillService.findMany()
  res.status(200).json(masterSkills)
}
