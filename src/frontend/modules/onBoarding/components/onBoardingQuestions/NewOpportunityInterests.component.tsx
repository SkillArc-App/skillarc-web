import { industries } from '@/common/static/industries'
import { OpportunityInterestsResponse } from '@/common/types/OnboardingResponse'
import { Heading } from '@/frontend/components/Heading.component'
import { Button, Checkbox, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { Text } from '../../../../components/Text.component'

export const NewOpportunityInterests = ({
  onSubmit,
}: {
  onSubmit: (responses: OpportunityInterestsResponse) => void
}) => {
  const [opportunityInterests, setOpportunityInterests] = useState<string[]>([])

  const checkboxOptions: string[] = industries.map((i) => i[0].toLocaleUpperCase() + i.slice(1))

  const handleSubmit = () => {
    onSubmit({
      opportunityInterests: {
        response: opportunityInterests,
      },
    })
  }

  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        What opportunities interest you?
      </Heading>
      <Text color={'greyscale.600'} type={'b2'}>
        We&apos;ll send you new opportunities as we find them for you!
      </Text>
      <Flex mt={'0.5rem'} flexDir={'column'} gap={'0.5rem'}>
        {checkboxOptions.map((option, index) => {
          return (
            <Checkbox
              variant={'box'}
              onChange={(e) => {
                if (e.target.checked) {
                  setOpportunityInterests([...opportunityInterests, e.target.value])
                } else {
                  setOpportunityInterests(
                    opportunityInterests.filter((interest) => interest !== e.target.value),
                  )
                }
              }}
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
      <Button onClick={handleSubmit} mt={'0.5rem'} variant={'primary'}>
        Next
      </Button>
    </>
  )
}
