'use client'

import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useProfileData } from '@/frontend/hooks/useProfileData'
import { put } from '@/frontend/http-common'
import { Button, Flex, Input, Textarea } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUpdateProfile } from '../hooks/useUpdateProfile'

const EditSummary = () => {
  const router = useRouter()
  const { profileId } = useFixedParams('profileId')
  const { data: profile } = useProfileData(profileId)
  const {
    updateSummary: { status: updateSummaryStatus },
  } = useUpdateProfile()

  const [firstName, setFirstName] = useState<string>(profile?.user?.firstName ?? '')
  const [lastName, setLastName] = useState<string>(profile?.user?.lastName ?? '')
  const [zipCode, setZipCode] = useState<string>(profile?.user?.zipCode ?? '')
  const [phoneNumber, setPhoneNumber] = useState<string>(profile?.user?.phoneNumber ?? '')
  const [about, setAbout] = useState<string>(profile?.about ?? '')
  const token = useAuthToken()

  useEffect(() => {
    const user = profile?.user

    if (!user) return

    setFirstName(user.firstName ?? '')
    setLastName(user.lastName ?? '')
    setZipCode(user.zipCode ?? '')
    setPhoneNumber(user.phoneNumber ?? '')
  }, [profile])

  useEffect(() => {
    if (updateSummaryStatus === 'success') {
      router.back()
    }
  }, [router, updateSummaryStatus])

  const handleSave = () => {
    if (!token) return
    if (!profile?.user?.id) return

    put(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${profile.user.id}`,
      {
        about,
        firstName,
        lastName,
        zipCode,
        phoneNumber,
      },
      token,
    ).then((res) => {
      router.back()
    })
  }

  return (
    <Flex p="1rem" w="100%" gap="1rem" flexDir="column">
      <Heading variant="h2">Edit Intro</Heading>
      <Flex
        p="1rem"
        bg="white"
        gap="1rem"
        flexDir="column"
        borderRadius="4px"
        boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      >
        <Text type="overline">BASIC INFO</Text>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">First name</Text>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Flex>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Last name</Text>
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)}></Input>
        </Flex>
        {/* <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Age</Text>
          <Input></Input>
        </Flex> */}
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">ZIP Code</Text>
          <Input
            placeholder="00000"
            _placeholder={{ color: 'greyscale.400' }}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          ></Input>
        </Flex>
        {/* <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Status</Text>
          <Select />
        </Flex> */}
      </Flex>
      <Flex
        p="1rem"
        bg="white"
        gap="1rem"
        flexDir="column"
        borderRadius="4px"
        boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      >
        <Text type="overline">CONTACT</Text>
        <Flex flexDir="column" gap="0.5rem">
          <Text type="b2">Phone number</Text>
          <Input
            value={phoneNumber}
            placeholder="(000) 000-0000"
            _placeholder={{ color: 'greyscale.400' }}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Input>
        </Flex>
      </Flex>
      <Flex
        p="1rem"
        bg="white"
        gap="1rem"
        flexDir="column"
        borderRadius="4px"
        boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)"
      >
        <Text type="overline">ABOUT</Text>
        <Flex flexDir="column" gap="0.5rem">
          <Textarea
            value={about}
            placeholder="Take 1-2 sentences to tell us who you are and what you're looking for."
            _placeholder={{ color: 'greyscale.400' }}
            onChange={(e) => setAbout(e.target.value)}
          ></Textarea>
        </Flex>
      </Flex>
      <Button variant="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </Flex>
  )
}

export default EditSummary
