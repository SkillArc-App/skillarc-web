import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '../../pages/api/auth/[...nextauth]'
import { HttpMethod } from './handler-wrapper'
import { APIProfileService } from '../services/profile-service'
import { APIJobInteractionService } from '../services/jobInteraction-service'
import { getServerSession } from 'lib/auth-wrapper'

export const authHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  const method = req.method as HttpMethod
  const path = req.url ?? ''
  const isModifyingUserRoute = method === 'PUT' || method === 'DELETE' || method === 'POST'
  const { query } = req
  const profileId = query.profileId as string
  const jobInteractionId = query.jobInteractionId as string

  // use route specific auth handlers
  if (isModifyingUserRoute && path.startsWith('/api/users')) {
    return userAuthHandler(req, res, session)
  } else if (method === 'POST' && path.startsWith('/api/profiles') && !profileId) {
    return postAuthHandler(req, res, session)
  } else if (isModifyingUserRoute && path.startsWith('/api/profiles')) {
    return profileAuthHandler(req, res, session)
  } else if (isModifyingUserRoute && path.startsWith('/api/jobInteractions') && !jobInteractionId) {
    return postAuthHandler(req, res, session)
  } else if (isModifyingUserRoute && path.startsWith('/api/jobInteractions')) {
    return jobInteractionAuthHandler(req, res, session)
  } else {
    // if an unprotected route, return true
    return true
  }
}

const userAuthHandler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { query } = req
  const id = query.userId as string
  const isAuthorized = session?.user?.id === id
  return isAuthorized
}

const profileAuthHandler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const { query } = req
  const id = query.profileId as string

  const profile = await APIProfileService.findOne(id)
  const isAuthorized = session?.user?.id === profile?.user_id

  return isAuthorized
}

const jobInteractionAuthHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: any,
) => {
  const { query } = req
  const id = query.jobInteractionId as string

  const jobInteraction = await APIJobInteractionService.findOne(id)
  const isAuthorized = session?.user?.id === jobInteraction?.user_id
  return isAuthorized
}

// Our pattern for posting to the DB includes a userId in the body as opposed to an ID in the URL
const postAuthHandler = async (req: NextApiRequest, res: NextApiResponse, session: any) => {
  const isAuthorized = session?.user?.id === req.body.userId
  return isAuthorized
}
