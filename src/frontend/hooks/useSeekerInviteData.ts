import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { FrontendInviteService } from '../services/invites.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllSeekerInviteData = () => {
  const getAllInvites = useAuthenticatedQuery(['invite'], ({ token }) => {
    return FrontendInviteService.getAll(token)
  })

  return { getAllInvites }
}
