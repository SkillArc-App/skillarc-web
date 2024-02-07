import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useUser } from '@/frontend/hooks/useUser'
import { Button, Flex, Input, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export const EditReferences = () => {
  const router = useRouter()
  const { data: user } = useUser()

  return (
    <Flex p="1rem" w="100%" gap="1rem" flexDir="column">
      <Heading variant="h2">Edit References</Heading>
      <Flex
        p="1rem"
        bg="white"
        gap="1rem"
        flexDir="column"
        borderRadius="4px"
        boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      >
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Name</Text>
          <Input></Input>
        </Flex>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Title</Text>
          <Input></Input>
        </Flex>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Quote</Text>
          <Textarea></Textarea>
        </Flex>
      </Flex>
      <Flex flexDir="column" gap="1rem">
        <Button variant="secondary">Add another</Button>
        <Button variant="primary" onClick={() => router.push(`${user?.profile?.id}`)}>
          Save Changes
        </Button>
      </Flex>
    </Flex>
  )
}
