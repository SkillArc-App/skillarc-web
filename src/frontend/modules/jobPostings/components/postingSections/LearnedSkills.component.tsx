import { Heading } from '@/frontend/components/Heading.component'
import { Logo } from '@/frontend/icons/Logo.icon'
import { TriangleLeft } from '@/frontend/icons/TriangleLeft.icon'
import { Flex, Tag } from '@chakra-ui/react'
import { Text } from '../../../../components/Text.component'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'

export const LearnedSkills = ({ data }: { data: GetOneJobPosting }) => {
  return (
    <Flex
      bg="white"
      w="100%"
      p="1rem"
      borderRadius=".25rem"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
      flexWrap="wrap"
      gap="1rem"
    >
      <Heading type="h4" color="greyscale.700" w="100%">
        🧠 What you&apos;ll learn
      </Heading>
      <Flex w="100%" flexWrap="wrap" gap=".5rem">
        <Text type="overline" color="greyscale.700" w="100%">
          TECHNICAL COMPETENCIES
        </Text>
        {/* Map over technical skills here */}
        {data &&
          data.learnedSkills &&
          data.learnedSkills.map((skill: any, index: number) => {
            if (skill.masterSkill.type == 'TECHNICAL') {
              return <SkillTag key={index} skill={skill.masterSkill.skill} skillType="technical" />
            }
          })}
      </Flex>
      <Flex w="100%" flexWrap="wrap" gap=".5rem">
        <Text type="overline" color="greyscale.700" w="100%">
          SOFT SKILLS
        </Text>
        {/* Map over personal skills here */}
        {data &&
          data.learnedSkills &&
          data.learnedSkills.map((skill: any, index: number) => {
            if (skill.masterSkill.type == 'PERSONAL') {
              return <SkillTag key={index} skill={skill.masterSkill.skill} skillType="personal" />
            }
          })}
      </Flex>
      <Flex w="100%" flexDir="row" alignItems="center">
        <Logo boxSize="28px" />
        <TriangleLeft />
        <Flex borderRadius="4px" bg="greyscale.900">
          <Text type="b3" color="white" p="8px">
            You&apos;re going to learn a lot!
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

const SkillTag = (skillTag: { skill: string; skillType: string }) => {
  return (
    <Tag
      borderRadius="900px"
      bgColor="white"
      border={skillTag.skillType == 'technical' ? '1px solid #008640' : '1px solid #6C757D'}
    >
      <Text type="b3Bold" color={skillTag.skill == 'technical' ? 'primary.600' : 'greyscale.600'}>
        {skillTag.skill}
      </Text>
    </Tag>
  )
}
