'use client'

import { AllResponses, OnboardingResponse } from '@/common/types/OnboardingResponse'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useOnboardingData } from '@/frontend/hooks/useOnboardingData'
import { put } from '@/frontend/http-common'
import { Employment } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/Employment.component'
import { NewEducation } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/NewEductation.component'
import { NewName } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/NewName.component'
import { NewOpportunityInterests } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/NewOpportunityInterests.component'
import { Reliability } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/Reliability.component'
import { Training } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/Training.component'
import { Flex, Progress } from '@chakra-ui/react'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Onboarding = () => {
  const router = useRouter()
  const { currentStep } = useFixedParams('currentStep')
  const token = useAuthToken()

  const jobInterest = localStorage.getItem('preOnboardingJobInterest')
  if (jobInterest) {
    localStorage.setItem('onboardingJobInterest', jobInterest)
    localStorage.removeItem('preOnboardingJobInterest')
  }

  const {
    getOnboardingData: {
      data: onboardingData,
      status: onboardingStatus,
      refetch: refetchOnboardingData,
    },
  } = useOnboardingData(token)

  useEffect(() => {
    if (onboardingStatus !== 'success') return
    if (!token) return

    const routeToSlug = (newSlug: string) => {
      if (newSlug !== currentStep) {
        router.push(`/onboarding/${newSlug}`)
      }
    }

    if (!onboardingData?.id) {
      return
    }

    if (onboardingData.completedAt) {
      router.push('/')
      return
    }

    if (!onboardingData.responses.name) {
      routeToSlug('name')
      return
    }

    if (!onboardingData.responses.reliability) {
      routeToSlug('reliability')
      return
    }

    const reliability = onboardingData.responses.reliability.response

    if (
      reliability.includes("I've had or currently have a job") &&
      !onboardingData.responses.experience
    ) {
      routeToSlug('employment')
      return
    }

    if (
      reliability.includes("I've attended a Training Program") &&
      !onboardingData.responses.trainingProvider
    ) {
      routeToSlug('training')
      return
    }

    if (
      reliability.includes('I have a High School Diploma / GED') &&
      !onboardingData.responses.education
    ) {
      routeToSlug('education')
      return
    }

    if (!onboardingData.responses.opportunityInterests) {
      routeToSlug('opportunities')
      return
    }
  }, [currentStep, onboardingData, onboardingStatus, router, token])

  const [workingOnboardingResponse, setWorkingOnboardingResponse] = useState<OnboardingResponse>({
    responses: { ...onboardingData?.responses },
  })

  useEffect(() => {
    if (onboardingStatus === 'success') {
      setWorkingOnboardingResponse((onboarding) => {
        return {
          ...onboarding,
          responses: onboardingData?.responses,
        }
      })
    }
  }, [onboardingStatus, onboardingData])

  const onSubmit = (responses: Partial<AllResponses>) => {
    if (!token) return

    const newOnboardingResponse: OnboardingResponse = {
      ...workingOnboardingResponse,
      responses: { ...workingOnboardingResponse.responses, ...responses },
    }

    setWorkingOnboardingResponse(newOnboardingResponse)

    put(
      `${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions/${onboardingData?.id}`,
      {
        responses: newOnboardingResponse.responses,
      },
      token,
      { camel: false },
    ).then((_) => {
      refetchOnboardingData()
    })
  }

  console.log(workingOnboardingResponse)

  const stepScreen = (currentStep: string | undefined) => {
    if (!currentStep) return <LoadingPage />
    if (currentStep === 'name') return <NewName onSubmit={onSubmit} />
    if (currentStep === 'reliability') return <Reliability onSubmit={onSubmit} />
    if (currentStep === 'employment') return <Employment onSubmit={onSubmit} />
    if (currentStep === 'training') return <Training onSubmit={onSubmit} />
    if (currentStep === 'education') return <NewEducation onSubmit={onSubmit} />
    if (currentStep === 'opportunities' || currentStep === 'complete') {
      return <NewOpportunityInterests onSubmit={onSubmit} />
    }
  }

  const stepProgress = (currentStep: string | undefined) => {
    if (!currentStep) return 0

    if (currentStep === 'name') {
      return 10
    }

    if (currentStep === 'reliability') {
      return 20
    }

    if (currentStep === 'employment') {
      return 50
    }

    if (currentStep === 'training') {
      return 60
    }

    if (currentStep === 'education') {
      return 80
    }

    if (currentStep === 'opportunities') {
      return 90
    }
  }

  const screen = stepScreen(currentStep)
  const progress = stepProgress(currentStep)

  if (screen)
    return (
      <>
        <Flex bg={'greyscale.100'} w="100%">
          <Flex flexDir={'column'} px={'1rem'} py={'1.5rem'} gap={'0.5rem'} width={'100%'}>
            <Progress
              mb={'2rem'}
              borderRadius={'2px'}
              colorScheme="green"
              size="sm"
              value={progress}
            />
            {screen}
          </Flex>
        </Flex>
      </>
    )

  return <></>
}

export default withAuthenticationRequired(Onboarding)
