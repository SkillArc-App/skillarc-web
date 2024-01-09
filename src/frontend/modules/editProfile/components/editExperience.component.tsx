import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useUser } from '@/frontend/hooks/useUser'
import { Button, Checkbox, Flex, Input, Textarea } from '@chakra-ui/react'
import { OtherExperience } from '@prisma/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUpdateMyProfile } from '../hooks/useUpdateProfile'

export const EditExperience = () => {
  const router = useRouter()
  const { data: user } = useUser()
  const { otherExperienceId } = router.query
  const [currentlyWorking, setCurrentlyWorking] = useState<boolean>(false)
  const [experience, setExperience] = useState<Partial<OtherExperience>>()
  const {
    addOtherExperience: { mutate: addOtherExperience, status: addOtherExperienceStatus },
    updateOtherExperience: { mutate: updateOtherExperience, status: updateOtherExperienceStatus },
    deleteOtherExperience: { mutate: deleteOtherExperience, status: deleteOtherExperienceStatus },
  } = useUpdateMyProfile()
  useEffect(() => {
    const otherExperience: OtherExperience | undefined = user?.profile?.otherExperiences?.find(
      (exp: OtherExperience) => exp.id === otherExperienceId,
    )
    if (!otherExperience) return

    setExperience(otherExperience)
  }, [otherExperienceId, user])

  useEffect(() => {
    if (currentlyWorking && experience) {
      setExperience({ ...experience, end_date: '' })
    }
  }, [currentlyWorking, experience])

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
    const profileId = user?.profile?.id
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
          organization_id: experience?.organization_id ?? null,
          id: experience.id,
        },
      })
    }
  }

  const handleDelete = () => {
    if (!experience?.id) router.back() // if experience is not saved, just go back
    const otherExperienceId = experience?.id
    const profileId = user?.profile?.id
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
            value={experience?.organization_name ?? ''}
            onChange={(e) => setExperience({ ...experience, organization_name: e.target.value })}
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
            value={experience?.start_date ?? ''}
            onChange={(e) => setExperience({ ...experience, start_date: e.target.value })}
            placeholder="2021"
            _placeholder={{ color: 'greyscale.400' }}
          ></Input>
        </Flex>
        {!currentlyWorking && (
          <Flex flexDir="column" gap="0.5rem">
            <Text type="b2">End Date</Text>
            <Input
              value={experience?.end_date ?? ''}
              onChange={(e) => setExperience({ ...experience, end_date: e.target.value })}
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
