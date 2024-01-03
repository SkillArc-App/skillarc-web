import { Heading } from '@/frontend/components/Heading.component'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { Briefcase } from '@/frontend/icons/Briefcase.icon'
import { copyTextToClipboard } from '@/frontend/utils/clipboard.util'
import { EditIcon, LinkIcon } from '@chakra-ui/icons'
import { Button, Flex, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Text } from '../../../components/Text.component'

export const ProfileSummary = () => {
  const router = useRouter()
  const toast = useToast()
  const { profileId } = router.query
  const {
    profileQuery: { data },
    isMyProfile,
  } = useProfileData(profileId as string)

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
              {data?.user.first_name} {data?.user.last_name}
            </Heading>
            {isMyProfile && (
              <Button
                variant={'icon'}
                color="greyscale.600"
                onClick={() =>
                  router.push({
                    pathname: `${profileId}/editProfile`,
                    query: { section: 'summary' },
                  })
                }
              >
                <EditIcon />
              </Button>
            )}
          </Flex>

          <Text type="b3" color="greyscale.600" w="100%">
            ZIP Code: {data?.user.zip_code}
          </Text>
          <Text type="b3" color="greyscale.600" w="100%">
            Phone Number: {data?.user.phone_number}
          </Text>

          {/* <Text
            color="primary.600"
            type="b2Bold"
            bg="greyscale.300"
            p="4px 8px"
            borderRadius="4px"
            maxH="1.625rem"
          >
            Open to Work
          </Text> */}
        </Flex>
      </Flex>
      <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1rem">
        {isMyProfile && (
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
              leftIcon={<Briefcase h="18px" />}
              onClick={() => router.push(`/jobs`)}
            >
              <Text type="b2Bold" color="greyscale.100">
                View Jobs
              </Text>
            </Button>
          </Flex>
        )}
        {/* <Button
          variant="secondary"
          bg="greyscale.100"
          w="100%"
          h="3.25rem"
          leftIcon={<Bookmark fill="greyscale.100" />}
        >
          <Text type="b2Bold" color="greyscale.700">
            Bookmark Profile
          </Text>
        </Button> */}
      </Flex>
    </Flex>
  )
}
