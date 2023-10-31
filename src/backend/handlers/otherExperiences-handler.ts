import { NextApiRequest, NextApiResponse } from 'next'
import { APIOtherExperiencesService } from '../services/otherExperiences-service'

export const createOtherExperiences = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileID}/otherExperiences
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const created = await APIOtherExperiencesService.create(req.body, profileId)

  if (created) {
    res.status(201).json(created)
  } else {
    res.status(400).json({ message: 'Could not update' })
  }
}
