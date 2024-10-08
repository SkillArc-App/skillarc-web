import { Job } from '@/common/types/Job'
import { Heading } from '@/components/Heading'
import { Text } from '@/components/Text.component'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  ListItem,
} from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import ReactMarkdown from 'react-markdown'

export const Benefits = ({ job }: { job: Job }) => {
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
        <AccordionButton alignItems="top" p="0">
          <Heading variant="h4" color="greyscale.700" w="100%" textAlign="left">
            🎉 Benefits
          </Heading>

          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          {job && job.benefitsDescription && (
            <ReactMarkdown
              // eslint-disable-next-line react/no-children-prop
              children={job.benefitsDescription}
              components={ChakraUIRenderer(newTheme)}
              skipHtml
            />
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
