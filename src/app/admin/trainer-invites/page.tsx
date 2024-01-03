'use client'

import { useAllTrainingProviderData } from '@/frontend/hooks/useTrainingProviderData'
import { useAllTrainingProviderInviteData } from '@/frontend/hooks/useTrainingProviderInviteData'
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'

export default function trainerInvites() {
  const {
    getAllTrainingProviderInvites: { data: invites, refetch },
  } = useAllTrainingProviderInviteData()

  // use training provider data
  const {
    getAllTrainingProviders: { data: trainingProviders, isLoading: trainingProvidersIsLoading },
  } = useAllTrainingProviderData()

  const { isOpen, onOpen, onClose } = useDisclosure({})
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [trainingProviderId, setTrainingProviderId] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const { getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value)
  }

  const handleFirstNameChange = (e: any) => {
    setFirstName(e.target.value)
  }

  const handleLastNameChange = (e: any) => {
    setLastName(e.target.value)
  }

  const handleRoleDescriptionChange = (e: any) => {
    setRoleDescription(e.target.value)
  }

  const handleTrainingProviderChange = (e: any) => {
    setTrainingProviderId(e.target.value)
  }

  const handleSubmit = async () => {
    const invite = {
      email,
      first_name: firstName,
      last_name: lastName,
      training_provider_id: trainingProviderId,
      role_description: roleDescription,
    }

    await axios
      .create({ withCredentials: false })
      .post(`${process.env.NEXT_PUBLIC_API_URL}/training_provider_invites`, invite, {
        headers: { Authorization: `Bearer ${token}` },
      })

    refetch()
    onClose()
  }

  if (!invites) return <div>Loading...</div>

  return (
    <Box mt={'1rem'}>
      <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
        + New Invite
      </Button>
      <TableContainer>
        <Table size={'sm'} variant="simple">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Training Provider</Th>
              <Th>Used At</Th>
              <Th>Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invites?.map((invite: any, index: number) => {
              return (
                <Tr key={index}>
                  <Td>{invite.email}</Td>
                  <Td>{invite.first_name}</Td>
                  <Td>{invite.last_name}</Td>
                  <Td>{invite.training_provider_name}</Td>
                  <Td>{invite.used_at}</Td>
                  <Td>
                    <Button
                      onClick={(e) => {
                        navigator.clipboard.writeText(invite.link)
                      }}
                    >
                      copy
                    </Button>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Seeker Invite</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input placeholder="Seeker Email" onChange={handleEmailChange} />
              <Input placeholder="Seeker First Name" onChange={handleFirstNameChange} />
              <Input placeholder="Seeker Last Name" onChange={handleLastNameChange} />
              <Input placeholder="Role Description" onChange={handleRoleDescriptionChange} />
              <Select placeholder="Training Provider" onChange={handleTrainingProviderChange}>
                {trainingProviders?.map((trainingProvider: any, index: number) => {
                  return (
                    <option key={index} value={trainingProvider.id}>
                      {trainingProvider.name}
                    </option>
                  )
                })}
              </Select>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
