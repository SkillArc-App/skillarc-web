import { get, post, put } from '../http-common'

export type Reference = {
  id: string
  author_profile_id: string
  reference_text: string
  seeker_profile_id: string
  training_provider_id: string
  created_at: Date
  updated_at: Date
}

const addReference = async (seekerProfileId: string, reference: string, token: string) => {
  await post<Reference>(
    `/references`,
    {
      reference,
      seeker_profile_id: seekerProfileId,
    },
    token,
  )
}

const getOne = async (referenceId: string, token: string) => {
  const res = await get<Reference>(`/references/${referenceId}`, token)

  return res.data
}

const update = async (reference: Partial<Reference>, token: string) => {
  const res = await put<Reference>(`/references/${reference.id}`, reference, token)

  return res.data
}

export const FrontendReferenceService = {
  getOne,
  addReference,
  update,
}
