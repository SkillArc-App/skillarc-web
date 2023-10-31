import { NextApiRequest, NextApiResponse } from 'next'
import { APIProfileService } from '../services/profile-service'

// GET /profiles/{profileId}
export const getOneProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.profileId as string
  const user = await APIProfileService.findOne(id)
  return res.status(200).json(user)
}

// POST /users/{userId}/profiles
export const createProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.userId as string // called from /users/{userId}/profiles
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const created = await APIProfileService.create(req.body)

  if (created) {
    res.status(201).json(created)
  } else {
    res.status(400).json({ message: 'Could not update' })
  }
}

export const getProfiles = async (req: NextApiRequest, res: NextApiResponse) => {
  const profiles = await APIProfileService.findMany()

  return res.status(200).json(profiles)
}

// POST /profiles/{profileId}/preferences
export const createPreferences = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/prefernces
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.addPreferences(profileId, req.body)
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// PUT /profiles/{profileId}/preferences
export const updatePreferences = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.profileId as string // called from /profiles/{profileId}/preferences
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.updatePreferences(id, req.body)
    res.status(200).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// PUT /profiles/{profileId}
export const updateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.profileId as string // called from /profiles/{profileId}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.updateProfile(id, req.body)
    res.status(200).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// POST /profiles/{profileId}/stories
export const createStory = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/stories
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.addStory(profileId, req.body)
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// POST /profiles/{profileId}/stories/{storyId}
export const updateStory = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/stories/{storyId}
  const storyId = query.storyId as string // called from /profiles/{profileId}/stories/{storyId}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.updateStory(profileId, storyId, req.body)
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// DELETE /profiles/{profileId}/stories/{storyId}
export const deleteStory = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/stories/{storyId}
  const storyId = query.storyId as string // called from /profiles/{profileId}/stories/{storyId}
  try {
    const updated = await APIProfileService.deleteStory(profileId, storyId)
    res.status(204).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not delete' })
  }
}

// POST /profiles/{profileId}/skills
export const createSkill = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/skills
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.createSkill(profileId, req.body)
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// PUT /profiles/{profileId}/skills/{skillId}
export const updateSkill = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/skills/{skillId}
  const skillId = query.skillId as string // called from /profiles/{profileId}/skills/{skillId}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.updateSkill(profileId, skillId, req.body)
    res.status(200).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// DELETE /profiles/{profileId}/skills/{skillId}
export const deleteSkill = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/skills/{skillId}
  const skillId = query.skillId as string // called from /profiles/{profileId}/skills/{skillId}
  try {
    const updated = await APIProfileService.deleteSkill(profileId, skillId)
    res.status(204).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not delete' })
  }
}

// POST /profiles/{profileId}/otherexperiences
export const createOtherExperience = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/otherexperiences
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.createOtherExpereince(profileId, req.body)
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// PUT /profiles/{profileId}/otherexperiences/{otherExperienceId}
export const updateOtherExperience = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/otherexperiences/{otherExperienceId}
  const otherExperienceId = query.otherExperienceId as string // called from /profiles/{profileId}/otherexperiences/{otherExperienceId}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.updateOtherExperience(
      profileId,
      otherExperienceId,
      req.body,
    )
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// DELETE /profiles/{profileId}/otherexperiences/{otherExperienceId}
export const deleteOtherExperience = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/otherexperiences/{otherExperienceId}
  const otherExperienceId = query.otherExperienceId as string // called from /profiles/{profileId}/otherexperiences/{otherExperienceId}
  try {
    const updated = await APIProfileService.deleteOtherExperience(profileId, otherExperienceId)
    res.status(204).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not delete' })
  }
}

export const createPersonalExperience = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.profileId as string // called from /profiles/{profileId}/personalExperience
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const created = await APIProfileService.createPersonalExperience(id, req.body)

  if (created) {
    res.status(201).json(created)
  } else {
    res.status(400).json({ message: 'Could not update' })
  }
}

export const updatePersonalExperience = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.id as string // called from /profiles/{profileId}/personalExperience/{id}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const updated = await APIProfileService.updatePersonalExperience(id, req.body)

  if (updated) {
    res.status(200).json(updated)
  } else {
    res.status(400).json({ message: 'Could not update' })
  }
}

export const deletePersonalExperience = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.id as string // called from /profiles/{profileId}/personalExperience/{id}

  try {
    const updated = await APIProfileService.deletePersonalExperience(id)
    res.status(204).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not delete' })
  }
}

// POST /profiles/{profileId}/educationExperiences
export const createEducationExperience = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/educationExperiences
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.createEducationExperiences(profileId, req.body)
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not create' })
  }
}

// PUT /profiles/{profileId}/educationExperiences/{educationExperiencesId}
export const updateEducationExperience = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/educationExperiences/{educationExperienceId}
  const educationExperienceId = query.educationExperienceId as string // called from /profiles/{profileId}/educationExperiences/{educationExperienceId}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIProfileService.updateEducationExperience(
      profileId,
      educationExperienceId,
      req.body,
    )
    res.status(201).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// DELETE /profiles/{profileId}/educationExperiences/{educationExperienceId}
export const deleteEducationExperience = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const profileId = query.profileId as string // called from /profiles/{profileId}/educationExperiences/{educationExperienceId}
  const educationExperienceId = query.educationExperienceId as string // called from /profiles/{profileId}/educationExperiences/{educationExperienceId}
  try {
    const updated = await APIProfileService.deleteEducationExperience(
      profileId,
      educationExperienceId,
    )
    res.status(204).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not delete' })
  }
}
