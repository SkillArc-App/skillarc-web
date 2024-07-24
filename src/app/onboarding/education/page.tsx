'use client'

import { Button, Flex, Heading, Input } from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { Text } from '../../components/Text.component'
import { useOnboardingMutation } from '../hooks/useOnboardingMutation'

export type EducationResponseProps = {
  org?: string
  title?: string
  gradYear?: string
  gpa?: string
  activities?: string
}

export default function Education() {
  const [educationList, setEducationList] = useState<EducationResponseProps[]>([
    {
      org: '',
      title: '',
      gradYear: '',
      gpa: '',
      activities: '',
    },
  ])
  const onboarding = useOnboardingMutation()

  const handleAdd = () => {
    setEducationList([
      ...educationList,
      { org: '', title: '', gradYear: '', gpa: '', activities: '' },
    ])
  }

  const handleSubmit = () => {
    onboarding.mutate({ education: { response: educationList } })
  }

  const handleRemove = (index: number) => {
    const temp = [...educationList].filter((_, i) => i !== index)
    setEducationList(temp)
  }

  const handleOrgChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...educationList]
    temp[index].org = e.target.value
    setEducationList(temp)
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...educationList]
    temp[index].title = e.target.value
    setEducationList(temp)
  }

  const handleGradYearChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...educationList]
    temp[index].gradYear = e.target.value
    setEducationList(temp)
  }

  const handleGpaChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...educationList]
    temp[index].gpa = e.target.value
    setEducationList(temp)
  }

  const handleActivitiesChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...educationList]
    temp[index].activities = e.target.value
    setEducationList(temp)
  }

  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        Education
      </Heading>
      <Text color={'greyscale.600'} type={'b2'}>
        Tell us about your education experience
      </Text>
      {/* Input fields */}
      {educationList.map((object, index) => {
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
              School/Organization
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'i.e. Washington High School'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => {
                handleOrgChange(e, index)
              }}
              value={object.org}
            />
            <Text mt={'0.5rem'} type={'b2'} color={'greyscale.700'}>
              Title
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'i.e. High School Student'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => {
                handleTitleChange(e, index)
              }}
              value={object.title}
            />
            <Text mt={'0.5rem'} type={'b2'} color={'greyscale.700'}>
              Expected Graduation Year
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'YYYY'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => {
                handleGradYearChange(e, index)
              }}
              value={object.gradYear}
            />
            <Text mt={'0.5rem'} type={'b2'} color={'greyscale.700'}>
              GPA
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'3.6/4.0'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => {
                handleGpaChange(e, index)
              }}
              value={object.gpa}
            />
            <Text mt={'0.5rem'} type={'b2'} color={'greyscale.700'}>
              Activities
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'Teams, clubs, etc.'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => {
                handleActivitiesChange(e, index)
              }}
              value={object.activities}
            />
            {educationList.length > 1 && (
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
