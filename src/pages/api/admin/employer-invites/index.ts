import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { createEmployerInvite } from '@/backend/handlers/invite-handler'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    POST: createEmployerInvite,
  })
}
