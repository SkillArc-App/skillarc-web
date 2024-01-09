import { Flex, Tag, TagLeftIcon, Image } from '@chakra-ui/react'
import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '../../../../components/Text.component'
import { CheckIcon } from '@chakra-ui/icons'
import { Logo } from '@/frontend/icons/Logo.icon'
import { TriangleLeft } from '@/frontend/icons/TriangleLeft.icon'
import { SkillTag } from '@/common/types/SkillTag'
import {
  CareerPath,
  Employer,
  Job,
  JobPhoto,
  MasterCertification,
  MasterSkill,
  Testimonial,
} from '@prisma/client'
import { ProfileCertification, ProfileSkill } from '@/common/types/Profile'
import { pluralizeJobTitle } from '@/frontend/helpers/pluralizeJobTitle'

type GetOneJobPosting = {
  employer: Employer
  learnedSkills: {
    id: string
    masterSkillId: string
    masterSkill: MasterSkill
  }[]
  desiredSkills: {
    id: string
    masterSkillId: string
    masterSkill: MasterSkill
  }[]
  desiredCertifications: {
    id: string
    masterCertificationId: string
    masterCertification: MasterCertification
  }[]
  careerPaths: CareerPath[]
  jobPhotos: JobPhoto[]
  testimonials: Testimonial[]
} & Job

interface DesiredSkillsProps {
  data: GetOneJobPosting
  profileSkills?: ProfileSkill[]
  profileCertifications?: ProfileCertification[]
  percentMatch?: number
}

export const DesiredSkills = ({
  data,
  profileSkills,
  percentMatch,
  profileCertifications,
}: DesiredSkillsProps) => {
  const isSkillMatch = (desiredSkillId: string) => {
    if (profileSkills) {
      return profileSkills.some((skill) => skill.masterSkillId === desiredSkillId)
    }
    return false
  }
  const isCertMatch = (desiredCertificationId: string) => {
    if (profileCertifications) {
      return profileCertifications.some(
        (cert) => cert.masterCertificationId === desiredCertificationId,
      )
    }
    return false
  }

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
        {data && data.employer && data.employer.logo_url && (
          <Image boxSize="32px" objectFit="cover" src={data.employer.logo_url} alt="logo" />
        )}

        <Text type="b2" color="greyscale.900">
          {data?.employer?.name}
        </Text>
      </Flex>
      <Flex flexWrap="wrap" marginTop=".5rem">
        <Heading type="h3" color="greyscale.600" marginRight=".25rem">
          We&apos;re looking for
        </Heading>
        {data && data.employment_title && (
          <Heading type="h3" color="primary.500" w="100%">
            {pluralizeJobTitle(data.employment_title)}
          </Heading>
        )}
        <Heading type="h3" color="greyscale.600" marginRight=".25rem">
          in
        </Heading>
        <Heading type="h3" color="greyscale.900">
          {data?.location}
        </Heading>
        <Heading type="h3" color="greyscale.600">
          !
        </Heading>
      </Flex>
      <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1.5rem">
        <Text type="overline" color="greyscale.700" w="100%">
          TECHNICAL COMPETENCIES
        </Text>
        {/* Map over technical skills here */}
        {data &&
          data.desiredSkills &&
          data.desiredSkills.map((skill: any, index: number) => {
            if (skill.masterSkill.type === 'TECHNICAL') {
              const isMatch = isSkillMatch(skill.masterSkillId) // Check if the desired skill is a match
              return (
                <SkillTag
                  key={index}
                  isMatch={isMatch}
                  skill={skill.masterSkill.skill}
                  skillType="technical"
                />
              )
            }
          })}
      </Flex>
      <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1.5rem">
        <Text type="overline" color="greyscale.700" w="100%">
          SOFT SKILLS
        </Text>
        {/* Map over personal skills here */}
        {data &&
          data.desiredSkills &&
          data.desiredSkills.map((skill: any, index: number) => {
            if (skill.masterSkill.type == 'PERSONAL') {
              const isMatch = isSkillMatch(skill.masterSkillId) // Check if the desired skill is a match
              return (
                <SkillTag
                  key={index}
                  // This isMatch prop will dynamically change based on matches with seekers profile
                  isMatch={isMatch}
                  skill={skill.masterSkill.skill}
                  skillType="personal"
                />
              )
            }
          })}
      </Flex>
      <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1.5rem">
        <Text type="overline" color="greyscale.700" w="100%">
          CERTIFICATIONS
        </Text>
        {/* Map over certifications here */}
        {data &&
          data.desiredCertifications &&
          data.desiredCertifications.map((cert: any, index: number) => {
            const isMatch = isCertMatch(cert.masterCertificationId) // Check if the desired cert is a match
            return (
              <CertTag
                cert={cert.masterCertification.certification}
                key={index}
                isCertMatch={isMatch}
              />
            )
          })}
      </Flex>
      {percentMatch && percentMatch >= 49 ? (
        <Flex w="100%" flexDir="row" alignItems="center" marginTop="1.5rem">
          <Logo boxSize="28px" />
          <TriangleLeft />
          <Flex borderRadius="4px" bg="greyscale.900">
            <Text type="b3" color="white" p="8px">
              You&apos;d be a great fit!
            </Text>
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  )
}

const SkillTag = (skillTag: SkillTag) => {
  if (skillTag.isMatch) {
    return (
      <Tag
        borderRadius="900px"
        bgColor={skillTag.skillType == 'technical' ? 'primary.100' : 'greyscale.300'}
      >
        <TagLeftIcon boxSize="12px" as={CheckIcon} color="greyscale.900" />
        <Text type="b3Bold" color="greyscale.900">
          {skillTag.skill}
        </Text>
      </Tag>
    )
  } else {
    return (
      <Tag
        borderRadius="900px"
        bgColor="white"
        border={skillTag.skillType == 'technical' ? '1px solid #008640' : '1px solid #6C757D'}
      >
        <Text
          type="b3Bold"
          color={skillTag.skillType == 'technical' ? 'primary.600' : 'greyscale.600'}
        >
          {skillTag.skill}
        </Text>
      </Tag>
    )
  }
}

export type CertTag = {
  isCertMatch?: boolean
  cert: string
}

const CertTag = (certTag: CertTag) => {
  if (certTag.isCertMatch) {
    return (
      <Tag borderRadius="900px" bgColor={'greyscale.300'}>
        <TagLeftIcon boxSize="12px" as={CheckIcon} color="greyscale.900" />
        <Text type="b3Bold" color="greyscale.900">
          {certTag.cert}
        </Text>
      </Tag>
    )
  } else {
    return (
      <Tag borderRadius="900px" bgColor="white" border={'1px solid #6C757D'}>
        <Text type="b3Bold" color={'greyscale.600'}>
          {certTag.cert}
        </Text>
      </Tag>
    )
  }
}
