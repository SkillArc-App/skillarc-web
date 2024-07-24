'use client'

import { LoadingPage } from '@/app/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { put } from '@/frontend/http-common'
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
  Stack,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { useEmployerData } from '../../hooks/useEmployerData'
import { EmployerBasics, EmployerModal } from '../components/EmployerModal'

export default function Employer({ params: { id } }: { params: { id: string } }) {
  const { data: employer, refetch } = useEmployerData(id)
  const { isOpen, onOpen, onClose } = useDisclosure({})
  const token = useAuthToken()

  const onSubmit = async (employer: Partial<EmployerBasics>) => {
    if (!token) {
      return
    }

    await put(`/employers/${id}`, employer, token)

    refetch()
    onClose()
  }

  if (!employer) return <LoadingPage />

  return (
    <Stack spacing={2}>
      <div>
        <b>Employer</b>: {employer.name}
      </div>
      <div>
        <b>Bio</b>: {employer.bio}
      </div>
      <div>
        <b>Location</b>: {employer.location}
      </div>
      <div>
        <b>Logo URL</b>: {employer.logoUrl}
      </div>
      <Flex>
        <Button onClick={onOpen} leftIcon={<EditIcon />} size="sm">
          edit
        </Button>
      </Flex>
      <EmployerModal
        isOpen={isOpen}
        title="Edit Employer"
        onClose={onClose}
        initialValue={employer}
        onSubmit={onSubmit}
      />
    </Stack>
  )
}
