import { Heading } from '@/components/Heading'
import { GetOneProfileResponse } from '@/services/profile.service'
import { copyTextToClipboard } from '@/utils/clipboard.util'
import { LinkIcon } from '@chakra-ui/icons'
import { Button, Flex, Stack, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import { FaBriefcase } from 'react-icons/fa'
import { Text } from '../../../components/Text.component'
import EditIconButton from './EditIconButton'

export const ProfileSummary = ({ seeker }: { seeker: GetOneProfileResponse }) => {
  const toast = useToast()

  const handleCopy = () => {
    copyTextToClipboard(window.location.href).then(() => {
      toast({
        title: 'Copied to clipboard',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      })
    })
  }

  return (
    <Flex
      p="1rem"
      flexWrap="wrap"
      bg="greyscale.100"
      boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
      style={{ zIndex: 1 }}
      flexGrow={1}
    >
      <Flex gap="1rem" w="100%">
        <Flex w="100%" alignSelf={'center'} gap="0.5rem" flexDir={'column'}>
          <Flex w="100%" gap={2}>
            <Heading type="h2" color="greyscale.900" w="100%" alignSelf={'center'}>
              {seeker.user.firstName} {seeker.user.lastName}
            </Heading>
            {seeker.isProfileEditor && <EditIconButton href={`${seeker.id}/edit/summary`} />}
          </Flex>
          <Stack>
            <Text>About: {seeker.about}</Text>
            <Text type="b3">Email: {seeker.user.email}</Text>
            <Text type="b3">ZIP Code: {seeker.user.zipCode}</Text>
            <Text type="b3">Phone Number: {seeker.user.phoneNumber}</Text>
          </Stack>
        </Flex>
      </Flex>
      <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1rem">
        {seeker.isProfileEditor && (
          <Flex w="100%" gap=".75rem">
            <Button variant="primary" w="100%" leftIcon={<LinkIcon />} onClick={handleCopy}>
              Copy Profile Link
            </Button>
            <Button variant="primary" w="100%" as={Link} href="/jobs" leftIcon={<FaBriefcase />}>
              View Jobs
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
