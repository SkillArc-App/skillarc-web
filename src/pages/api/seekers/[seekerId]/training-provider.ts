import type { NextApiRequest, NextApiResponse } from 'next'
import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { addTraininerProvider, updateTrainingProvider } from '@/backend/handlers/seeker-handler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    PUT: updateTrainingProvider,
    POST: addTraininerProvider,
  })
}
