import { NextApiRequest, NextApiResponse } from 'next'
import { APIMasterCertificationService } from '../services/masterCertification-service'

export const getOneMasterCertification = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.masterCertificationId as string
  const masterCertification = await APIMasterCertificationService.findOne(id)
  return res.status(200).json(masterCertification)
}

export const getAllMasterCertifications = async (req: NextApiRequest, res: NextApiResponse) => {
  const masterCertifications = await APIMasterCertificationService.findMany()
  res.status(200).json(masterCertifications)
}
