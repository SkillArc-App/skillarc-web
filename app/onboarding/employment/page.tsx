'use client'

import { Button, Checkbox, Flex, Input, Textarea } from '@chakra-ui/react'
import { Heading } from 'app/components/Heading'
import { ChangeEvent, useState } from 'react'
import { Text } from '../../components/Text.component'
import { useOnboardingMutation } from '../hooks/useOnboardingMutation'

export type ExperienceResponseProps = {
  company?: string
  position?: string
  startDate?: string
  current?: boolean
  endDate?: string
  description?: string
}

export default function Employment() {
  const [experienceList, setExperienceList] = useState<ExperienceResponseProps[]>([
    {
      company: '',
      position: '',
      startDate: '',
      current: false,
      endDate: '',
      description: '',
    },
  ])
  const onboarding = useOnboardingMutation()

  const handleAdd = () => {
    setExperienceList([
      ...experienceList,
      { company: '', position: '', startDate: '', current: false, endDate: '', description: '' },
    ])
  }

  const handleSubmit = () => {
    onboarding.mutate({ experience: { response: experienceList } })
  }

  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...experienceList]
    temp[index].company = e.target.value
    setExperienceList(temp)
  }

  const handlePositionChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...experienceList]
    temp[index].position = e.target.value
    setExperienceList(temp)
  }
  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...experienceList]
    temp[index].startDate = e.target.value
    setExperienceList(temp)
  }

  const handleCurrentChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...experienceList]
    temp[index].current = e.target.checked
    setExperienceList(temp)
  }

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const temp = [...experienceList]
    temp[index].endDate = e.target.value
    setExperienceList(temp)
  }

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const temp = [...experienceList]
    temp[index].description = e.target.value
    setExperienceList(temp)
  }

  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        Tell us about your experience working or volunteering
      </Heading>
      {experienceList.map((object, index) => {
        return (
          <Flex
            flexDir={'column'}
            p={'1rem'}
            bg={'white'}
            width={'100%'}
            borderRadius={'0.25rem'}
            boxShadow={'sm'}
            gap={'0.5rem'}
            mt={'0.5rem'}
            key={index}
          >
            <Text type={'b2'} color={'greyscale.600'}>
              Company/Organization
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'i.e. Dunder Mifflin'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => handleCompanyChange(e, index)}
              value={object.company}
            />
            <Text mt={'0.5rem'} type={'b2'} color={'greyscale.600'}>
              Position
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'i.e. Assistant'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => handlePositionChange(e, index)}
              value={object.position}
            />
            <Text mt={'0.5rem'} type={'b2'} color={'greyscale.600'}>
              Start Date
            </Text>
            <Input
              bg={'white'}
              width={'100%'}
              height={'3.375rem'}
              placeholder={'MM/YYYY'}
              color={'greyscale.900'}
              borderColor={'greyscale.300'}
              _placeholder={{
                color: 'greyscale.500',
              }}
              boxShadow={'sm'}
              _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
              onChange={(e) => handleStartDateChange(e, index)}
              value={object.startDate}
            />
            <Checkbox
              mt={'0.5rem'}
              size={'lg'}
              colorScheme="green"
              onChange={(e) => handleCurrentChange(e, index)}
              isChecked={object.current}
            >
              I currently work here
            </Checkbox>
            {!object.current && (
              <>
                <Text mt={'0.5rem'} type={'b2'} color={'greyscale.600'}>
                  End Date
                </Text>
                <Input
                  bg={'white'}
                  width={'100%'}
                  height={'3.375rem'}
                  placeholder={'MM/YYYY'}
                  color={'greyscale.900'}
                  borderColor={'greyscale.300'}
                  _placeholder={{
                    color: 'greyscale.500',
                  }}
                  boxShadow={'sm'}
                  _focus={{
                    borderColor: 'greyscale.500',
                    borderWidth: '0.05rem',
                  }}
                  onChange={(e) => {
                    handleEndDateChange(e, index)
                  }}
                  value={object.endDate}
                />
              </>
            )}

            <Text mt={'0.5rem'} type={'b2'} color={'greyscale.600'}>
              Description
            </Text>
            <Textarea
              size={'md'}
              height={'8rem'}
              borderColor={'greyscale.300'}
              color={'greyscale.900'}
              placeholder={'Responsibilities, skills, etc.'}
              _placeholder={{ color: 'greyscale.500' }}
              focusBorderColor={'greyscale.500'}
              _focus={{ borderWidth: '0.05rem' }}
              onChange={(e) => handleDescriptionChange(e, index)}
              value={object.description}
            />
            {experienceList.length > 1 && (
              <Button
                border=" 1px solid #D25D5D"
                bg="white"
                textColor="#D25D5D"
                minH="54px"
                borderRadius="4px"
                marginTop="0.5rem"
                onClick={() => {}}
              >
                Remove
              </Button>
            )}
          </Flex>
        )
      })}

      <Button mt={'0.5rem'} variant={'secondary'} onClick={handleAdd}>
        Add another
      </Button>
      <Button onClick={handleSubmit} variant={'primary'} mt={'0.5rem'}>
        Next
      </Button>
    </>
  )
}
