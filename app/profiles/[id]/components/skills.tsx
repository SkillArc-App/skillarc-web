import { Heading } from '@/components/Heading'
import { Text } from '@/components/Text.component'
import { GetOneProfileResponse } from '@/services/profile.service'
import { Badge, Divider, Flex, VStack } from '@chakra-ui/react'
import { FaScrewdriverWrench } from 'react-icons/fa6'
import { ProfileBox } from './profileBox'

export const ProfileSkills = ({ seeker }: { seeker: GetOneProfileResponse }) => {
  if (seeker.profileSkills.length === 0 && !seeker.isProfileEditor) return <></>

  const technicalSkills = seeker.profileSkills.filter(
    ({ masterSkill }) => masterSkill.type == 'TECHNICAL',
  )
  const personalSkills = seeker.profileSkills.filter(
    ({ masterSkill }) => masterSkill.type == 'PERSONAL',
  )

  return (
    <ProfileBox
      title="Skills"
      icon={FaScrewdriverWrench}
      isProfileEditor={seeker.isProfileEditor}
      ctaHref={`${seeker.id}/edit/skills`}
    >
      <VStack align="left" pt="1rem" gap={2}>
        {technicalSkills.length !== 0 && (
          <>
            <Heading variant="h4" color={'greyscale.700'}>
              Technical Competencies
            </Heading>
            <Flex flexDir={'column'} gap="1.5rem">
              {technicalSkills.map((skill, index) => {
                return (
                  <Flex flexDir={'column'} gap="0.5rem" key={index}>
                    <Badge variant="primary" w="fit-content">
                      {skill.masterSkill.skill}
                    </Badge>
                    <Text type="b2">{skill.description}</Text>
                  </Flex>
                )
              })}
            </Flex>

            <Divider borderColor="greyscale.300" />
          </>
        )}
        {personalSkills.length !== 0 && (
          <>
            <Heading variant="h4" color={'greyscale.700'}>
              Soft Skills
            </Heading>
            <Flex flexDir={'column'} gap="1.5rem">
              {personalSkills.map((skill, index) => {
                return (
                  <Flex flexDir={'column'} gap="0.5rem" key={index}>
                    <Badge variant="secondary" w="fit-content">
                      {skill.masterSkill.skill}
                    </Badge>
                    <Text type="b2">{skill.description}</Text>
                  </Flex>
                )
              })}
            </Flex>
          </>
        )}
      </VStack>
    </ProfileBox>
  )
}
