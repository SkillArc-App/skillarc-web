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
import { Program, useTrainingProviderData } from 'app/hooks/useTrainingProviderData'
import { post } from 'app/http-common'
import { delay } from 'app/utils/delay'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'

type PartialProgram = Partial<Pick<Program, 'name' | 'description'>>
const columnHelper = createColumnHelper<Program>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    filterFn: 'includesString',
    cell: (cell) => (
      <Link as={NextLink} href={`/admin/programs/${cell.row.original.id}`}>
        {cell.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    filterFn: 'includesString',
  }),
]

export default function TrainingProvider({
  params: { trainingProviderId },
}: {
  params: { trainingProviderId: string }
}) {
  const { data: trainingProvider, refetch } = useTrainingProviderData(trainingProviderId)
  const { isOpen, onOpen, onClose } = useDisclosure({})

  const token = useAuthToken()

  const handleSubmit = async (program: PartialProgram) => {
    if (!trainingProvider || !token) return

    await post(`/training_providers/${trainingProviderId}/programs`, program, token)
    await delay(3000)
    await refetch()

    onClose()
  }

  if (!trainingProvider) return <LoadingPage />

  return (
    <Box mt={'1rem'}>
      <Button size={'xs'} variant={'solid'} colorScheme="green" onClick={onOpen}>
        + New Program
      </Button>
      <DataTable data={trainingProvider.programs} columns={columns} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Program</ModalHeader>
          <ModalCloseButton />
          <Formik initialValues={{}} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <ModalBody>
                  <Stack spacing={3}>
                    <FormikInput<string> isRequired type="text" label="Name" name="name" />
                    <FormikTextArea isRequired label="Description" name="description" />
                  </Stack>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="green" mr={3} type="submit" isLoading={isSubmitting}>
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
