import { http } from '../http-common'

export type ProfileCertification = {
  id: string
  master_certification_id: string
  profile_id: string
  description: string | null
  created_at: Date
  updated_at: Date
}

const create = async (profileCertification: Partial<ProfileCertification>, profileId?: string) => {
  return await http.post(`/api/profiles/${profileId}/profileCertifications`, profileCertification)
}

const update = async (profileCertification: Partial<ProfileCertification>, profileId?: string) => {
  const res = await http.put(
    `/api/profiles/${profileId}/profileCertifications/${profileCertification.id}`,
    profileCertification,
  )
  return res.data
}

const deleteOne = async (profileCertificationId: string, profileId?: string) => {
  const res = await http.delete(
    `/api/profiles/${profileId}/profileCertifications/${profileCertificationId}`,
  )
  return res.data
}

export const FrontendProfileCertificationService = {
  create,
  update,
  deleteOne,
}
