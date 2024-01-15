import { useMutation } from 'react-query'
import { useUser } from '../../../hooks/useUser'
import { FrontendCredentialService } from '../../../services/credentials.service'

export type Credential = {
  id: string
  organization_id: string | null
  name: string | null
  profile_id: string
  issued_date: string | null
  description: string | null
  created_at: Date
  updated_at: Date
}

export const useMutateOnboardingCredential = () => {
  const { data: user } = useUser()

  return useMutation((credential: Partial<Credential>) => {
    return FrontendCredentialService.create(credential, user?.profile?.id)
  })
}
