import { NextApiRequest, NextApiResponse } from 'next'
import { APIProfileSkillsService } from '../services/profileSkills-service'

export const createProfileSkill = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileID}/profileSkills
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const created = await APIProfileSkillsService.create(req.body, profileId)

  if (created) {
    res.status(201).json(created)
  } else {
    res.status(400).json({ message: 'Could not update' })
  }
}

export const updateProfileSkills = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/profileSkills/{prodileSkillsId}
  const profileSkillsId = query.profileSkillsId as string // called from /profiles/{profileId}/profileSkills/{prodileSkillsId}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileSkillsService.updateProfileSkills(
      profileId,
      profileSkillsId,
      req.body,
    )
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// DELETE /profiles/{profileId}/otherexperiences/{otherExperienceId}
export const deleteProfileSkills = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/profileSkills/{prodileSkillsId}
  const profileSkillsId = query.profileSkillsId as string // called from /profiles/{profileId}/profileSkills/{prodileSkillsId}
  try {
    const updated = await APIProfileSkillsService.deleteProfileSkills(profileId, profileSkillsId)
    res.status(204).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not delete' })
  }
}
