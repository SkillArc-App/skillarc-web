'use client'

import DataTable from '@/app/components/DataTable'
import FormikInput from '@/app/components/FormikInput'
import FormikSelect from '@/app/components/FormikSelect'
import { LoadingPage } from '@/app/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useAllTrainingProviderData } from '@/frontend/hooks/useTrainingProviderData'
import { post } from '@/frontend/http-common'
import { delay } from '@/frontend/utils/delay'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import {
  TrainingProviderInvite,
  useAllTrainingProviderInviteData,
} from '../hooks/useTrainingProviderInviteData'

type PartialTrainingProviderInvite = Partial<
  Pick<
    TrainingProviderInvite,
    'email' | 'firstName' | 'lastName' | 'trainingProviderId' | 'roleDescription'
  >
>

const columnHelper = createColumnHelper<TrainingProviderInvite>()

const columns = [
  columnHelper.accessor('email', {
    header: 'Email',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('firstName', {
    header: 'First name',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('lastName', {
    header: 'Last name',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('trainingProviderName', {
    header: 'Training Provider',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('usedAt', {
    header: 'Used',
  }),
  columnHelper.accessor('link', {
    header: 'Link',
    cell: (row) => (
      <Button
        onClick={() => {
          navigator.clipboard.writeText(row.getValue())
        }}
      >
        copy
      </Button>
    ),
  }),
]

export default function TrainerInvites() {
  const { data: invites, refetch } = useAllTrainingProviderInviteData()
  const { data: trainingProviders } = useAllTrainingProviderData()

  const { isOpen, onOpen, onClose } = useDisclosure({})
  const token = useAuthToken()

  const handleSubmit = async (invite: PartialTrainingProviderInvite) => {
    if (!token) {
      return
    }

    await post(`/training_provider_invites`, invite, token)
    await delay(3000)
    await refetch()

    onClose()
  }

  if (!invites || !trainingProviders) return <LoadingPage />

  return (
    <Box mt={'1rem'}>
      <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
        + New Invite
      </Button>
      <DataTable data={invites} columns={columns} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Trainer Invite</ModalHeader>
          <ModalCloseButton />
          <Formik initialValues={{}} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <ModalBody>
                  <Stack spacing={3}>
                    <FormikInput<string>
                      isRequired
                      type="text"
                      label="Trainer Email"
                      name="email"
                    />
                    <FormikInput<string>
                      isRequired
                      type="text"
                      label="Trainer First Name"
                      name="firstName"
                    />
                    <FormikInput<string>
                      isRequired
                      type="text"
                      label="Trainer Last Name"
                      name="lastName"
                    />
                    <FormikInput<string>
                      isRequired
                      type="text"
                      label="Role Description"
                      name="roleDescription"
                    />
                    <FormikSelect
                      name="trainingProviderId"
                      label="Training Provider"
                      isRequired
                      options={trainingProviders?.map((trainingProvider, index) => ({
                        key: trainingProvider.id,
                        value: trainingProvider.name,
                      }))}
                    />
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="green" mr={3} isLoading={isSubmitting} type="submit">
                    Save
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
          <ModalBody>
            <Stack spacing={3}></Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
