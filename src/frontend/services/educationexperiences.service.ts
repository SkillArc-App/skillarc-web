import axios from 'axios'

export type EducationExperience = {
  id: string
  organization_id: string | null
  organization_name: string | null
  profile_id: string
  title: string | null
  activities: string | null
  graduation_date: string | null
  gpa: string | null
  created_at: Date
  updated_at: Date
}

const create = async (
  educationExperience: Partial<EducationExperience>,
  profileId: string,
  token: string,
) => {
  const res = await axios
    .create({ withCredentials: false })
    .post(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences`,
      educationExperience,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

const update = async (
  educationExperience: Partial<EducationExperience>,
  profileId: string,
  token: string,
) => {
  const res = await axios
    .create({ withCredentials: false })
    .put(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences/${educationExperience.id}`,
      educationExperience,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

const deleteOne = async (educationExperienceId: string, profileId: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .delete(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences/${educationExperienceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

export const FrontendEducationExperiencesService = {
  update,
  create,
  deleteOne,
}
