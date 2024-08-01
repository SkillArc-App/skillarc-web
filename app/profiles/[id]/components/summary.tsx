import { Heading } from '@/components/Heading'
import { downloadResume } from '@/documents/downloadResume'
import { useResumeMutation } from '@/documents/hooks/useResumeMutation'
import { useResumesQuery } from '@/documents/hooks/useResumesQuery'
import { DocumentKind } from '@/documents/types'
import { useAuthToken } from '@/hooks/useAuthToken'
import { GetOneProfileResponse } from '@/services/profile.service'
import { copyTextToClipboard } from '@/utils/clipboard.util'
import { delay } from '@/utils/delay'
import { LinkIcon } from '@chakra-ui/icons'
import { Button, Flex, Stack, useToast } from '@chakra-ui/react'
import Link from 'next/link'
import { useState } from 'react'
import { FaBriefcase, FaFileDownload, FaFilePdf } from 'react-icons/fa'
import { Text } from '../../../components/Text.component'
import EditIconButton from './EditIconButton'

export const ProfileSummary = ({ seeker }: { seeker: GetOneProfileResponse }) => {
  const toast = useToast()
  const token = useAuthToken()
  const { data: resumes = [], refetch } = useResumesQuery(seeker.id, { refetchInterval: 5000 })
  const resumeGeneration = useResumeMutation()
  const downloadAbleResume = resumes
    .filter((r) => !!r.generatedAt)
    .sort((a, b) => Date.parse(b.generatedAt as string) - Date.parse(a.generatedAt as string))[0]
  const [isLoading, setIsLoading] = useState(false)

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

  const onGenerateResume = async () => {
    setIsLoading(true)
    await resumeGeneration.mutateAsync({
      personId: seeker.id,
      anonymized: false,
      documentKind: DocumentKind.PDF,
      checks: [],
    })

    await delay(2000)
    refetch()
    setIsLoading(false)
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
              <EditIconButton href={`${seeker.id}/edit/summary`} label="Edit Profile" />
            )}
          </Flex>
          <Stack>
            <Text>Summary: {seeker.about}</Text>
            <Text type="b3">Email: {seeker.user.email}</Text>
            <Text type="b3">ZIP Code: {seeker.user.zipCode}</Text>
            <Text type="b3">Phone Number: {seeker.user.phoneNumber}</Text>
          </Stack>
        </Flex>
      </Flex>
      {seeker.isProfileEditor && (
        <Flex w="100%" flexWrap="wrap" gap=".75rem" marginTop="1rem">
          <Button flexGrow={1} variant="primary" leftIcon={<LinkIcon />} onClick={handleCopy}>
            Copy Profile Link
          </Button>
          <Button flexGrow={1} variant="primary" as={Link} href="/jobs" leftIcon={<FaBriefcase />}>
            View Jobs
          </Button>
          <Button
            flexGrow={1}
            variant="primary"
            leftIcon={<FaFilePdf />}
            onClick={onGenerateResume}
          >
            Generate Resume
          </Button>
          {downloadAbleResume && token && (
            <Button
              flexGrow={1}
              variant="primary"
              isLoading={isLoading}
              leftIcon={<FaFileDownload />}
              onClick={() => downloadResume(downloadAbleResume.id, token)}
            >
              Download Resume
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  )
}
