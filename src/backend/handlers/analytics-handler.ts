import { NextApiRequest, NextApiResponse } from 'next'
import { APIAnalyticsService } from '../services/analytics-service'

export const createAnalyticsEvent = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const created = await APIAnalyticsService.create(req.body)
    res.status(201).json(created)
  } catch (e: any) {
    res.status(400).json({ message: 'Could not create analytics event', error: e.message })
  }
}
