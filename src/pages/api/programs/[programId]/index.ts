import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { getProgram, updateProgram } from '@/backend/handlers/program-handler'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    GET: getProgram,
    PUT: updateProgram,
  })
}
