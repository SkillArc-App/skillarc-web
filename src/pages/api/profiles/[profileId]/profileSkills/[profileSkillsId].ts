// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { deleteProfileSkills, updateProfileSkills } from '@/backend/handlers/profileSkills-handler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    PUT: updateProfileSkills,
    DELETE: deleteProfileSkills,
  })
}
