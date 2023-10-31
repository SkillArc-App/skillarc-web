import { NextApiRequest, NextApiResponse } from 'next'
import { APITempUserService } from '../services/tempUser-service'

export const getOneTempUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const email = query.email as string
  const user = await APITempUserService.findOne(email)
  return res.status(200).json(user)
}
