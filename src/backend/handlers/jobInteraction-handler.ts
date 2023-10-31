import { NextApiRequest, NextApiResponse } from 'next'
import { APIJobInteractionService } from '../services/jobInteraction-service'

// PUT /jobInteractions/{jobInteractionId}
export const updateOneJobInteraction = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.jobInteractionId as string
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const updatedJobInteraction = await APIJobInteractionService.update(id, req.body)
  // if the jobInteraction was updated, return 200
  if (updatedJobInteraction) {
    res.status(200).json(updatedJobInteraction)
  } else {
    res.status(400).json({ message: 'Could not update job interaction' })
  }
}

// POST /jobInteractions
export const createOneJobInteraction = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const newJobInteraction = await APIJobInteractionService.create(req.body)
  // if the jobInteraction was created, return 200
  if (newJobInteraction) {
    res.status(200).json(newJobInteraction)
  } else {
    res.status(400).json({ message: 'Could not create job interaction' })
  }
}
