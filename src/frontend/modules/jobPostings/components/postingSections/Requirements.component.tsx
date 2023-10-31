import { Heading } from '@/frontend/components/Heading.component'
import { Flex, ListItem } from '@chakra-ui/react'
import {
  CareerPath,
  Employer,
  Job,
  JobPhoto,
  MasterCertification,
  MasterSkill,
  Testimonial,
} from '@prisma/client'
import ReactMarkdown from 'react-markdown'
import { Text } from '../../../../components/Text.component'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'

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

export const Requirements = ({ data }: { data: GetOneJobPosting }) => {
  function trackToggleAnalytics(): void {
    FrontendAnalyticsService.track('Job-dropdown-toggled', {
      job: data,
      jobId: data.id,
      dropdown: 'Requirements',
    })
  }

  const newTheme = {
    p: (props: any) => {
      const { children } = props
      return (
        <Text type="b2" color="#6C757D" marginTop=".5rem">
          {children}
        </Text>
      )
    },
    li: (props: any) => {
      const { children } = props
      return <ListItem color="#6C757D">{children}</ListItem>
    },
    h1: (props: any) => {
      const { children } = props
      return (
        <Heading type="h3" color="#6C757D" marginTop=".5rem">
          {children}
        </Heading>
      )
    },
    h2: (props: any) => {
      const { children } = props
      return (
        <Heading type="h4" color="#6C757D" marginTop=".5rem">
          {children}
        </Heading>
      )
    },
    h3: (props: any) => {
      const { children } = props
      return (
        <Heading type="h5" color="#6C757D" marginTop=".5rem">
          {children}
        </Heading>
      )
    },
    h4: (props: any) => {
      const { children } = props
      return (
        <Heading type="h6" color="#6C757D" marginTop=".5rem">
          {children}
        </Heading>
      )
    },
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
      <Heading type="h4" color="greyscale.700" w="100%">
        📋 Requirements
      </Heading>

      <div>
        {data && data.requirements_description && (
          <ReactMarkdown
            children={data.requirements_description}
            components={ChakraUIRenderer(newTheme)}
            skipHtml
          />
        )}
      </div>
    </Flex>
  )
}
