import { get, post, put } from '../http-common'

export type Reference = {
  id: string
  authorProfileId: string
  referenceText: string
  seekerId: string
  trainingProviderId: string
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
