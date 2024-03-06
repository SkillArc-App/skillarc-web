'use client'

import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useMasterSkillData } from '@/frontend/hooks/useMasterSkillData'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { MasterSkill } from '@/frontend/services/skills.service'
import { Badge, Button, Flex, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import { useUpdateProfile } from '../hooks/useUpdateProfile'

type OneProfileSkillResponse = {
  id: string
  profileId: string
  masterSkillId: string
  description: string
  masterSkill: {
    id: string
    skill: string
    type: 'PERSONAL' | 'TECHNICAL'
  }
}

const EditSkills = () => {
  const router = useRouter()
  const { profileId } = useFixedParams('profileId')
  const { masterSkillQuery: masterSkills } = useMasterSkillData()
  const { data: seeker } = useProfileData(profileId)
  const {
    addProfileSkill: { mutate: addProfileSkill },
    updateProfileSkill: { mutate: updateProfileSkill },
    deleteProfileSkill: { mutate: deleteProfileSkill },
  } = useUpdateProfile()

  const [skillsList, setSkillsList] = useState<OneProfileSkillResponse[]>([])
  const [showSkills, setShowSkills] = useState(false)

  useEffect(() => {
    if (!seeker) {
      return
    }

    setSkillsList(
      seeker.profileSkills.map(({ id, description, masterSkill }) => {
        return {
          id,
          description: description ?? '',
          masterSkill: {
            id: masterSkill.id,
            skill: masterSkill.skill,
            type: masterSkill.type,
          },
          masterSkillId: masterSkill.id,
          profileId: seeker.id,
        }
      }),
    )
  }, [seeker])

  const handleResponseChange = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const newSkillsList = skillsList.map((skill, i) => {
      if (i === index) {
        return { ...skill, description: e.target.value }
      }
      return skill
    })
    setSkillsList(newSkillsList)
  }

  const handleAdd = (masterSkill: MasterSkill) => {
    setSkillsList((skills) => [
      ...skills,
      {
        id: '',
        description: '',
        masterSkill: masterSkill,
        masterSkillId: masterSkill.id,
        profileId: seeker?.id ?? '',
      },
    ])
  }

  const handleDelete = (skill: OneProfileSkillResponse) => {
    if (!seeker) return

    deleteProfileSkill({ profileSkillId: skill.id, profileId: seeker.id })
    setSkillsList((skills) => skills.filter(({ id }) => id !== skill.id))
  }

  const handleSave = () => {
    const profileId = seeker?.id
    if (!profileId) return

    skillsList.map((skill) => {
      if (masterSkills && masterSkills.data && skill.masterSkill.skill) {
        if (skill.id === '') {
          addProfileSkill({
            profileId: profileId,
            profileSkill: {
              description: skill.description,
              profile_id: profileId,
              master_skill_id: getIdBySkill(masterSkills.data, skill.masterSkill.skill),
            },
          })
        } else {
          updateProfileSkill({
            profileId: profileId,
            profileSkill: {
              id: skill.id,
              description: skill.description,
              profile_id: profileId,
              master_skill_id: getIdBySkill(masterSkills.data, skill.masterSkill.skill),
            },
          })
        }
      }
    })

    router.back()
  }
  if (!showSkills) {
    return (
      <Flex p="1rem" w="100%" gap="1rem" flexDir="column">
        <Heading variant="h2">Edit Skills</Heading>
        <Flex
          p="1rem"
          bg="white"
          gap="1rem"
          flexDir="column"
          borderRadius="4px"
          boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
        >
          <Text type="overline">TECHNICAL STRENGTHS</Text>
          {skillsList.map((skill, index) => {
            if (skill.masterSkill.type == 'TECHNICAL')
              return (
                <Flex flexDir="column" gap="0.5rem" key={index}>
                  <Badge variant="primary" w="fit-content">
                    {skill.masterSkill.skill}
                  </Badge>
                  <Textarea
                    value={skill.description}
                    onChange={(e) => handleResponseChange(e, index)}
                  />
                  <Button variant={'remove'} w={'100%'} onClick={() => handleDelete(skill)}>
                    Remove
                  </Button>
                </Flex>
              )
          })}
        </Flex>
        <Flex
          p="1rem"
          bg="white"
          gap="1rem"
          flexDir="column"
          borderRadius="4px"
          boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
        >
          <Text type="overline">PERSONAL STRENGTHS</Text>
          {skillsList.map((skill, index) => {
            if (skill.masterSkill.type == 'PERSONAL')
              return (
                <Flex flexDir="column" gap="0.5rem" key={index}>
                  <Badge variant="secondary" w="fit-content">
                    {skill.masterSkill.skill}
                  </Badge>
                  <Textarea
                    value={skill.description}
                    onChange={(e) => handleResponseChange(e, index)}
                  />
                  <Button variant={'remove'} w={'100%'} onClick={() => handleDelete(skill)}>
                    Remove
                  </Button>
                </Flex>
              )
          })}
        </Flex>
        <Button variant="secondary" onClick={() => setShowSkills(true)}>
          Add new skill
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Flex>
    )
  } else {
    return (
      <Flex bg={'greyscale.100'} height={'100%'} width={'100%'}>
        <Flex flexDir={'column'} px={'1rem'} py={'1rem'} gap={'0.5rem'} w="100%">
          <Flex flexDir={'column'} gap={'1rem'} w="100%">
            {masterSkills.data.map((option: MasterSkill, index: number) => {
              // Check if the skill is already present in the skillsList
              const isSkillAlreadyAdded = skillsList.some(
                (skill) => skill.masterSkill.skill === option.skill,
              )

              // If the skill is already added, don't render the button
              if (isSkillAlreadyAdded) {
                return null
              }

              // Render the button only for non-duplicate skills
              return (
                <Button
                  whiteSpace="initial"
                  padding="16px"
                  h="min-content"
                  bg="white"
                  boxShadow="0px 4px 4px rgba(0, 0, 0, 0.05)"
                  w="100%"
                  onClick={() => {
                    handleAdd(option)
                    setShowSkills(false)
                  }}
                  key={index}
                >
                  <Text type="b1" color="greyscale.600">
                    {option.skill}
                  </Text>
                </Button>
              )
            })}
          </Flex>
        </Flex>
      </Flex>
    )
  }
}

// helper function that returns the master skill id by the skill name
function getIdBySkill(data: MasterSkill[], skill: string): string | undefined {
  const foundItem = data.find((obj) => obj.skill === skill)
  return foundItem ? foundItem.id : undefined
}

export default EditSkills
