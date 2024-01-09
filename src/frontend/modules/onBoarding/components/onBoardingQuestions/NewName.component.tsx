import { Button, Input } from '@chakra-ui/react'
import { Heading } from '../../../../components/Heading.component'
import { Text } from '../../../../components/Text.component'

export const NewName = ({
  firstName,
  lastName,
  phoneNumber,
  dateOfBirth,
  setFirstName,
  setLastName,
  setPhoneNumber,
  setDateOfBirth,
  onSubmit,
}: {
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth: string
  setFirstName: (firstName: string) => void
  setLastName: (lastName: string) => void
  setPhoneNumber: (phoneNumber: string) => void
  setDateOfBirth: (dateOfBirth: string) => void
  onSubmit: () => void
}) => {
  return (
    <>
      <Heading color={'greyscale.900'} variant={'h2'}>
        You have a bright future ahead! Let&apos;s get started!
      </Heading>
      <Text color={'greyscale.600'} type={'b2'} pt={'0.5rem'}></Text>

      <Input
        bg={'white'}
        width={'100%'}
        height={'3.375rem'}
        placeholder={'First name'}
        color={'greyscale.900'}
        borderColor={'greyscale.300'}
        _placeholder={{
          color: 'greyscale.500',
        }}
        boxShadow={'md'}
        _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
        onChange={(e) => setFirstName(e.target.value)}
        value={firstName}
      />
      <Input
        bg={'white'}
        width={'100%'}
        height={'3.375rem'}
        placeholder={'Last name'}
        color={'greyscale.900'}
        borderColor={'greyscale.300'}
        _placeholder={{
          color: 'greyscale.500',
        }}
        boxShadow={'md'}
        _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
        onChange={(e) => setLastName(e.target.value)}
        value={lastName}
      />
      <Input
        bg={'white'}
        width={'100%'}
        height={'3.375rem'}
        placeholder={'Phone number'}
        color={'greyscale.900'}
        borderColor={'greyscale.300'}
        _placeholder={{
          color: 'greyscale.500',
        }}
        boxShadow={'md'}
        _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
        onChange={(e) => setPhoneNumber(e.target.value)}
        value={phoneNumber}
      />
      <Text mt="1.5rem">Date of Birth</Text>
      <Input
        bg={'white'}
        width={'100%'}
        height={'3.375rem'}
        placeholder={'MM/DD/YYYY'}
        color={'greyscale.900'}
        borderColor={'greyscale.300'}
        _placeholder={{
          color: 'greyscale.500',
        }}
        boxShadow={'md'}
        _focus={{ borderColor: 'greyscale.500', borderWidth: '0.05rem' }}
        onChange={(e) => setDateOfBirth(e.target.value)}
        value={dateOfBirth}
      />
      <Button onClick={onSubmit} isDisabled={false} mt={'0.5rem'} variant={'primary'}>
        Next
      </Button>
    </>
  )
}
