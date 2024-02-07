import { OtherExperienceResponse } from '@/common/types/OnboardingResponse'
import { Button, Flex, Heading, Input } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { Text } from '../../../../components/Text.component'

type OtherResponse = {
  activity: string
  startDate: string
  endDate: string
  learning: string
}

export const Other = ({ onSubmit }: { onSubmit: (responses: OtherExperienceResponse) => void }) => {
  const [otherList, setOtherList] = useState<OtherResponse[]>([
    {
      activity: '',
      startDate: '',
      endDate: '',
      learning: '',
    },
  ])

  const handleAdd = () => {
    setOtherList([...otherList, { activity: '', startDate: '', endDate: '', learning: '' }])
  }

  const handleSubmit = () => {
    onSubmit({
      other: {
        response: otherList,
      },
    })
  }

  const handleRemove = (index: number) => {
    const temp = [...otherList].filter((_, i) => i !== index)
    setOtherList(temp)
  }

  const handleActivityChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...otherList]
    temp[index].activity = e.target.value
    setOtherList(temp)
  }

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...otherList]
    temp[index].startDate = e.target.value
    setOtherList(temp)
  }

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...otherList]
    temp[index].endDate = e.target.value
    setOtherList(temp)
  }

  const handleLearningChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...otherList]
    temp[index].learning = e.target.value
    setOtherList(temp)
  }

  return (
    <>
      {/* Heading */}
      <Heading color={'greyscale.900'} variant={'h2'}>
        Personal Experience
      </Heading>
      <Text color={'greyscale.600'} type={'b2'}>
        Have you been relied upon to do things like babysitting, cleaning or fixing things around
        the house, or learning something new?
      </Text>
      {otherList.map((o, index) => {
        return (
          <Flex
            flexDir={'column'}
            p={'1rem'}
            borderRadius={'0.25rem'}
            bg={'white'}
            width={'100%'}
            boxShadow={'sm'}
            gap={'0.5rem'}
            mt={'0.5rem'}
            key={index}
          >
            <Text type={'b2'} color={'greyscale.700'}>
              Activity
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'Babysitting, fixing bikes, cleaning'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => handleActivityChange(e, index)}
              value={o.activity}
            />
            <Text type={'b2'} color={'greyscale.700'}>
              Start Date
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'2021'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => {
                handleStartDateChange(e, index)
              }}
              value={o.startDate}
            />
            <Text type={'b2'} color={'greyscale.700'}>
              End Date
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'2023'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => {
                handleEndDateChange(e, index)
              }}
              value={o.endDate}
            />
            <Text type={'b2'} color={'greyscale.700'}>
              What did you learn?
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={''}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => {
                handleLearningChange(e, index)
              }}
              value={o.learning}
            />
            {otherList.length > 1 && (
              <Button
                border=" 1px solid #D25D5D"
                bg="white"
                textColor="#D25D5D"
                minH="54px"
                borderRadius="4px"
                marginTop="0.5rem"
                onClick={() => {
                  handleRemove(index)
                }}
              >
                Remove
              </Button>
            )}
          </Flex>
        )
      })}
      <Button
        onClick={handleAdd}
        mt={'0.5rem'}
        variant={'secondary'}
        minH="54px"
        borderRadius="4px"
      >
        Add another
      </Button>
      <Button
        onClick={handleSubmit}
        mt={'0.5rem'}
        variant={'primary'}
        minH="54px"
        borderRadius="4px"
      >
        Next
      </Button>
    </>
  )
}
