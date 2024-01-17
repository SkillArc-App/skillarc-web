import { useAllTrainingProviderData } from '@/frontend/hooks/useTrainingProviderData'
import { TrainingProvider } from '@/frontend/services/profile.service'
import { Button, Checkbox, Heading } from '@chakra-ui/react'
import { Text } from '../../../../components/Text.component'

export const Training = ({
  trainingProviders,
  setTrainingProviders,
  onSubmit,
}: {
  trainingProviders: string[]
  setTrainingProviders: (trainingProviders: string[]) => void
  onSubmit: () => void
}) => {
  const {
    getAllTrainingProviders: { data: allTrainingProviders, isLoading },
  } = useAllTrainingProviderData()

  const handleCheckboxChange = (checked: boolean, trainingProviderId: string) => {
    if (checked) {
      setTrainingProviders([...trainingProviders, trainingProviderId])
    } else {
      setTrainingProviders(trainingProviders.filter((id) => id !== trainingProviderId))
    }
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
            onChange={(e) => handleCheckboxChange(e.target.checked, trainingProvider.id)}
            isChecked={trainingProviders.includes(trainingProvider.id)}
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

      <Button onClick={onSubmit} variant={'primary'} mt={'0.5rem'}>
        Next
      </Button>
    </>
  )
}
