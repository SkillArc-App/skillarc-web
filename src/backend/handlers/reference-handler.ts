import { NextApiRequest, NextApiResponse } from 'next'
import { APIReferenceService } from '../services/reference-service'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from '../db/client'
import { getServerSession } from 'lib/auth-wrapper'

export const newReference = async (req: NextApiRequest, res: NextApiResponse) => {
  const { reference, seekerProfileId } = req.body

  const session = await getServerSession(req, res, authOptions)

  const authorProfile = await prisma.trainingProviderProfile.findUnique({
    where: {
      user_id: session?.user?.id,
    },
  })

  if (!authorProfile) return res.status(403)

  const created = APIReferenceService.createOne({
    seekerProfileId,
    authorProfileId: authorProfile.id,
    referenceText: reference,
    trainingProviderId: authorProfile.training_provider_id,
  })

  return res.status(200).json(created)
}

export const getOneReference = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.referenceId as string
  const reference = await APIReferenceService.findOne(id)
  return res.status(200).json(reference)
}

export const updateReference = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.referenceId as string
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const updatedReference = await APIReferenceService.updateOne(id, req.body)
  // if the reference was updated, return 200
  if (updatedReference) {
    res.status(200).json(updatedReference)
  } else {
    res.status(400).json({ message: 'Could not update reference' })
  }
}
