import { Heading } from '@/frontend/components/Heading.component'
import { Text } from '@/frontend/components/Text.component'
import { useUser } from '@/frontend/hooks/useUser'
import { Button, Flex, Input } from '@chakra-ui/react'
import axios from 'axios'
import { useAuth0 } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useUpdateMyProfile } from '../hooks/useUpdateProfile'

export const EditSummary = () => {
  const router = useRouter()
  const { data: user } = useUser()
  const {
    updateSummary: { mutate: updateSummary, status: updateSummaryStatus },
  } = useUpdateMyProfile()

  const [firstName, setFirstName] = useState<string>(user?.firstName ?? '')
  const [lastName, setLastName] = useState<string>(user?.lastName ?? '')
  const [zipCode, setZipCode] = useState<string>(user?.zipCode ?? '')
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber ?? '')

  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (updateSummaryStatus === 'success') {
      router.back()
    }
  }, [updateSummaryStatus])

  const handleSave = () => {
    if (!user?.id) return
    if (!token) return

    axios
      .create({ withCredentials: false })
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/one_user`,
        {
          first_name: firstName,
          last_name: lastName,
          zip_code: zipCode,
          phone_number: phoneNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
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
      <Button variant="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </Flex>
  )
}
