import { NextApiRequest, NextApiResponse } from 'next'
import { APIUserService } from '../services/user-service'
import { APITempUserService } from '../services/tempUser-service'
import { APIProfileService } from '../services/profile-service'
import { APIOnboardingService } from '../services/onboarding-service'
import { APIJobInteractionService } from '../services/jobInteraction-service'

export const getOneUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.userId as string
  const user = await APIUserService.findOne(id)
  return res.status(200).json(user)
}

export const updateOneUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.userId as string
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }
  const updatedUser = await APIUserService.update(id, req.body)
  // if the user was updated, return 200
  if (updatedUser) {
    res.status(200).json(updatedUser)
  } else {
    res.status(400).json({ message: 'Could not update user' })
  }
}

export const updateOneUserWithTempData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const id = query.id as string
  if (!req.body) {
    return res.status(400).json({ message: 'No body' })
  }

  // update the user with the temp data
  const updatedUser = await APIUserService.updateOneUserWithTempData(id, req.body)
  console.log('updatedUser', updatedUser)

  // grab the temp user
  if (updatedUser.email) {
    const tempUser = await APITempUserService.findOne(updatedUser.email)
    console.log('tempUser', tempUser)

    if (tempUser?.id) {
      // update old profile with new user id
      const profile = await APIProfileService.findOneByUserId(tempUser.id)
      console.log('profile', profile)
      if (profile) {
        let updatingProfileBody = {
          id: profile.id,
          userId: updatedUser.id,
        }
        const updatedProfile = await APIProfileService.updateProfile(
          profile.id,
          updatingProfileBody,
        )
        console.log('updatedProfile', updatedProfile)
      }
      // update old onboarding session with new user id
      const onboardingSession = await APIOnboardingService.getOnboardingSessionBuUserId(tempUser.id)
      console.log('onboardingSession', onboardingSession)
      if (onboardingSession) {
        let updatingOnboardingSessionBody = {
          id: onboardingSession.id,
          userId: updatedUser.id,
        }
        const updatedOnboardingSession = await APIOnboardingService.updateOnboardingSession(
          updatedUser.id,
          onboardingSession.id,
          updatingOnboardingSessionBody,
        )
        console.log('updatedOnboardingSession', updatedOnboardingSession)
      }
      // update old job interactions with new user id
      const updatedJobInteractions = await APIJobInteractionService.updateManyTempInteractions(
        updatedUser.id,
        tempUser.id,
      )
      console.log('updatedJobInteractions', updatedJobInteractions)

      // delete the temp user and old user
      const deletedTempUser = await APITempUserService.deleteOne(tempUser.id)
      console.log('deletedTempUser', deletedTempUser)
      const deletedUser = await APIUserService.deleteOne(tempUser.id)
      console.log('deletedUser', deletedUser)

      res.status(200).json(updatedUser)
    } else {
      res.status(200).json(updatedUser)
    }
  } else {
    res.status(400).json({ message: 'Could not update user' })
  }
}

export const getAllUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const users = await APIUserService.findMany()
  res.status(200).json(users)
}
