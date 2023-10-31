import { routeHandler } from '@/backend/handlers/handler-wrapper'
import {
  createOnboardingSession,
  getOnboardingSession,
  updateOnboardingSession,
} from '@/backend/handlers/new-onboarding-handler'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    POST: createOnboardingSession,
    PUT: updateOnboardingSession,
    GET: getOnboardingSession,
  })
}
