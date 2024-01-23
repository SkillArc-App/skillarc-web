import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { Success } from '@/frontend/icons/Success.icon'
import { GetOneJobPosting } from '@/frontend/services/jobs.service'
import { FullUser } from '@/frontend/services/user.service'
import { Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { useRouter } from 'next/router'

type ApplyModalsProps = {
  isSuccessModalOpen: boolean
  onSuccessModalOpen: () => void
  onSuccessModalClose: () => void
  isApplyModalOpen: boolean
  onApplyModalOpen: () => void
  onApplyModalClose: () => void
  user: FullUser | undefined
  job: GetOneJobPosting
  handleBackToJobs?: () => void
  handleApplyClick: () => void
}

export const ApplyModals = ({
  isSuccessModalOpen,
  onSuccessModalClose,
  isApplyModalOpen,
  onApplyModalClose,
  user,
  job,
  handleBackToJobs,
  handleApplyClick,
}: ApplyModalsProps) => {
  const router = useRouter()

  return (
    <>
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
                  onClick={() => router.push(`profiles/${user?.profile?.id}`)}
                >
                  Update your profile
                </Button>
                <Button
                  variant="secondary"
                  w="100%"
                  onClick={() => {
                    window.location.assign('https://meetings.hubspot.com/hannah-wexner')
                  }}
                >
                  Meet a free career coach
                </Button>
                {handleBackToJobs && (
                  <Text
                    type="b1Bold"
                    color="#6C757D"
                    textAlign="center"
                    w="100%"
                    textDecorationLine="underline"
                    cursor="pointer"
                    onClick={handleBackToJobs}
                  >
                    Explore other matches
                  </Text>
                )}
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
              <Heading type="h3" color="greyscale.900">
                Apply with SkillArc
              </Heading>
              <Flex flexWrap="wrap" w="100%">
                <Text type="b1" color="greyscale.600" marginRight="4px">
                  Would you like to apply to
                </Text>
                <Text type="b1Bold" color="primary.500" marginRight="4px">
                  {job.employment_title}
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
                  Apply with SkillArc Profile
                </Button>
                <Button variant="secondary" w="100%" onClick={() => onApplyModalClose()}>
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
