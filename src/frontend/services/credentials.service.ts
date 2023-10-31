import { Credential } from '@prisma/client'
import { http } from '../http-common'

const create = async (credential: Partial<Credential>, profileId?: string) => {
  return await http.post(`/api/profiles/${profileId}/credentials`, credential)
}

export const FrontendCredentialService = {
  create,
}
