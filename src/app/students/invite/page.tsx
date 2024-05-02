'use client'

import { Heading } from '@/frontend/components/Heading.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { Text } from '@/frontend/components/Text.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useProgramDataForTrainingProvider } from '@/frontend/hooks/useProgramData'
import { post } from '@/frontend/http-common'
import { Box, Button, Flex, HStack, Input, Link, Select, Stack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type SeekerInvite = {
  id: string
  email: string
  first_name: string
  last_name: string
  program_id: string
  training_provider_id: string
  used_at: Date | null
  created_at: Date
  updated_at: Date
}

export default function Invite() {
  const router = useRouter()

  const [invitees, setInvitees] = useState<Partial<SeekerInvite>[]>([
    { first_name: '', last_name: '', email: '', program_id: '' },
  ])
  const {
    getPrograms: { data: programs },
  } = useProgramDataForTrainingProvider()

  const token = useAuthToken()

  const setInvitee = (invitee: Partial<SeekerInvite>, index: number) => {
    const newInvitees = [...invitees]
    newInvitees[index] = invitee
    setInvitees(newInvitees)
  }

  const addInvitee = () => {
    setInvitees([...invitees, { first_name: '', last_name: '', email: '', program_id: '' }])
  }

  const sendInvites = () => {
    if (!token) {
      return
    }

    post(`/training_providers/invites`, { invitees }, token).then((res) => {
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
