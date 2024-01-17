import { http } from '../http-common'

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

const create = async (credential: Partial<Credential>, profileId?: string) => {
  return await http.post(`/api/profiles/${profileId}/credentials`, credential)
}

export const FrontendCredentialService = {
  create,
}
