'use client'

import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { Button, Checkbox, Flex, Input, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUpdateProfile } from '../../hooks/useUpdateProfile'
import { PersonalExperience } from '@/frontend/services/personalExperience.service'

const EditPersonalExperience = () => {
  const router = useRouter()
  const { profileId, personalExperienceId } = useFixedParams('profileId', 'personalExperienceId')

  const { data: seeker } = useProfileData(profileId)

  const [currentlyWorking, setCurrentlyWorking] = useState<boolean>(false)
  const [personalExperience, setPersonalExperience] = useState<Partial<PersonalExperience>>()
  const {
    addPersonalExperience: { mutate: addPersonalExperience, status: addPersonalExperienceStatus },
    updatePersonalExperience: {
      mutate: updatePersonalExperience,
      status: updatePersonalExperienceStatus,
    },
    deletePersonalExperience: {
      mutate: deletePersonalExperience,
      status: deletePersonalExperienceStatus,
    },
  } = useUpdateProfile()

  useEffect(() => {
    setPersonalExperience(seeker?.personalExperience?.find(({ id }) => id === personalExperienceId))
  }, [personalExperienceId, seeker])

  useEffect(() => {
    if (currentlyWorking && personalExperience) {
      setPersonalExperience({ ...personalExperience, endDate: '' })
    }
  }, [currentlyWorking, personalExperience])

  useEffect(() => {
    if (
      addPersonalExperienceStatus === 'success' ||
      updatePersonalExperienceStatus === 'success' ||
      deletePersonalExperienceStatus === 'success'
    ) {
      router.back()
    }
  }, [
    addPersonalExperienceStatus,
    updatePersonalExperienceStatus,
    deletePersonalExperienceStatus,
    router,
  ])

  const handleSave = () => {
    const profileId = seeker?.id
    if (!profileId) return
    if (!personalExperience) return

    if (!personalExperience?.id) {
      addPersonalExperience({
        profileId: profileId,
        personalExperience: {
          ...personalExperience,
        },
      })
    } else {
      updatePersonalExperience({
        profileId: profileId,
        personalExperience: {
          ...personalExperience,
          id: personalExperience.id,
        },
      })
    }
  }

  const handleDelete = () => {
    if (!personalExperience?.id) router.back() // if experience is not saved, just go back
    const personalExperienceId = personalExperience?.id
    const profileId = seeker?.id
    if (!profileId || !personalExperienceId) return
    deletePersonalExperience({
      profileId: profileId,
      personalExperienceId: personalExperienceId,
    })
  }

  return (
    <Flex p="1rem" w="100%" gap="1rem" flexDir="column">
      <Heading variant="h2">Edit Personal Experience</Heading>
      <Flex
        p="1rem"
        bg="white"
        gap="1rem"
        flexDir="column"
        borderRadius="4px"
        boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      >
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Activity</Text>
          <Input
            value={personalExperience?.activity ?? ''}
            onChange={(e) =>
              setPersonalExperience({ ...personalExperience, activity: e.target.value })
            }
            placeholder="Babysitting, fixing bikes, cleaning"
            _placeholder={{ color: 'greyscale.400' }}
          ></Input>
        </Flex>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Start Date</Text>
          <Input
            value={personalExperience?.startDate ?? ''}
            onChange={(e) =>
              setPersonalExperience({ ...personalExperience, startDate: e.target.value })
            }
            placeholder="2021"
            _placeholder={{ color: 'greyscale.400' }}
          ></Input>
        </Flex>
        {!currentlyWorking && (
          <Flex flexDir="column" gap="0.5rem">
            <Text type="b2">End Date</Text>
            <Input
              value={personalExperience?.endDate ?? ''}
              onChange={(e) =>
                setPersonalExperience({ ...personalExperience, endDate: e.target.value })
              }
              placeholder="2022"
              _placeholder={{ color: 'greyscale.400' }}
            ></Input>
          </Flex>
        )}
        <Checkbox
          isChecked={currentlyWorking}
          onChange={() => setCurrentlyWorking((prev) => !prev)}
        >
          I currently work here
        </Checkbox>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Tell us about your role</Text>
          <Textarea
            value={personalExperience?.description ?? ''}
            onChange={(e) =>
              setPersonalExperience({ ...personalExperience, description: e.target.value })
            }
          />
        </Flex>
      </Flex>
      <Button variant="primary" onClick={handleSave}>
        Save Changes
      </Button>
      <Button variant="secondary" onClick={handleDelete}>
        {personalExperience?.id ? 'Delete Experience' : 'Cancel'}
      </Button>
    </Flex>
  )
}

export default EditPersonalExperience
