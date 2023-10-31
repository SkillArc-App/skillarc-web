import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { getTrainingProvider } from '@/backend/handlers/training-provider-handler'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    GET: getTrainingProvider,
  })
}
