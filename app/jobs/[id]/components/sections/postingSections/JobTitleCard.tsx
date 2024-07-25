import { Flex, Image, Tag } from '@chakra-ui/react'
import { Job } from 'app/common/types/Job'
import { Heading } from 'app/components/Heading'
import { Text } from 'app/components/Text.component'
import { pluralizeJobTitle } from 'app/helpers/pluralizeJobTitle'

interface DesiredSkillsProps {
  job: Job
}

export const JobTitleCard = ({ job }: DesiredSkillsProps) => {
  const technicalSkills = job.desiredSkills.filter(
    ({ masterSkill }) => masterSkill.type === 'TECHNICAL',
  )
  const personalSkills = job.desiredSkills.filter(
    ({ masterSkill }) => masterSkill.type === 'PERSONAL',
  )

  return (
    <Flex
      bg="white"
      w="100%"
      p="1rem"
      borderRadius=".25rem"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
      flexWrap="wrap"
    >
      <Flex flexDir="row" alignItems="center" gap=".5rem" w="100%">
        {job.employer.logoUrl && (
          <Image boxSize="60px" fit="contain" src={job.employer.logoUrl} alt="logo" />
        )}
        <Heading type="h3" color="greyscale.900" marginRight=".25rem">
          {job.employer.name}
        </Heading>
      </Flex>
      <Flex flexWrap="wrap" marginTop=".5rem">
        <Heading type="h3" color="greyscale.600" marginRight=".25rem">
          We&apos;re looking for
        </Heading>
        <Heading type="h3" color="primary.500" w="100%">
          {pluralizeJobTitle(job.employmentTitle)}
        </Heading>
        <Heading type="h3" color="greyscale.600" marginRight=".25rem">
          in
        </Heading>
        <Heading type="h3" color="greyscale.900">
          {job.location}
        </Heading>
        <Heading type="h3" color="greyscale.600">
          !
        </Heading>
      </Flex>
      {technicalSkills.length > 0 && (
        <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1.5rem">
          <Text type="overline" color="greyscale.700" w="100%">
            TECHNICAL COMPETENCIES
          </Text>
          {technicalSkills.map((skill: any, index: number) => (
            <SkillTag key={index} skill={skill.masterSkill.skill} skillType="technical" />
          ))}
        </Flex>
      )}
      {personalSkills.length > 0 && (
        <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1.5rem">
          <Text type="overline" color="greyscale.700" w="100%">
            SOFT SKILLS
          </Text>
          {/* Map over personal skills here */}
          {personalSkills.map((skill: any, index: number) => (
            <SkillTag key={index} skill={skill.masterSkill.skill} skillType="personal" />
          ))}
        </Flex>
      )}
      {job.desiredCertifications.length > 0 && (
        <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1.5rem">
          <Text type="overline" color="greyscale.700" w="100%">
            CERTIFICATIONS
          </Text>
          {/* Map over certifications here */}
          {job.desiredCertifications.map((cert: any, index: number) => (
            <CertTag cert={cert.masterCertification.certification} key={index} />
          ))}
        </Flex>
      )}
    </Flex>
  )
}

type SkillTagProps = {
  skillType: 'technical' | 'personal'
  skill: string
}

const SkillTag = (skillTag: SkillTagProps) => (
  <Tag
    borderRadius="900px"
    bgColor="white"
    border={skillTag.skillType == 'technical' ? '1px solid #008640' : '1px solid #6C757D'}
  >
    <Text type="b3Bold" color={skillTag.skillType == 'technical' ? 'primary.600' : 'greyscale.600'}>
      {skillTag.skill}
    </Text>
  </Tag>
)

type CertTagProps = {
  cert: string
}

const CertTag = (certTag: CertTagProps) => (
  <Tag borderRadius="900px" bgColor="white" border={'1px solid #6C757D'}>
    <Text type="b3Bold" color={'greyscale.600'}>
      {certTag.cert}
    </Text>
  </Tag>
)
