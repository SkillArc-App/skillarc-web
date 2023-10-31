import { useJobData } from '@/frontend/hooks/useJobData'
import { useUser } from '@/frontend/hooks/useUser'
import { ApplyModals } from '@/frontend/modules/jobPostings/components/ApplyModals.component'
import { SingleJobPosting } from '@/frontend/modules/jobPostings/components/SingleJobPosting.component'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import { FrontendJobInteractionsService } from '@/frontend/services/jobInteractions.service'
import { Button, Flex, useDisclosure } from '@chakra-ui/react'
import { useAuth0 } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function jobPosting() {
  const router = useRouter()
  const { jobId } = router.query
  const {
    getOneJob: { data: job },
  } = useJobData(jobId as string)
  const { data: user } = useUser()

  const { getAccessTokenSilently, isAuthenticated, loginWithPopup } = useAuth0()
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated) return
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently, isAuthenticated])

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

  const handleApplyClick = () => {
    // Close apply modal
    onApplyModalClose()
    // update hasViewed and intent to apply field in db
    if (job) {
      FrontendAnalyticsService.track('Job-applied', {
        job: job,
        jobId: job.id,
      })
    }
    // create new job interaction
    if (user?.id && job?.id) {
      // FrontendJobInteractionsService.create({
      //   user_id: user.id,
      //   has_viewed: true,
      //   intent_to_apply: true,
      //   job_id: job.id,
      // })

      FrontendJobInteractionsService.apply(job.id, token)
    }
    // open Success modal
    onSuccessModalOpen()
  }

  const clickApply = () => {
    if (user?.id) {
      onApplyModalOpen()
    } else {
      loginWithPopup()
    }
  }

  return (
    <>
      <Flex flexWrap="wrap" mb="156px">
        <SingleJobPosting jobId={jobId as string} />
        <Flex
          w="100%"
          p="1rem"
          gap="1rem"
          flexWrap="wrap"
          bg="greyscale.100"
          zIndex={2}
          position="fixed"
          bottom="0px"
        >
          <Button w="100%" variant="primary" onClick={() => clickApply()}>
            Apply with Blocktrain Profile
          </Button>
        </Flex>
      </Flex>

      {job && (
        <ApplyModals
          user={user}
          job={job}
          isSuccessModalOpen={isSuccessModalOpen}
          onSuccessModalOpen={onSuccessModalOpen}
          onSuccessModalClose={onSuccessModalClose}
          isApplyModalOpen={isApplyModalOpen}
          onApplyModalOpen={onApplyModalOpen}
          onApplyModalClose={onApplyModalClose}
          handleApplyClick={handleApplyClick}
        />
      )}
    </>
  )
}
