import { EducationExperience } from '@/common/types/EducationExperience'
import { useUser } from '@/frontend/hooks/useUser'
import { FrontendEducationExperiencesService } from '@/frontend/services/educationexperiences.service'
import {
  FrontendOtherExperiencesService,
  OtherExperience,
} from '@/frontend/services/otherExperiences.service'
import { FrontendPersonalExperiencesService } from '@/frontend/services/personalExperience.service'
import { FrontendProfileService, Profile } from '@/frontend/services/profile.service'
import { FrontendProfileCertificationService } from '@/frontend/services/profileCertifications.service'
import { FrontendProfileSkillsService } from '@/frontend/services/profileSkills.service'
import { FrontendUserService, User } from '@/frontend/services/user.service'
import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

export type PersonalExperience = {
  id: string
  profile_id: string
  activity: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  created_at: Date
  updated_at: Date
}

export type ProfileCertification = {
  id: string
  master_certification_id: string
  profile_id: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export type ProfileSkill = {
  id: string
  master_skill_id: string
  profile_id: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export type Skills = {
  id: string
  name: string | null
  type: string | null
  profile_id: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export type Story = {
  id: string
  profile_id: string
  prompt: string
  response: string
  created_at: Date
  updated_at: Date
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { data: user } = useUser()
  const updateProfile = useMutation((profile: Profile) => FrontendProfileService.update(profile))

  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const updateSummary = useMutation((user: Partial<User>) => FrontendUserService.update(user), {
    onSuccess: (data) => {
      queryClient.invalidateQueries('me')
      queryClient.invalidateQueries(['profile', data?.profile?.id])
    },
  })

  const updateStory = useMutation(
    (story: Partial<Story>) => {
      if (!token) {
        return Promise.reject('No user id')
      }
      return FrontendProfileService.updateStory(story, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', data.profile_id, token])
        queryClient.invalidateQueries('me')
      },
    },
  )

  type AddStoryType = {
    story: Partial<Story>
    profileId: string
  }
  const addStory = useMutation(
    ({ profileId, story }: AddStoryType) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendProfileService.addStory(profileId, story, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', data.profile_id])
      },
    },
  )

  const deleteStory = useMutation(
    (story: { id: string; profile_id: string }) => {
      if (!token) return Promise.reject('No token')

      return FrontendProfileService.deleteStory(story, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', data.profile_id])
        queryClient.invalidateQueries('me')
      },
    },
  )

  const deleteSkill = useMutation((skill: Skills) => FrontendProfileService.deleteSkill(skill), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profile', data.profile_id])
      queryClient.invalidateQueries('me')
    },
  })

  type UpdateSkillType = {
    skill: Skills
    profileId: string
  }
  const updateSkill = useMutation(
    ({ profileId, skill }: UpdateSkillType) => FrontendProfileService.updateSkill(profileId, skill),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', data.profile_id])
        queryClient.invalidateQueries('me')
      },
    },
  )

  type AddSkillType = {
    skill: Partial<Skills>
    profileId: string
  }
  const addSkill = useMutation(
    ({ profileId, skill }: AddSkillType) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendProfileService.addSkill(profileId, skill, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', data.profile_id])
        queryClient.invalidateQueries('me')
      },
    },
  )

  const addPersonalExperience = useMutation(
    ({
      personalExperience,
      profileId,
    }: {
      personalExperience: Partial<PersonalExperience>
      profileId: string
    }) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendPersonalExperiencesService.create(personalExperience, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', data.profileId])
      },
    },
  )

  const updatePersonalExperience = useMutation(
    ({
      personalExperience,
      profileId,
    }: {
      personalExperience: Partial<PersonalExperience>
      profileId: string
    }) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendPersonalExperiencesService.update(personalExperience, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', data.profileId])
      },
    },
  )

  const deletePersonalExperience = useMutation(
    ({ personalExperienceId, profileId }: { personalExperienceId: string; profileId: string }) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendPersonalExperiencesService.deleteOne(personalExperienceId, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', data.profileId])
      },
    },
  )

  type AddOtherExperienceType = {
    otherExperience: Partial<OtherExperience>
    profileId: string
  }

  const addOtherExperience = useMutation(
    ({ otherExperience, profileId }: AddOtherExperienceType) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendOtherExperiencesService.create(otherExperience, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  type UpdateOtherExperienceType = {
    otherExperience: Partial<OtherExperience>
    profileId: string
  }
  const updateOtherExperience = useMutation(
    ({ otherExperience, profileId }: UpdateOtherExperienceType) => {
      if (!token) return Promise.reject('No user id')

      return FrontendOtherExperiencesService.update(otherExperience, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  type DeleteOtherExperienceType = {
    otherExperienceId: string
    profileId: string
  }
  const deleteOtherExperience = useMutation(
    ({ otherExperienceId, profileId }: DeleteOtherExperienceType) => {
      if (!token) return Promise.reject('No user id')

      return FrontendOtherExperiencesService.deleteOne(otherExperienceId, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  type AddEducationExperience = {
    educationExperience: Partial<EducationExperience>
    profileId: string
  }
  const addEducationExperience = useMutation(
    ({ educationExperience, profileId }: AddEducationExperience) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      console.log('educationExperience', educationExperience)
      return FrontendEducationExperiencesService.create(educationExperience, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  type UpdateEducationExperienceType = {
    educationExperience: Partial<EducationExperience>
    profileId: string
  }
  const updateEducationExperience = useMutation(
    ({ educationExperience, profileId }: UpdateEducationExperienceType) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendEducationExperiencesService.update(educationExperience, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  type DeleteEducationExperience = {
    educationExperienceId: string
    profileId: string
  }
  const deleteEducationExperience = useMutation(
    ({ educationExperienceId, profileId }: DeleteEducationExperience) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendEducationExperiencesService.deleteOne(educationExperienceId, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  // Profile Skills
  type AddProfileSkillType = {
    profileSkill: Partial<ProfileSkill>
    profileId: string
  }
  const addProfileSkill = useMutation(
    ({ profileSkill, profileId }: AddProfileSkillType) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendProfileSkillsService.create(profileSkill, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  type UpdateProfileSkillType = {
    profileSkill: Partial<ProfileSkill> & { id: string }
    profileId: string
  }
  const updateProfileSkill = useMutation(
    ({ profileSkill, profileId }: UpdateProfileSkillType) => {
      if (!token) {
        return Promise.reject('No user id')
      }
      return FrontendProfileSkillsService.update(profileSkill, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  type DeleteProfileSkillType = {
    profileSkillId: string
    profileId: string
  }
  const deleteProfileSkill = useMutation(
    ({ profileSkillId, profileId }: DeleteProfileSkillType) => {
      if (!token) {
        return Promise.reject('No user id')
      }

      return FrontendProfileSkillsService.deleteOne(profileSkillId, profileId, token)
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  // Profile Certifications
  type AddProfileCertificationType = {
    profileCertification: Partial<ProfileCertification>
    profileId: string
  }
  const addProfileCertification = useMutation(
    ({ profileCertification, profileId }: AddProfileCertificationType) =>
      FrontendProfileCertificationService.create(profileCertification, profileId),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  type DeleteProfileCertificationType = {
    profileCertificationId: string
    profileId: string
  }
  const deleteProfileCertification = useMutation(
    ({ profileCertificationId, profileId }: DeleteProfileCertificationType) =>
      FrontendProfileCertificationService.deleteOne(profileCertificationId, profileId),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['profile', user?.profile?.id])
      },
    },
  )

  return {
    updateProfile,
    updateSummary,
    updateStory,
    addStory,
    deleteStory,
    deleteSkill,
    updateSkill,
    addSkill,
    addOtherExperience,
    updateOtherExperience,
    deleteOtherExperience,
    addPersonalExperience,
    updatePersonalExperience,
    deletePersonalExperience,
    addEducationExperience,
    updateEducationExperience,
    deleteEducationExperience,
    addProfileSkill,
    updateProfileSkill,
    deleteProfileSkill,
    addProfileCertification,
    deleteProfileCertification,
  }
}
