import { Heading } from '@/frontend/components/Heading.component'
import { Button, Checkbox, Flex } from '@chakra-ui/react'
import { Text } from '../../../../components/Text.component'

export const NewOpportunityInterests = ({
  opportunityInterests,
  setOpportunityInterests,
  onSubmit,
}: {
  opportunityInterests: string[]
  setOpportunityInterests: (opportunityInterests: string[]) => void
  onSubmit: () => void
}) => {
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setOpportunityInterests([...opportunityInterests, e.target.value])
    } else {
      setOpportunityInterests(
        opportunityInterests.filter((value) => {
          return value !== e.target.value
        }),
      )
    }
  }

  const checkboxOptions: string[] = ['Construction', 'Manufacturing', 'Healthcare']

  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        What opportunities interest you?
      </Heading>
      <Text color={'greyscale.600'} type={'b2'}>
        We'll send you new opportunities as we find them for you!
      </Text>
      <Flex mt={'0.5rem'} flexDir={'column'} gap={'0.5rem'}>
        {checkboxOptions.map((option, index) => {
          return (
            <Checkbox
              variant={'box'}
              onChange={handleSelect}
              value={option}
              isChecked={opportunityInterests.includes(option)}
              key={index}
              bg={'white'}
            >
              {option}
            </Checkbox>
          )
        })}
      </Flex>
      <Button onClick={onSubmit} mt={'0.5rem'} variant={'primary'}>
        Next
      </Button>
    </>
  )
}
