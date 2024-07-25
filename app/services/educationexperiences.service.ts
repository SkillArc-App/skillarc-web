import { EducationExperience } from 'app/common/types/EducationExperience'
import { PartialRequired } from 'app/common/types/partial-required'
import { destroy, post, put } from '../http-common'

const create = async (
  educationExperience: PartialRequired<EducationExperience, 'profileId'>,
  token: string,
) => {
  await post(
    `/profiles/${educationExperience.profileId}/education_experiences`,
    educationExperience,
    token,
  )
}

const update = async (
  educationExperience: PartialRequired<EducationExperience, 'profileId'>,
  token: string,
) => {
  await put(
    `/profiles/${educationExperience.profileId}/education_experiences/${educationExperience.id}`,
    educationExperience,
    token,
  )
}

const deleteOne = async (
  { id, profileId }: PartialRequired<EducationExperience, 'profileId' | 'id'>,
  token: string,
) => {
  await destroy(`/profiles/${profileId}/education_experiences/${id}`, token)
}

export const FrontendEducationExperiencesService = {
  update,
  create,
  deleteOne,
}
