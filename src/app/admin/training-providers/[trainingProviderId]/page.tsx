'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useTrainingProviderData } from '@/frontend/hooks/useTrainingProviderData'
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
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

export default function TrainingProvider({
  params: { trainingProviderId },
}: {
  params: { trainingProviderId: string }
}) {
  const {
    getTrainingProvider: { data: trainingProvider, refetch },
  } = useTrainingProviderData(trainingProviderId)

  const { isOpen, onOpen, onClose } = useDisclosure({})
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const token = useAuthToken()

  const handleNameChange = (e: any) => {
    setName(e.target.value)
  }

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value)
  }

  const handleSubmit = async () => {
    if (!trainingProvider || !token) return

    await post(
      `/training_providers/${trainingProvider.id}/programs`,
      {
        name,
        description,
        trainingProviderId,
      },
      token,
    )

    refetch()
    onClose()
  }

  if (!trainingProvider) return <LoadingPage />

  return (
    <Box mt={'1rem'}>
      <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
        + New Program
      </Button>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            {trainingProvider.program?.map((program: any, index: number) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Link as={NextLink} href={`/admin/programs/${program.id}`}>
                      {program.name}
                    </Link>
                  </Td>
                  <Td whiteSpace={'normal'}>{program.description}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Program</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input placeholder="Name" onChange={handleNameChange} />
              <Textarea placeholder="Description" onChange={handleDescriptionChange} />
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
