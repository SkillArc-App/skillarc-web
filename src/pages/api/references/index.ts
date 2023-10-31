import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { newReference } from '@/backend/handlers/reference-handler'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    POST: newReference,
  })
}
