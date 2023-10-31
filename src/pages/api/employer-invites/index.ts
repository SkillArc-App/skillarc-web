import { getEmployerInvites } from '@/backend/handlers/employer-invite-handler'
import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    GET: getEmployerInvites,
  })
}
