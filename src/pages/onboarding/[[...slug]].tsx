import { onBoardingResponse } from '@/common/types/onBoardingResponse'
import { LoadingPage } from '@/frontend/components/Loading'
import { useOnboardingData } from '@/frontend/hooks/useOnboardingData'
import { Employment } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/Employment.component'
import { NewEducation } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/NewEductation.component'
import { NewName } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/NewName.component'
import { NewOpportunityInterests } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/NewOpportunityInterests.component'
import { Other } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/Other.component'
import { Reliability } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/Reliability.component'
import { Training } from '@/frontend/modules/onBoarding/components/onBoardingQuestions/Training.component'
import { Flex, Progress } from '@chakra-ui/react'
import axios from 'axios'
import { useAuth0, withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Onboarding = () => {
  const router = useRouter()

  const { getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<string | null>(null)

  const { slug } = router.query
  const currentStep = slug?.at(0)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  const {
    getOnboardingData: {
      data: onboardingData,
      isLoading: onboardingDataIsLoading,
      isFetching: onboardingDataIsFetching,
      refetch: refetchOnboardingData,
    },
  } = useOnboardingData(token)

  useEffect(() => {
    if (onboardingDataIsLoading) return
    if (onboardingDataIsFetching) return
    if (!token) return

    const routeToSlug = (newSlug: string) => {
      if (newSlug !== currentStep) {
        router.push(`/onboarding/${newSlug}`, undefined, { shallow: true })
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

    if (
      reliability.includes("I have other experience I'd like to share") &&
      !onboardingData.responses.other
    ) {
      routeToSlug('other')
      return
    }

    if (!onboardingData.responses.opportunityInterests) {
      routeToSlug('opportunities')
      return
    }
  }, [currentStep, onboardingData, onboardingDataIsFetching, onboardingDataIsLoading, router, token])

  const [workingOnboardingResponse, setWorkingOnboardingResponse] = useState<onBoardingResponse>({
    responses: { ...onboardingData?.responses },
  })

  const onSubmit = () => {
    axios
      .create({ withCredentials: false })
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/onboarding_sessions/${onboardingData?.id}`,
        {
          responses: workingOnboardingResponse.responses,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((_) => {
        refetchOnboardingData()
      })
  }

  const stepScreen = (currentStep: string | undefined) => {
    if (!currentStep) return <LoadingPage />

    if (currentStep === 'name') {
      return (
        <NewName
          firstName={workingOnboardingResponse.responses?.name?.response?.firstName ?? ''}
          lastName={workingOnboardingResponse.responses?.name?.response?.lastName ?? ''}
          phoneNumber={workingOnboardingResponse.responses?.name?.response?.phoneNumber ?? ''}
          dateOfBirth={workingOnboardingResponse.responses?.name?.response?.dateOfBirth ?? ''}
          setFirstName={(firstName: string) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                name: {
                  ...workingOnboardingResponse.responses?.name,
                  response: {
                    ...workingOnboardingResponse.responses?.name?.response,
                    firstName,
                  },
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          setLastName={(lastName: string) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                name: {
                  ...workingOnboardingResponse.responses?.name,
                  response: {
                    ...workingOnboardingResponse.responses?.name?.response,
                    lastName,
                  },
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          setPhoneNumber={(phoneNumber: string) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                name: {
                  ...workingOnboardingResponse.responses?.name,
                  response: {
                    ...workingOnboardingResponse.responses?.name?.response,
                    phoneNumber,
                  },
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          setDateOfBirth={(dateOfBirth: string) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                name: {
                  ...workingOnboardingResponse.responses?.name,
                  response: {
                    ...workingOnboardingResponse.responses?.name?.response,
                    dateOfBirth,
                  },
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          onSubmit={onSubmit}
        />
      )
    }

    if (currentStep === 'reliability') {
      return (
        <Reliability
          selectedGoals={workingOnboardingResponse.responses?.reliability?.response ?? []}
          setSelectedGoals={(goals: string[]) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                reliability: {
                  ...workingOnboardingResponse.responses?.reliability,
                  response: goals,
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          onSubmit={onSubmit}
        />
      )
    }

    if (currentStep === 'employment') {
      return (
        <Employment
          experienceList={
            workingOnboardingResponse.responses?.experience?.response ?? [
              {
                company: '',
                position: '',
                startDate: '',
                current: false,
                endDate: '',
                description: '',
              },
            ]
          }
          setExperienceList={(experienceList) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                experience: {
                  ...workingOnboardingResponse.responses?.experience,
                  response: experienceList,
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          onSubmit={onSubmit}
        />
      )
    }

    if (currentStep === 'training') {
      return (
        <Training
          setTrainingProviders={(tps) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                trainingProvider: {
                  ...workingOnboardingResponse.responses?.trainingProvider,
                  response: tps,
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          trainingProviders={workingOnboardingResponse.responses?.trainingProvider?.response ?? []}
          onSubmit={onSubmit}
        />
      )
    }

    if (currentStep === 'education') {
      return (
        <NewEducation
          educationList={
            workingOnboardingResponse.responses?.education?.response ?? [
              { org: '', title: '', gradYear: '', gpa: '', activities: '' },
            ]
          }
          setEducationList={(educationList) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                education: {
                  ...workingOnboardingResponse.responses?.education,
                  response: educationList,
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          onSubmit={onSubmit}
        />
      )
    }

    if (currentStep === 'other') {
      return (
        <Other
          otherList={
            workingOnboardingResponse.responses?.other?.response ?? [
              {
                activity: '',
                startDate: '',
                endDate: '',
                learning: '',
              },
            ]
          }
          setOtherList={(otherList) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                other: {
                  ...workingOnboardingResponse.responses?.other,
                  response: otherList,
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          onSubmit={onSubmit}
        />
      )
    }

    if (currentStep === 'opportunities' || currentStep === 'complete') {
      return (
        <NewOpportunityInterests
          opportunityInterests={
            workingOnboardingResponse.responses?.opportunityInterests?.response ?? []
          }
          setOpportunityInterests={(opportunityInterests: string[]) => {
            const newWorkingOnboardingResponse = {
              ...workingOnboardingResponse,
              responses: {
                ...workingOnboardingResponse.responses,
                opportunityInterests: {
                  ...workingOnboardingResponse.responses?.opportunityInterests,
                  response: opportunityInterests,
                },
              },
            }

            setWorkingOnboardingResponse(newWorkingOnboardingResponse)
          }}
          onSubmit={onSubmit}
        />
      )
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
      return 70
    }

    if (currentStep === 'other') {
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
