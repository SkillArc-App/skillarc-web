// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { routeHandler } from '@/backend/handlers/handler-wrapper'
import { createProfile, getProfiles } from '@/backend/handlers/profile-handler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    POST: createProfile,
    GET: getProfiles,
  })
}
