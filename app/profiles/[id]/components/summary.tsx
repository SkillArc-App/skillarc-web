import { Heading } from '@/components/Heading'
import { Briefcase } from '@/icons/Briefcase'
import { GetOneProfileResponse } from '@/services/profile.service'
import { copyTextToClipboard } from '@/utils/clipboard.util'
import { EditIcon, LinkIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Stack, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import { Text } from '../../../components/Text.component'

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
            {seeker.isProfileEditor && (
              <Button
                variant={'icon'}
                as={Link}
                href={`${seeker.id}/edit/summary`}
                color="greyscale.600"
                aria-label="Edit Profile"
              >
                <EditIcon />
              </Button>
            )}
          </Flex>
          <Stack gap={'1rem'}>
            {seeker.about && <Text>{seeker.about}</Text>}
            <Box>
              {(seeker.user.zipCode || seeker.isProfileEditor) && (
                <Text type="b3" color="greyscale.600" w="100%">
                  ZIP Code: {seeker.user.zipCode}
                </Text>
              )}
              {(seeker.user.phoneNumber || seeker.isProfileEditor) && (
                <Text type="b3" color="greyscale.600" w="100%">
                  Phone Number: {seeker.user.phoneNumber}
                </Text>
              )}
            </Box>
          </Stack>
        </Flex>
      </Flex>
      <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1rem">
        {seeker.isProfileEditor && (
          <Flex w="100%" gap=".75rem">
            <Button
              variant="primary"
              w="100%"
              h="3.25rem"
              leftIcon={<LinkIcon fill="greyscale.100" />}
              onClick={handleCopy}
            >
              <Text type="b2Bold" color="greyscale.100">
                Copy Profile Link
              </Text>
            </Button>
            <Button
              variant="primary"
              w="100%"
              h="3.25rem"
              as={Link}
              href="/jobs"
              leftIcon={<Briefcase h="18px" />}
            >
              <Text type="b2Bold" color="greyscale.100">
                View Jobs
              </Text>
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
