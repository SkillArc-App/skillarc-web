'use client'

import { useProgramData } from '@/frontend/hooks/useProgramData'
import { useAllTrainingProviderData } from '@/frontend/hooks/useTrainingProviderData'
import { http } from '@/frontend/http-common'
import { EditIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
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
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function Program({ params: { programId } }: { params: { programId: string } }) {
  const {
    getProgram: { data: program, isLoading: programIsLoading, refetch: refetchProgram },
  } = useProgramData(programId)

  // use all training provider data
  const {
    getAllTrainingProviders: { data: trainingProviders, isLoading: trainingProvidersIsLoading },
  } = useAllTrainingProviderData()

  const { isOpen, onOpen, onClose } = useDisclosure({})
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [trainingProviderId, setTrainingProviderId] = useState('')

  const handleNameChange = (e: any) => {
    setName(e.target.value)
  }

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value)
  }

  const handleTrainingProviderIdChange = (e: any) => {
    setTrainingProviderId(e.target.value)
  }

  useEffect(() => {
    if (!program) return

    setName(program?.name)
    setDescription(program?.description)
    setTrainingProviderId(program?.trainingProviderId)
  }, [program])

  const handleSubmit = async () => {
    if (!program) return

    await http.put(`/api/programs/${program.id}`, {
      name,
      description,
      trainingProviderId,
    })
    onClose()
    refetchProgram()
  }

  if (!trainingProviders) return <div>Loading...</div>
  if (!program) return <div>Loading...</div>

  return (
    <>
      <Stack spacing={2}>
        <span>
          <b>Name:</b> {program.name}
        </span>
        <span>
          <b>Description:</b> {program.description}
        </span>
        <span>
          <b>Training Provider:</b> {program.trainingProvider?.name}
        </span>
        <Flex gap={2}>
          <Button onClick={onOpen} leftIcon={<EditIcon />} size="sm">
            edit
          </Button>
        </Flex>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Program</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Input value={name} placeholder="Name" onChange={handleNameChange} />
              <Textarea
                value={description}
                placeholder="Description"
                onChange={handleDescriptionChange}
              />
              {/* Select for training provider */}
              <Select value={trainingProviderId} onChange={handleTrainingProviderIdChange}>
                {trainingProviders.map((trainingProvider: any, index: number) => {
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
    </>
  )
}
