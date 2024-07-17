'use client'

import { useAddQuestionsMutation } from '@/app/screeners/hooks/useAddQuestionsMutation'
import { useQuestionsQuery } from '@/app/screeners/hooks/useQuestionsQuery'
import { useUpdateQuestionsMutation } from '@/app/screeners/hooks/useUpdateQuestionsMutation'
import { Questions } from '@/app/screeners/types'
import DataTable from '@/frontend/components/DataTable.component'
import FormikInput from '@/frontend/components/FormikInput'
import FormikTextArea from '@/frontend/components/FormikTextArea'
import { DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { FieldArray, Form, Formik } from 'formik'
import LoadingPage from '../page'
import { useState } from 'react'

const defaultModalValue: Questions = {
  id: '',
  title: '',
  questions: [''],
}

interface QuestionInterface {
  isOpen: boolean
  onClose: () => void
  isNew: boolean
  initialValue: Questions
}

const QuestionsModal = ({ isOpen, onClose, isNew, initialValue }: QuestionInterface) => {
  const addQuestions = useAddQuestionsMutation({ onSuccess: onClose })
  const updateQuestions = useUpdateQuestionsMutation({ onSuccess: onClose })

  const mutation = isNew ? addQuestions : updateQuestions

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="80%">
        <ModalHeader>Screener Questions</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValue}
          onSubmit={(form) => mutation.mutate(form)}
          render={({ values }) => (
            <Form>
              <ModalBody>
                <VStack spacing={2} width={'100%'}>
                  <FormikInput<string> isRequired name="title" type="text" label="Screener Title" />
                  <FieldArray name="questions">
                    {(arrayHelpers) => (
                      <VStack width={'100%'}>
                        {values.questions.map((_, index) => (
                          <HStack width={'100%'} key={index}>
                            <FormikTextArea
                              isRequired
                              name={`questions.${index}`}
                              label={`Question ${index + 1}`}
                            />
                            <IconButton
                              aria-label="Delete Question"
                              onClick={() => arrayHelpers.remove(index)}
                              icon={<DeleteIcon />}
                            />
                          </HStack>
                        ))}
                        <Button onClick={() => arrayHelpers.push('')}>
                          {/* show this when user has removed all friends from the list */}
                          Add a Question
                        </Button>
                      </VStack>
                    )}
                  </FieldArray>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" type="submit" isLoading={false}>
                  Save
                </Button>
              </ModalFooter>
            </Form>
          )}
        ></Formik>
      </ModalContent>
    </Modal>
  )
}

export default function Page() {
  const { data: questions } = useQuestionsQuery()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [initialValue, setInitialValue] = useState<Questions>(defaultModalValue)
  const [isNew, setIsNew] = useState<boolean>(true)

  const columnHelper = createColumnHelper<Questions>()

  const editQuestions = (id: string) => {
    setIsNew(false)
    setInitialValue(questions?.find((questions) => questions.id === id) as Questions)
    onOpen()
  }

  const newQuestions = () => {
    setIsNew(true)
    setInitialValue(defaultModalValue)
    onOpen()
  }

  const columns = [
    columnHelper.accessor('title', {
      header: 'Questions',
      filterFn: 'includesString',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('id', {
      header: 'Edit',
      cell: (row) => <Button onClick={() => editQuestions(row.getValue())}>Edit</Button>,
    }),
  ]

  if (!questions) return <LoadingPage />

  return (
    <Stack overflow={'scroll'} pt={'2rem'}>
      <HStack align={'end'}>
        <Button colorScheme="green" onClick={newQuestions}>
          New Screener Questions
        </Button>
      </HStack>
      <DataTable columns={columns} data={questions} />
      <QuestionsModal isNew={isNew} initialValue={initialValue} isOpen={isOpen} onClose={onClose} />
    </Stack>
  )
}
