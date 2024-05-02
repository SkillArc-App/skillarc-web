'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useAllProgramData } from '@/frontend/hooks/useProgramData'
import { useAllSeekerInviteData } from '@/frontend/hooks/useSeekerInviteData'
import { useAllTrainingProviderData } from '@/frontend/hooks/useTrainingProviderData'
import { post } from '@/frontend/http-common'
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
import { useState } from 'react'

export default function Admin() {
  const {
    getAllInvites: { data: invites, isLoading: invitesIsLoading, refetch },
  } = useAllSeekerInviteData()

  // use training provider data
  const {
    getAllTrainingProviders: { data: trainingProviders, isLoading: trainingProvidersIsLoading },
  } = useAllTrainingProviderData()

  // use program data
  const {
    getAllPrograms: { data: programs, isLoading: programsIsLoading },
  } = useAllProgramData()

  const { isOpen, onOpen, onClose } = useDisclosure({})

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [trainingProviderId, setTrainingProviderId] = useState('')
  const [programId, setProgramId] = useState('')
  const token = useAuthToken()

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value)
  }

  const handleFirstNameChange = (e: any) => {
    setFirstName(e.target.value)
  }

  const handleLastNameChange = (e: any) => {
    setLastName(e.target.value)
  }

  const handleTrainingProviderChange = (e: any) => {
    setTrainingProviderId(e.target.value)
  }

  const handleProgramChange = (e: any) => {
    setProgramId(e.target.value)
  }

  const handleSubmit = async () => {
    if (!token) {
      return
    }

    await post(
      `/seeker_invites`,
      {
        email,
        firstName: firstName,
        lastName: lastName,
        trainingProviderId: trainingProviderId,
        programId: programId,
      },
      token,
    )

    refetch()
    onClose()
  }

  if (invitesIsLoading || trainingProvidersIsLoading || programsIsLoading) {
    return <LoadingPage />
  }

  return (
    <Box mt={'1rem'}>
      <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
        + New Invite
      </Button>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Training Provider</Th>
              <Th>Program</Th>
              <Th>Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invites?.map((invite: any, index: number) => {
              return (
                <Tr key={index}>
                  <Td>{invite.email}</Td>
                  <Td>{invite.trainingProviderName}</Td>
                  <Td>{invite.programName}</Td>
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
              <Select placeholder="Training Provider" onChange={handleTrainingProviderChange}>
                {trainingProviders?.map((trainingProvider: any, index: number) => {
                  return (
                    <option key={index} value={trainingProvider.id}>
                      {trainingProvider.name}
                    </option>
                  )
                })}
              </Select>
              <Select placeholder="Program" onChange={handleProgramChange}>
                {programs?.map((program: any, index: number) => {
                  return (
                    <option key={index} value={program.id}>
                      {program.name}
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
