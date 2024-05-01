'use client'

import { useAllEmployers } from '@/app/admin/hooks/useAllEmployerData'
import { useAllEmployerInviteData } from '@/frontend/hooks/useAllEmployerInviteData'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
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
export default function EmployerInvites() {
  const { isOpen, onOpen, onClose } = useDisclosure({})

  // use employer invite data
  const {
    getEmployerInvites: { data: invites, refetch: refetchInvites },
  } = useAllEmployerInviteData()

  const { data: employers } = useAllEmployers()
  const token = useAuthToken()

  const handleSubmit = () => {
    if (!token) {
      return
    }

    post(
      `/employer_invites`,
      {
        email: email,
        firstName: firstName,
        lastName: lastName,
        employerId: employerId,
      },
      token,
    )
      .then((res) => {
        refetchInvites()
        onClose()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [employerId, setEmployerId] = useState('')

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value)
  }

  const handleFirstNameChange = (e: any) => {
    setFirstName(e.target.value)
  }

  const handleLastNameChange = (e: any) => {
    setLastName(e.target.value)
  }

  const handleEmployerIdChange = (e: any) => {
    setEmployerId(e.target.value)
  }

  if (!invites || !employers) return <div>Loading...</div>

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
              <Th>Employer</Th>
              <Th>Used At</Th>
              <Th>Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invites?.map((invite: any, index: number) => {
              return (
                <Tr key={index}>
                  <Td>{invite.email}</Td>
                  <Td>{invite.firstName}</Td>
                  <Td>{invite.lastName}</Td>
                  <Td>{invite.employerName}</Td>
                  <Td>{invite.usedAt}</Td>
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
          <ModalHeader>New Recruiter Invite</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input placeholder="Recruiter Email" onChange={handleEmailChange} />
              <Input placeholder="Recruiter First Name" onChange={handleFirstNameChange} />
              <Input placeholder="Recruiter Last Name" onChange={handleLastNameChange} />
              <Select placeholder="Employer" onChange={handleEmployerIdChange}>
                {employers?.map((employer: { name: string; id: string }, index: number) => {
                  return (
                    <option key={index} value={employer.id}>
                      {employer.name}
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
