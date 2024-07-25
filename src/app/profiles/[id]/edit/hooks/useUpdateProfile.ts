import { useAuthenticatedMutation } from '@/app/hooks/useAuthenticatedMutation'
import { FrontendEducationExperiencesService } from '@/frontend/services/educationexperiences.service'
import { FrontendOtherExperiencesService } from '@/frontend/services/otherExperiences.service'
import { FrontendPersonalExperiencesService } from '@/frontend/services/personalExperience.service'
import { FrontendProfileService } from '@/frontend/services/profile.service'
import { FrontendProfileSkillsService } from '@/frontend/services/profileSkills.service'
import { FrontendUserService } from '@/frontend/services/user.service'
import { useQueryClient } from '@tanstack/react-query'

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  const updateSummary = useAuthenticatedMutation(FrontendUserService.update, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['me'])
      queryClient.invalidateQueries(['profile', data?.profile?.id])
    },
  })

  const updateStory = useAuthenticatedMutation(FrontendProfileService.updateStory, {
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profile', profileId])
      queryClient.invalidateQueries(['me'])
    },
  })

  const addStory = useAuthenticatedMutation(FrontendProfileService.addStory, {
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profile', profileId])
    },
  })

  const deleteStory = useAuthenticatedMutation(FrontendProfileService.deleteStory, {
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profile', profileId])
      queryClient.invalidateQueries(['me'])
    },
  })

  const addSkill = useAuthenticatedMutation(FrontendProfileService.addSkill, {
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profile', profileId])
      queryClient.invalidateQueries(['me'])
    },
  })

  const addPersonalExperience = useAuthenticatedMutation(
    FrontendPersonalExperiencesService.create,
    {
      onSuccess: (_, { profileId }) => {
        queryClient.invalidateQueries(['profile', profileId])
      },
    },
  )

  const updatePersonalExperience = useAuthenticatedMutation(
    FrontendPersonalExperiencesService.update,
    {
      onSuccess: (_, { profileId }) => {
        queryClient.invalidateQueries(['profile', profileId])
      },
    },
  )

  const deletePersonalExperience = useAuthenticatedMutation(
    FrontendPersonalExperiencesService.deleteOne,
    {
      onSuccess: (data, { profileId }) => {
        queryClient.invalidateQueries(['profile', profileId])
      },
    },
  )

  const addOtherExperience = useAuthenticatedMutation(FrontendOtherExperiencesService.create, {
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profile', profileId])
    },
  })

  const updateOtherExperience = useAuthenticatedMutation(FrontendOtherExperiencesService.update, {
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profile', profileId])
    },
  })

  const deleteOtherExperience = useAuthenticatedMutation(
    FrontendOtherExperiencesService.deleteOne,
    {
      onSuccess: (_, { profileId }) => {
        queryClient.invalidateQueries(['profile', profileId])
      },
    },
  )

  const addEducationExperience = useAuthenticatedMutation(
    FrontendEducationExperiencesService.create,
    {
      onSuccess: (_, { profileId }) => {
        queryClient.invalidateQueries(['profile', profileId])
      },
    },
  )

  const updateEducationExperience = useAuthenticatedMutation(
    FrontendEducationExperiencesService.update,
    {
      onSuccess: (_, { profileId }) => {
        queryClient.invalidateQueries(['profile', profileId])
      },
    },
  )

  const deleteEducationExperience = useAuthenticatedMutation(
    FrontendEducationExperiencesService.deleteOne,
    {
      onSuccess: (_, { profileId }) => {
        queryClient.invalidateQueries(['profile', profileId])
      },
    },
  )

  const addProfileSkill = useAuthenticatedMutation(FrontendProfileSkillsService.create, {
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profile', profileId])
    },
  })

  const updateProfileSkill = useAuthenticatedMutation(FrontendProfileSkillsService.update, {
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profile', profileId])
    },
  })

  const deleteProfileSkill = useAuthenticatedMutation(FrontendProfileSkillsService.deleteOne, {
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profile', profileId])
    },
  })

  return {
    updateSummary,
    updateStory,
    addStory,
    deleteStory,
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
  }
}
