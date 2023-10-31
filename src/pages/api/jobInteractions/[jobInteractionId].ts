// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { updateOneJobInteraction } from '@/backend/handlers/jobInteraction-handler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    // GET: getOneJobInteraction
    PUT: updateOneJobInteraction,
  })
}
