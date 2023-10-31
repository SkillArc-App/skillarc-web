import { ProfileCertification } from '@prisma/client'
import { http } from '../http-common'

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
