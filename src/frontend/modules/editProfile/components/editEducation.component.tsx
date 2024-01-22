import { EducationExperience } from '@/common/types/EducationExperience'
import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { Button, Flex, Input } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUpdateProfile } from '../hooks/useUpdateProfile'

export const EditEducation = () => {
  const router = useRouter()
  const { educationExperienceId } = router.query
  const { profileId } = router.query
  const {
    profileQuery: { data: profile },
  } = useProfileData(profileId as string)
  const [experience, setExperience] = useState<Partial<EducationExperience>>()
  const {
    addEducationExperience: {
      mutate: addEducationExperience,
      status: addEducationExperienceStatus,
    },
    updateEducationExperience: {
      mutate: updateEducationExperience,
      status: updateEducationExperienceStatus,
    },
    deleteEducationExperience: {
      mutate: deleteEducationExperience,
      status: deleteEducationExperienceStatus,
    },
  } = useUpdateProfile()
  useEffect(() => {
    setExperience(
      profile?.educationExperiences?.find(
        (exp: EducationExperience) => exp.id === educationExperienceId,
      ),
    )
  }, [educationExperienceId, profile])

  useEffect(() => {
    if (
      addEducationExperienceStatus === 'success' ||
      updateEducationExperienceStatus === 'success' ||
      deleteEducationExperienceStatus === 'success'
    ) {
      router.back()
    }
  }, [
    addEducationExperienceStatus,
    updateEducationExperienceStatus,
    deleteEducationExperienceStatus,
    router,
  ])

  const handleSave = () => {
    const profileId = profile?.id
    if (!profileId) return
    if (!experience?.id) {
      addEducationExperience({
        profileId: profileId,
        educationExperience: {
          ...experience,
        },
      })
    } else {
      updateEducationExperience({
        profileId: profileId,
        educationExperience: {
          ...experience,
          id: experience.id,
        },
      })
    }
  }

  const handleDelete = () => {
    if (!experience?.id) router.back() // if experience is not saved, just go back
    const educationExperienceId = experience?.id
    const profileId = profile?.id
    if (!profileId || !educationExperienceId) return
    deleteEducationExperience({
      profileId: profileId,
      educationExperienceId: educationExperienceId,
    })
  }
  return (
    <Flex p="1rem" w="100%" gap="1rem" flexDir="column">
      <Heading variant="h2">Edit Education</Heading>

      <Flex
        p="1rem"
        bg="white"
        gap="1rem"
        flexDir="column"
        borderRadius="4px"
        boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      >
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">School/Organization</Text>
          <Input
            value={experience?.organizationName ?? ''}
            onChange={(e) => {
              setExperience({ ...experience, organizationName: e.target.value })
            }}
          />
        </Flex>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Graduation Year</Text>
          <Input
            placeholder="2021"
            _placeholder={{ color: 'greyscale.400' }}
            value={experience?.graduationDate ?? ''}
            onChange={(e) => {
              setExperience({ ...experience, graduationDate: e.target.value })
            }}
          />
          {/* Callout - we do not gather isAttending info for education in the onboarding flow */}
          {/* <Checkbox>I am currently attending</Checkbox> */}
        </Flex>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">GPA</Text>
          <Input
            value={experience?.gpa ?? ''}
            onChange={(e) => {
              setExperience({ ...experience, gpa: e.target.value })
            }}
          />
        </Flex>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Activities</Text>
          <Input
            placeholder="Teams, clubs, etc."
            _placeholder={{ color: 'greyscale.400' }}
            value={experience?.activities ?? ''}
            onChange={(e) => {
              setExperience({ ...experience, activities: e.target.value })
            }}
          />
        </Flex>
      </Flex>

      <Button variant="primary" onClick={handleSave}>
        Save Changes
      </Button>
      <Button variant="secondary" onClick={handleDelete}>
        {experience?.id ? 'Delete' : 'Cancel'}
      </Button>
    </Flex>
  )
}
