'use client'

import {
  Box,
  Button,
  Link,
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
import DataTable from 'app/components/DataTable'
import FormikInput from 'app/components/FormikInput'
import FormikTextArea from 'app/components/FormikTextArea'
import { LoadingPage } from 'app/components/Loading'
import { useAuthToken } from 'app/hooks/useAuthToken'
import { TrainingProvider, useAllTrainingProviderData } from 'app/hooks/useTrainingProviderData'
import { post } from 'app/http-common'
import { delay } from 'app/utils/delay'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'

type PartialTrainingProvider = Partial<Pick<TrainingProvider, 'name' | 'description'>>

const columnHelper = createColumnHelper<TrainingProvider>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    filterFn: 'includesString',
    cell: (row) => (
      <Link as={NextLink} href={`/admin/training-providers/${row.row.original.id}`}>
        {row.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (row) => row.getValue(),
  }),
]

export default function Admin() {
  const { data: trainingProviders, refetch } = useAllTrainingProviderData()
  const { isOpen, onOpen, onClose } = useDisclosure({})

  const token = useAuthToken()

  const handleSubmit = async (trainingProvider: PartialTrainingProvider) => {
    if (!token) {
      return
    }

    await post(`/training_providers`, trainingProvider, token)
    await delay(3000)
    await refetch()
    onClose()
  }

  if (!trainingProviders) return <LoadingPage />

  return (
    <Box mt={'1rem'}>
      <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
        + New Training Provider
      </Button>
      <DataTable data={trainingProviders} columns={columns} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Training Provider</ModalHeader>
          <ModalCloseButton />
          <Formik initialValues={{}} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <ModalBody>
                  <Stack spacing={3}>
                    <FormikInput<string> isRequired label="Name" type="text" name="name" />
                    <FormikTextArea isRequired label="Description" name="description" />
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
        </ModalContent>
      </Modal>
    </Box>
  )
}
