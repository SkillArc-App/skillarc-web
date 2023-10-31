import { NextApiRequest, NextApiResponse } from 'next'
import { APIProfileCertificationService } from '../services/profileCertifications-service'

export const createProfileCertification = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileID}/profileCertifications
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const created = await APIProfileCertificationService.create(req.body, profileId)

  if (created) {
    res.status(201).json(created)
  } else {
    res.status(400).json({ message: 'Could not update' })
  }
}

export const updateProfileCertification = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/profileCertification/{prodileCertificationId}
  const profileCertificationId = query.profileCertificationId as string // called from /profiles/{profileId}/profileCertification/{prodileCertificationId}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileCertificationService.updateProfileCertification(
      profileId,
      profileCertificationId,
      req.body,
    )
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// DELETE /profiles/{profileId}/otherexperiences/{otherExperienceId}
export const deleteProfileCertification = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/profileCertification/{prodileCertificationId}
  const profileCertificationId = query.profileCertificationId as string // called from /profiles/{profileId}/profileCertification/{prodileCertificationId}
  try {
    const updated = await APIProfileCertificationService.deleteProfileCertification(
      profileId,
      profileCertificationId,
    )
    res.status(204).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not delete' })
  }
}
