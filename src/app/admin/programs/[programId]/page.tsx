'use client'

import FormikInput from '@/frontend/components/FormikInput'
import FormikSelect from '@/frontend/components/FormikSelect'
import FormikTextArea from '@/frontend/components/FormikTextArea'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useAllTrainingProviderData } from '@/frontend/hooks/useTrainingProviderData'
import { put } from '@/frontend/http-common'
import { delay } from '@/frontend/utils/delay'
import { EditIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
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
import { Form, Formik } from 'formik'
import { Program, useProgramData } from '../../hooks/useProgramData'

type PartialProgram = Pick<Program, 'name' | 'description' | 'trainingProviderId'>

export default function Page({ params: { programId } }: { params: { programId: string } }) {
  const { data: program, refetch: refetchProgram } = useProgramData(programId)

  const { data: trainingProviders } = useAllTrainingProviderData()

  const token = useAuthToken()
  const { isOpen, onOpen, onClose } = useDisclosure({})

  const handleSubmit = async (updatedProgram: PartialProgram) => {
    if (!updatedProgram || !program || !token) return

    await put(`/programs/${programId}`, { ...updatedProgram, trainingProviderId: program.trainingProviderId }, token)
    await delay(3000)
    await refetchProgram()

    onClose()
  }

  if (!trainingProviders || !program) return <LoadingPage />

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
          <b>Training Provider:</b> {program.trainingProviderName}
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
          <Formik initialValues={program} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <ModalBody>
                  <Stack spacing={3}>
                    <FormikInput<string> type="text" label="Name" name="name" />
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
    </>
  )
}
