import { Credential } from '@prisma/client'
import { useMutation } from 'react-query'
import { FrontendCredentialService } from '../../../services/credentials.service'
import { useUser } from '../../../hooks/useUser'

export const useMutateOnboardingCredential = () => {
  const { data: user } = useUser()

  return useMutation((credential: Partial<Credential>) => {
    return FrontendCredentialService.create(credential, user?.profile?.id)
  })
}
