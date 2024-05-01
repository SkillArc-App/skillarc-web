'use client'

import { useAllEmployers } from '@/app/admin/hooks/useAllEmployerData'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import {
  Box,
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState } from 'react'

export default function Employers() {
  // use employer data
  const { data: employers, refetch } = useAllEmployers()

  const { isOpen, onOpen, onClose } = useDisclosure({})
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const token = useAuthToken()

  const handleNameChange = (e: any) => {
    setName(e.target.value)
  }

  const handleLogoUrlChange = (e: any) => {
    setLogoUrl(e.target.value)
  }

  const handleBioChange = (e: any) => {
    setBio(e.target.value)
  }

  const handleLocationChange = (e: any) => {
    setLocation(e.target.value)
  }

  const handleSubmit = async () => {
    if (!token) {
      return
    }

    post(
      `/employers`,
      {
        name,
        logoUrl: logoUrl,
        bio,
        location,
      },
      token,
    ).then(() => {
      refetch()
      onClose()
    })
  }

  if (!employers) return <div>Loading...</div>

  return (
    <Box mt={'1rem'}>
      <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
        + New Employer
      </Button>
      <TableContainer>
        <Table size={'sm'} variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Logo URL</Th>
              <Th>Bio</Th>
              <Th>Location</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employers.map((employer, index: number) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Link href={`/admin/employers/${employer.id}`} as={NextLink}>
                      {employer.name}
                    </Link>
                  </Td>
                  <Td>
                    <Link href={employer.logoUrl ?? ''} as={NextLink}>
                      link
                    </Link>
                  </Td>
                  <Td whiteSpace={'normal'}>{employer.bio}</Td>
                  <Td>{employer.location}</Td>
                  <Td>{new Date(employer.createdAt).toDateString()}</Td>
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
              <Input placeholder="Name" onChange={handleNameChange} />
              <Input placeholder="Logo URL" onChange={handleLogoUrlChange} />
              <Input placeholder="Location" onChange={handleLocationChange} />
              <Textarea placeholder="Bio" onChange={handleBioChange} />
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
