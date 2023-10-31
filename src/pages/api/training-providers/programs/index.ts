import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { getProgramsForTrainingProvider } from '@/backend/handlers/program-handler'
import {
  createTrainingProvider,
  getTrainingProviders,
} from '@/backend/handlers/training-provider-handler'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    GET: getProgramsForTrainingProvider,
  })
}
