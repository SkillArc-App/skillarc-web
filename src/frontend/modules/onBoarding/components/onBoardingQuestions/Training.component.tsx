import { TrainingProviderResponse } from '@/common/types/OnboardingResponse'
import { TrainingProvider } from '@/common/types/TrainingProvider'
import { useAllTrainingProviderData } from '@/frontend/hooks/useTrainingProviderData'
import { Button, Checkbox, Heading } from '@chakra-ui/react'
import { useState } from 'react'
import { Text } from '../../../../components/Text.component'

export const Training = ({
  onSubmit,
}: {
  onSubmit: (responses: TrainingProviderResponse) => void
}) => {
  const {
    getAllTrainingProviders: { data: allTrainingProviders, isLoading },
  } = useAllTrainingProviderData()

  const [selectedTrainingProviders, setSelectedTrainingProviders] = useState<string[]>([])

  const handleSubmit = () => {
    onSubmit({
      trainingProvider: {
        response: selectedTrainingProviders,
      },
    })
  }

  if (!allTrainingProviders) return null

  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        Career Training
      </Heading>
      <Text color={'greyscale.600'} type={'b2'}>
        Are you currently enrolled, or have you graduated from a training program to learn career
        skills?
      </Text>

      {allTrainingProviders.map((trainingProvider: TrainingProvider) => {
        return (
          <Checkbox
            key={trainingProvider.id}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedTrainingProviders([...selectedTrainingProviders, e.target.value])
              } else {
                setSelectedTrainingProviders(
                  selectedTrainingProviders.filter((id) => id !== e.target.value),
                )
              }
            }}
            isChecked={selectedTrainingProviders.includes(trainingProvider.id)}
            value={trainingProvider.id}
            size={'lg'}
            width={'100%'}
            variant={'box'}
            colorScheme="green"
          >
            {trainingProvider.name}
          </Checkbox>
        )
      })}

      <Button onClick={handleSubmit} variant={'primary'} mt={'0.5rem'}>
        Next
      </Button>
    </>
  )
}
