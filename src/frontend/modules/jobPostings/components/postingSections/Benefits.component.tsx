import { Heading } from '@/frontend/components/Heading.component'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  ListItem,
} from '@chakra-ui/react'
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

export const Benefits = ({ data }: { data: GetOneJobPosting }) => {
  function trackToggleAnalytics(): void {
    FrontendAnalyticsService.track('Job-dropdown-toggled', {
      job: data,
      jobId: data.id,
      dropdown: 'Benefits',
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
    <Accordion
      allowMultiple
      w="100%"
      bg="white"
      p="1rem"
      borderRadius="4px"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
    >
      <AccordionItem>
        <AccordionButton alignItems="top" p="0" onClick={() => trackToggleAnalytics()}>
          <Heading variant="h4" color="greyscale.700" w="100%" textAlign="left">
            🎉 Benefits
          </Heading>

          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          {data && data.benefits_description && (
            <ReactMarkdown
              children={data.benefits_description}
              components={ChakraUIRenderer(newTheme)}
              skipHtml
            />
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
