import { Heading } from '@/frontend/components/Heading.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { Text } from '@/frontend/components/Text.component'
import { useProgramDataForTrainingProvider } from '@/frontend/hooks/useProgramData'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, Flex, HStack, Input, Link, Select, Stack } from '@chakra-ui/react'
import { SeekerInvite } from '@prisma/client'
import axios from 'axios'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Invite() {
  const router = useRouter()

  const [invitees, setInvitees] = useState<Partial<SeekerInvite>[]>([
    { first_name: '', last_name: '', email: '', program_id: '' },
  ])
  const {
    getPrograms: { data: programs },
  } = useProgramDataForTrainingProvider()

  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const setInvitee = (invitee: Partial<SeekerInvite>, index: number) => {
    const newInvitees = [...invitees]
    newInvitees[index] = invitee
    setInvitees(newInvitees)
  }

  const addInvitee = () => {
    setInvitees([...invitees, { first_name: '', last_name: '', email: '', program_id: '' }])
  }

  const sendInvites = () => {
    axios
      .create({ withCredentials: false })
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/training_providers/invites`,
        { invitees },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setInvitees([{ first_name: '', last_name: '', email: '', program_id: '' }])
        router.push('/students')
      })
  }

  const removeInvitee = (index: number) => {
    const newInvitees = [...invitees]
    newInvitees.splice(index, 1)
    setInvitees(newInvitees)
  }

  if (!programs) return <LoadingPage />

  return (
    <Flex
      alignContent={'center'}
      justifyContent={'center'}
      width={'100%'}
      overflow={'scroll'}
      mt={'1.5rem'}
    >
      <Stack gap={'1.5rem'}>
        <Link as={NextLink} href="/students">
          <Text type="b2"> {'< Back'}</Text>
        </Link>
        <Box>
          <Heading type="h2">Invite Students</Heading>
          <Text type="b2" mt={'0.75rem'}>
            Add program participants to assist them successfully apply to jobs
          </Text>
        </Box>
        {invitees.map((invitee, index) => (
          <Stack backgroundColor={'white'} gap={'1rem'} p={'1rem'} key={index}>
            <Select
              value={invitee.program_id}
              onChange={(e) => setInvitee({ ...invitee, program_id: e.target.value }, index)}
              placeholder="Program"
            >
              {programs.map((program) => (
                <option value={program.id} key={program.id}>
                  {program.name}
                </option>
              ))}
            </Select>
            <HStack gap={'1rem'}>
              <Input
                placeholder="First Name"
                onChange={(e) => setInvitee({ ...invitee, first_name: e.target.value }, index)}
                value={invitee.first_name}
              ></Input>
              <Input
                placeholder="Last Name"
                onChange={(e) => setInvitee({ ...invitee, last_name: e.target.value }, index)}
                value={invitee.last_name}
              ></Input>
            </HStack>
            <Input
              placeholder="Email Address"
              onChange={(e) => setInvitee({ ...invitee, email: e.target.value }, index)}
              value={invitee.email}
            ></Input>

            {index > 0 ? (
              <Button variant={'remove'} onClick={(e) => removeInvitee(index)}>
                Remove
              </Button>
            ) : (
              <></>
            )}
          </Stack>
        ))}
        <Stack gap={'1rem'}>
          <Button variant={'secondary'} onClick={addInvitee}>
            Add Another
          </Button>
          <Button variant={'primary'} onClick={sendInvites}>
            Send Invites
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}
