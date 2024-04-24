import { EducationExperience } from '@/common/types/EducationExperience'
import { destroy, post, put } from '../http-common'

const create = async (
  educationExperience: Partial<EducationExperience>,
  profileId: string,
  token: string,
) => {
  await post(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences`,
    educationExperience,
    token,
  )
}

const update = async (
  educationExperience: Partial<EducationExperience>,
  profileId: string,
  token: string,
) => {
  await put(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences/${educationExperience.id}`,
    educationExperience,
    token,
  )
}

const deleteOne = async (educationExperienceId: string, profileId: string, token: string) => {
  await destroy(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences/${educationExperienceId}`,
    token,
  )
}

export const FrontendEducationExperiencesService = {
  update,
  create,
  deleteOne,
}
