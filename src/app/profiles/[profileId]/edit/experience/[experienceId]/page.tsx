'use client'

import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { OtherExperience } from '@/frontend/services/otherExperiences.service'
import { Button, Checkbox, Flex, Input, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUpdateProfile } from '../../hooks/useUpdateProfile'

const EditExperience = () => {
  const router = useRouter()
  const { profileId, experienceId } = useFixedParams('profileId', 'experienceId')

  const { data: seeker } = useProfileData(profileId)
  const [currentlyWorking, setCurrentlyWorking] = useState<boolean>(false)
  const [experience, setExperience] = useState<Partial<OtherExperience>>()
  const {
    addOtherExperience: { mutate: addOtherExperience, status: addOtherExperienceStatus },
    updateOtherExperience: { mutate: updateOtherExperience, status: updateOtherExperienceStatus },
    deleteOtherExperience: { mutate: deleteOtherExperience, status: deleteOtherExperienceStatus },
  } = useUpdateProfile()

  useEffect(() => {
    setExperience(seeker?.otherExperiences?.find(({ id }) => id === experienceId))
  }, [experienceId, seeker])

  useEffect(() => {
    if (currentlyWorking && experience) {
      setExperience({ ...experience, endDate: '' })
    }
  }, [currentlyWorking])

  useEffect(() => {
    if (
      addOtherExperienceStatus === 'success' ||
      updateOtherExperienceStatus === 'success' ||
      deleteOtherExperienceStatus === 'success'
    ) {
      router.back()
    }
  }, [addOtherExperienceStatus, updateOtherExperienceStatus, deleteOtherExperienceStatus, router])

  const handleSave = () => {
    const profileId = seeker?.id
    if (!profileId) return
    if (!experience?.id) {
      addOtherExperience({
        profileId: profileId,
        otherExperience: {
          ...experience,
        },
      })
    } else {
      updateOtherExperience({
        profileId: profileId,
        otherExperience: {
          ...experience,
          organizationId: experience?.organizationId ?? null,
          id: experience.id,
        },
      })
    }
  }

  const handleDelete = () => {
    if (!experience?.id) router.back() // if experience is not saved, just go back
    const otherExperienceId = experience?.id
    const profileId = seeker?.id
    if (!profileId || !otherExperienceId) return
    deleteOtherExperience({
      profileId: profileId,
      otherExperienceId: otherExperienceId,
    })
  }

  return (
    <Flex p="1rem" w="100%" gap="1rem" flexDir="column">
      <Heading variant="h2">Edit Experience</Heading>
      <Flex
        p="1rem"
        bg="white"
        gap="1rem"
        flexDir="column"
        borderRadius="4px"
        boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      >
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Company/Organization</Text>
          <Input
            value={experience?.organizationName ?? ''}
            onChange={(e) => setExperience({ ...experience, organizationName: e.target.value })}
            placeholder="i.e. Dunder Mifflin"
            _placeholder={{ color: 'greyscale.400' }}
          ></Input>
        </Flex>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Position</Text>
          <Input
            value={experience?.position ?? ''}
            onChange={(e) => setExperience({ ...experience, position: e.target.value })}
            placeholder="i.e. Assistant"
            _placeholder={{ color: 'greyscale.400' }}
          ></Input>
        </Flex>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Start Date</Text>
          <Input
            value={experience?.startDate ?? ''}
            onChange={(e) => setExperience({ ...experience, startDate: e.target.value })}
            placeholder="2021"
            _placeholder={{ color: 'greyscale.400' }}
          ></Input>
        </Flex>
        {!currentlyWorking && (
          <Flex flexDir="column" gap="0.5rem">
            <Text type="b2">End Date</Text>
            <Input
              value={experience?.endDate ?? ''}
              onChange={(e) => setExperience({ ...experience, endDate: e.target.value })}
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
            value={experience?.description ?? ''}
            onChange={(e) => setExperience({ ...experience, description: e.target.value })}
          />
        </Flex>
      </Flex>
      <Button variant="primary" onClick={handleSave}>
        Save Changes
      </Button>
      <Button variant="secondary" onClick={handleDelete}>
        {experience?.id ? 'Delete Experience' : 'Cancel'}
      </Button>
    </Flex>
  )
}

export default EditExperience
