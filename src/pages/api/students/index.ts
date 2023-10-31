import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { getStudents } from '@/backend/handlers/student-handler'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    GET: getStudents,
  })
}
