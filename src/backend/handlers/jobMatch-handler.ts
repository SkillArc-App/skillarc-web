import { NextApiRequest, NextApiResponse } from 'next'
import { APIJobService } from '../services/job-service'
import { matchJobsToUser } from '../services/jobMatch-service'

export default async function getJobMatches(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const { userId } = req.query
    // const { query } = req
    const userId = req.body.userId
    console.log('userId', userId)
    // console.log('req.body', req.body.userId)

    if (typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    const matchedJobs = await matchJobsToUser(userId)

    return res.status(200).json({ matchedJobs })
  } catch (error) {
    console.error('Error matching jobs to user:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
