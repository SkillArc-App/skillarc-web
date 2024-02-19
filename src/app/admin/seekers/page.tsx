'use client'

import { useSeekerData } from '@/frontend/hooks/useSeekerData'
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

export default function Seekers() {
  const { data: seekers, isLoading: seekersIsLoading } = useSeekerData()

  const { isOpen, onClose } = useDisclosure({})

  const handleSubmit = () => {}

  if (seekersIsLoading) return <div>Loading...</div>

  return (
    <Box mt={'1rem'}>
      <TableContainer>
        <Table size={'sm'} variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Training Provider(s)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {seekers?.map((seeker, index: number) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Link as={NextLink} href={`/admin/seekers/${seeker.id}`}>
                      {seeker.firstName} {seeker.lastName}
                    </Link>
                  </Td>
                  <Td>{seeker?.email}</Td>
                  <Td>
                    {seeker.trainingProvider.map((stp, index) => {
                      return (
                        <Link
                          key={index}
                          as={NextLink}
                          href={`/admin/training-providers/${stp.id}`}
                        >
                          {stp.name}
                        </Link>
                      )
                    })}
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
              <Input placeholder="Name" onChange={() => {}} />
              <Textarea placeholder="Description" onChange={() => {}} />
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
