'use client'

import { IdParams } from '@/common/types/PageParams'
import DataTable from '@/components/DataTable'
import { LoadingPage } from '@/components/Loading'
import { downloadScreenerAnswers } from '@/documents/downloadScreenerAnswers'
import { useAuthToken } from '@/hooks/useAuthToken'
import { useAddAnswersMutation } from '@/screeners/hooks/useAddAnswersMutation'
import { useAllAnswersQuery } from '@/screeners/hooks/useAllAnswersQuery'
import { useGenerateAnswersFile } from '@/screeners/hooks/useGenerateAnswersFile'
import { useUpdateAnswersMutation } from '@/screeners/hooks/useUpdateAnswersMutation'
import { Answers, AnswersRequest } from '@/screeners/types'
import { Button, HStack, IconButton, Stack, Tooltip, useDisclosure, VStack } from '@chakra-ui/react'
import { createColumnHelper, SortingState } from '@tanstack/react-table'
import { Suspense, useState } from 'react'
import { FaEdit, FaFileDownload } from 'react-icons/fa'
import { FaFilePdf } from 'react-icons/fa6'
import ScreenerModal from './components/ScreenerModal'
import ScreenerSelectModal from './components/ScreenerSelectModal'

const Screeners = (params: IdParams) => {
  return (
    <Stack width={'100%'}>
      <Suspense>
        <ScreenerTable {...params} />
      </Suspense>
    </Stack>
  )
}

const ScreenerTable = ({ params: { id } }: IdParams) => {
  const { data: screenerAnswers } = useAllAnswersQuery(id)

  const { isOpen: isSelectOpen, onOpen: onSelectOpen, onClose: onSelectClose } = useDisclosure({})
  const { isOpen: isAnswerOpen, onOpen: onAnswerOpen, onClose: onAnswerClose } = useDisclosure({})
  const [screenerAnswersRequest, setScreenerAnswersRequest] = useState<AnswersRequest>()

  const generateFile = useGenerateAnswersFile()
  const addAnswers = useAddAnswersMutation({ onSuccess: onAnswerClose })
  const updateAnswers = useUpdateAnswersMutation({ onSuccess: onAnswerClose })

  const token = useAuthToken()

  const onSelectSubmit = (request: Omit<AnswersRequest, 'personId'>) => {
    setScreenerAnswersRequest({
      personId: id,
      ...request,
    })
    onSelectClose()
    onAnswerOpen()
  }

  const onDownload = (documentId: string) => {
    if (!token) {
      return
    }

    downloadScreenerAnswers(documentId, token)
  }

  const columnHelper = createColumnHelper<Answers>()

  const initialSortState: SortingState = [
    {
      desc: true,
      id: 'createdAt',
    },
  ]

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (row) => (
        <div
          style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          {row.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      id: 'createdAt',
      cell: (row) => new Date(row.getValue()).toLocaleString(),
    }),
    columnHelper.accessor('documentStatus', {
      header: 'Pdf Status',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: (row) => {
        const documentsScreenersId = row.row.original.documentsScreenersId

        return (
          <HStack>
            <Tooltip label={`Edit`}>
              <IconButton
                onClick={() => {
                  setScreenerAnswersRequest(row.row.original)
                  onAnswerOpen()
                }}
                aria-label="edit-answers"
                variant={'ghost'}
                icon={<FaEdit />}
              />
            </Tooltip>
            <Tooltip label={'Create pdf for screener'}>
              <IconButton
                onClick={() => generateFile.mutate(row.getValue())}
                aria-label="create-pdf"
                variant={'ghost'}
                icon={<FaFilePdf />}
              />
            </Tooltip>

            {!!documentsScreenersId && (
              <Tooltip label={'Download the screener'}>
                <IconButton
                  onClick={() => onDownload(documentsScreenersId)}
                  aria-label="download"
                  variant={'ghost'}
                  disabled={true}
                  icon={<FaFileDownload />}
                />
              </Tooltip>
            )}
          </HStack>
        )
      },
    }),
  ]

  if (!screenerAnswers) {
    return <LoadingPage />
  }

  return (
    <VStack width={'100%'} align={'start'}>
      <ScreenerModal
        initialValue={screenerAnswersRequest}
        isOpen={isAnswerOpen}
        onClose={onAnswerClose}
        onSubmit={(request) => {
          !!screenerAnswersRequest?.id ? updateAnswers.mutate(request) : addAnswers.mutate(request)
        }}
      />
      <ScreenerSelectModal
        isOpen={isSelectOpen}
        onClose={onSelectClose}
        onSubmit={onSelectSubmit}
      />
      <Button variant={'solid'} colorScheme="green" onClick={onSelectOpen}>
        Answer New Screener
      </Button>
      <DataTable columns={columns} data={screenerAnswers} initialSortState={initialSortState} />
    </VStack>
  )
}

export default Screeners
