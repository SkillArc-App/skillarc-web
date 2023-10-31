import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { createTrainingProviderInvites } from '@/backend/handlers/training-provider-invite-handler'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    POST: createTrainingProviderInvites,
  })
}
