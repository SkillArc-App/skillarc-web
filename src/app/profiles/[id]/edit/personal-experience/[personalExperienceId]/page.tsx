'use client'

import { FixedParams } from '@/app/common/types/PageParams'
import { Heading } from '@/app/components/Heading'
import { Text } from '@/app/components/Text.component'
import { PersonalExperience } from '@/app/services/personalExperience.service'
import { Button, Checkbox, Flex, Input, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useProfileData } from '../../../hooks/useProfileData'
import { useUpdateProfile } from '../../hooks/useUpdateProfile'

const EditPersonalExperience = ({
  params: { id, personalExperienceId },
}: FixedParams<'id' | 'personalExperienceId'>) => {
  const router = useRouter()

  const { data: seeker } = useProfileData(id)

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
        ...personalExperience,
        profileId: profileId,
      })
    } else {
      updatePersonalExperience({
        ...personalExperience,
        id: personalExperience.id,
        profileId: profileId,
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
      id: personalExperienceId,
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
