import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useUser } from '@/frontend/hooks/useUser'
import { Button, Checkbox, Flex, Input, Textarea } from '@chakra-ui/react'
import { PersonalExperience } from '@prisma/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUpdateMyProfile } from '../hooks/useUpdateProfile'

export const EditPersonalExperience = () => {
  const router = useRouter()
  const { data: user } = useUser()
  const { personalExperienceId } = router.query

  const [currentlyWorking, setCurrentlyWorking] = useState<boolean>(false)
  const [personalExperience, setPersonalExperience] = useState<Partial<PersonalExperience>>()
  const {
    addPersonalExperience: { mutate: addPersonalExperience, status: addPersonalExperienceStatus },
    updatePersonalExperience: {
      mutate: updatePersonalExperience,
      status: updatePersonalExperienceStatus,
    },
    deleteOtherExperience: { mutate: deleteOtherExperience, status: deleteOtherExperienceStatus },
  } = useUpdateMyProfile()
  useEffect(() => {
    const personalExperience = user?.profile?.personalExperience?.find(
      (exp: PersonalExperience) => exp.id === personalExperienceId,
    )

    if (!personalExperience) return

    setPersonalExperience(personalExperience)
  }, [personalExperienceId, user])

  useEffect(() => {
    if (currentlyWorking && personalExperience) {
      setPersonalExperience({ ...personalExperience, end_date: '' })
    }
  }, [currentlyWorking, personalExperience])

  useEffect(() => {
    if (
      addPersonalExperienceStatus === 'success' ||
      updatePersonalExperienceStatus === 'success' ||
      deleteOtherExperienceStatus === 'success'
    ) {
      router.back()
    }
  }, [addPersonalExperienceStatus, updatePersonalExperienceStatus, deleteOtherExperienceStatus, router])

  const handleSave = () => {
    const profileId = user?.profile?.id
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

  const handleDelete = () => {}

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
            value={personalExperience?.start_date ?? ''}
            onChange={(e) =>
              setPersonalExperience({ ...personalExperience, start_date: e.target.value })
            }
            placeholder="2021"
            _placeholder={{ color: 'greyscale.400' }}
          ></Input>
        </Flex>
        {!currentlyWorking && (
          <Flex flexDir="column" gap="0.5rem">
            <Text type="b2">End Date</Text>
            <Input
              value={personalExperience?.end_date ?? ''}
              onChange={(e) =>
                setPersonalExperience({ ...personalExperience, end_date: e.target.value })
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
