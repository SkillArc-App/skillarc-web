import { Heading } from '@/app/components/Heading'
import { Text } from '@/app/components/Text.component'
import { Job } from '@/common/types/Job'
import { Flex, ListItem } from '@chakra-ui/react'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'
import ReactMarkdown from 'react-markdown'

export const Requirements = ({ job }: { job: Job }) => {
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
        {job && job.requirementsDescription && (
          <ReactMarkdown
            // eslint-disable-next-line react/no-children-prop
            children={job.requirementsDescription}
            components={ChakraUIRenderer(newTheme)}
            skipHtml
          />
        )}
      </div>
    </Flex>
  )
}
