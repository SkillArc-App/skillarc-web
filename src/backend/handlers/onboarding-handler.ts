import { NextApiRequest, NextApiResponse } from 'next'
import { APIOnboardingService } from '../services/onboarding-service'

// POST /users/{userId}/onboardingSessions
export const createOnboardingSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const userId = query.userId as string // called from /users/{userId}/onboardingSessions
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    // const updated = await APIOnboardingService.createOnboardingSession(userId, req.body)
    res.status(201).json({})
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not create' })
  }
}

// PUT /users/{userId}/onboardingSessions/{onboardingSessionId}
export const updateOnboardingSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const userId = query.userId as string // called from  /users/{userId}/onboardingSessions/{onboardingSessionId}
  const onboardingSessionId = query.onboardingSessionId as string // called from  /users/{userId}/onboardingSessions/{onboardingSessionId}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const updated = await APIOnboardingService.updateOnboardingSession(
      userId,
      onboardingSessionId,
      req.body,
    )
    res.status(200).json(updated)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not update' })
  }
}

// GET /users/{userId}/onboardingSessions/{onboardingSessionId}
export const getOnboardingSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const userId = query.userId as string // called from  /users/{userId}/onboardingSessions/{onboardingSessionId}
  const onboardingSessionId = query.onboardingSessionId as string // called from  /users/{userId}/onboardingSessions/{onboardingSessionId}
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  try {
    const item = await APIOnboardingService.getOnboardingSession(userId, onboardingSessionId)
    res.status(200).json(item)
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Could not get data' })
  }
}

// ------------------ temp onboarding handler ------------------
/**
 * This is the handler for the /api/profiles/{profileId}/onboarding route
 */
export const updateOneProfileOnboarding = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.profileId as string
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const updated = await APIOnboardingService.onboardingUpdate(id, req.body)

  if (updated) {
    res.status(200).json(updated)
  } else {
    res.status(400).json({ message: 'Could not update' })
  }
}
