// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { createJob, getAllJobs } from '@/backend/handlers/job-handler'
import getJobMatches from '@/backend/handlers/jobMatch-handler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    GET: getAllJobs,
    // POST: createJob,
    POST: createJob,
  })
}
