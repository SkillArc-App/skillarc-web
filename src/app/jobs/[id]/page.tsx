'use client'

import { IdParams } from '@/app/common/types/PageParams'
import { Heading } from '@/app/components/Heading'
import { LoadingPage } from '@/app/components/Loading'
import { Text } from '@/app/components/Text.component'
import { useAuthToken } from '@/app/hooks/useAuthToken'
import { useUser } from '@/app/hooks/useUser'
import { Success } from '@/app/icons/Success'
import { SingleJobPosting } from '@/app/jobs/[id]/components/SingleJobPosting'
import useApply from '@/app/jobs/hooks/useApply'
import useUserState, { UserState } from '@/app/jobs/hooks/useUserState'
import { FrontendJobInteractionsService } from '@/app/services/jobInteractions.service'
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useJob } from '../hooks/useJobData'

export default function JobPosting({ params: { id } }: IdParams) {
  const { data: job, refetch } = useJob(id)

  const { data: user } = useUser()
  const token = useAuthToken()
  const userState = useUserState()

  const loadedJob = !!job?.id

  const {
    isOpen: isSuccessModalOpen,
    onOpen: onSuccessModalOpen,
    onClose: onSuccessModalClose,
  } = useDisclosure()
  const {
    isOpen: isApplyModalOpen,
    onOpen: onApplyModalOpen,
    onClose: onApplyModalClose,
  } = useDisclosure()

  const handleApplyClick = async () => {
    if (!loadedJob || !token || userState !== UserState.Ready) {
      return
    }

    onApplyModalClose()
    await FrontendJobInteractionsService.apply(job.id, token)

    await onSuccessModalOpen()
    await refetch()
  }

  const { applyCopy, onApply } = useApply({ job, onReadyToApply: onApplyModalOpen })

  if (!job) {
    return <LoadingPage></LoadingPage>
  }

  return (
    <>
      <Flex flexWrap="wrap" mb="156px">
        <SingleJobPosting job={job} />
        <Flex w="100%" p="1rem" gap="1rem" flexWrap="wrap" zIndex={2} position="fixed" bottom="0px">
          {!job.applicationStatus && (
            <Button w="100%" variant="primary" onClick={onApply}>
              {applyCopy}
            </Button>
          )}
        </Flex>
      </Flex>
      <Modal isOpen={isSuccessModalOpen} onClose={onSuccessModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex w="100%" h="100%" flexWrap="wrap" justifyContent="center">
              <Success boxSize="50%" />
              <Flex w="100%" flexWrap="wrap" gap=".5rem" marginTop="1.5rem">
                <Heading type="h3" color="#212529" w="100%">
                  Great work, {user?.firstName} 🎉
                </Heading>
                <Flex w="100%"></Flex>
                <Text type="b2" color="#6C757D">
                  We&apos;re sharing your SkillArc profile with <strong>{job.employer.name}</strong>{' '}
                  to start the application process.
                </Text>
                <Text type="b2" color="#6C757D">
                  Keep an eye on your email for next steps!
                </Text>
                <Text type="b2" color="#6C757D">
                  - The SkillArc team 😄
                </Text>
              </Flex>
              <Flex w="100%" gap="1rem" flexWrap="wrap" my="1.5rem">
                <Button
                  variant="primary"
                  w="100%"
                  as={Link}
                  href={`/profiles/${user?.profile?.id}`}
                >
                  Update your profile
                </Button>
                <Button
                  variant="secondary"
                  w="100%"
                  as={Link}
                  href={'https://meetings.hubspot.com/hannah-wexner'}
                >
                  Meet a free career coach
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isApplyModalOpen} onClose={onApplyModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody py="1rem">
            <Flex w="100%" h="100%" flexWrap="wrap" gap="24px">
              <Heading type="h3" color="greyscale.900"></Heading>
              <Flex flexWrap="wrap" w="100%">
                <Text type="b1" color="greyscale.600" marginRight="4px">
                  Would you like to apply to
                </Text>
                <Text type="b1Bold" color="primary.500" marginRight="4px">
                  {job.employmentTitle}
                </Text>
                <Text type="b1" color="greyscale.600" marginRight="4px">
                  at
                </Text>
                <Text type="b1Bold" color="greyscale.600">
                  {job.employer.name}
                </Text>
                <Text type="b1" color="greyscale.600" marginRight="4px">
                  ?
                </Text>
              </Flex>
              <Flex w="100%" gap="1rem" flexWrap="wrap">
                <Button variant="primary" w="100%" onClick={handleApplyClick}>
                  {applyCopy}
                </Button>
                <Button variant="secondary" w="100%" onClick={onApplyModalClose}>
                  Go Back
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
