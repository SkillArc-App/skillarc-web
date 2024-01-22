import { EducationExperience } from '@/common/types/EducationExperience'
import { destroy, post, put } from '../http-common'

const create = async (
  educationExperience: Partial<EducationExperience>,
  profileId: string,
  token: string,
) => {
  const res = await post(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences`,
    educationExperience,
    token,
    { camel: true },
  )

  return res.data
}

const update = async (
  educationExperience: Partial<EducationExperience>,
  profileId: string,
  token: string,
) => {
  const res = await put(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences/${educationExperience.id}`,
    educationExperience,
    token,
    { camel: true },
  )

  return res.data
}

const deleteOne = async (educationExperienceId: string, profileId: string, token: string) => {
  const res = await destroy(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences/${educationExperienceId}`,
    token,
    { camel: true },
  )

  return res.data
}

export const FrontendEducationExperiencesService = {
  update,
  create,
  deleteOne,
}
