// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { routeHandler } from '@/backend/handlers/handler-wrapper'
import {
  deleteProfileCertification,
  updateProfileCertification,
} from '@/backend/handlers/profileCertifications-handler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await routeHandler(req, res, {
    PUT: updateProfileCertification,
    DELETE: deleteProfileCertification,
  })
}
