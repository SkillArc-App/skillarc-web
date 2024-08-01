'use client'

import { IdParams } from '@/common/types/PageParams'
import DataTable from '@/components/DataTable'
import { LoadingPage } from '@/components/Loading'
import { downloadResume } from '@/documents/downloadResume'
import { useResumeMutation } from '@/documents/hooks/useResumeMutation'
import { useResumesQuery } from '@/documents/hooks/useResumesQuery'
import { Checks, Resume } from '@/documents/types'
import { useAuthToken } from '@/hooks/useAuthToken'
import { Button, Stack, VStack, useDisclosure } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import { Suspense } from 'react'
import NewResumeModal, { ResumeForm } from './components/NewResumeModal'

const Resumes = (params: IdParams) => {
  return (
    <Stack width={'100%'}>
      <Suspense>
        <ResumesTable {...params} />
      </Suspense>
    </Stack>
  )
}

const ResumesTable = ({ params: { id } }: IdParams) => {
  const { data: resumes } = useResumesQuery(id, { refetchInterval: 2000 })
  const resume = useResumeMutation()
  const { isOpen, onOpen, onClose } = useDisclosure({})
  const token = useAuthToken()

  const columnHelper = createColumnHelper<Resume>()

  const onSubmit = (request: ResumeForm) => {
    const checks = []
    if (request.drug) {
      checks.push(Checks.DRUG)
    }

    if (request.background) {
      checks.push(Checks.BACKGROUND)
    }

    resume.mutate({
      ...request,
      checks,
    })
    onClose()
  }

  const onClick = (documentId: string) => {
    if (!token) {
      return
    }

    downloadResume(documentId, token)
  }

  const columns = [
    columnHelper.accessor('documentStatus', {
      header: 'Resume Generation Status',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('anonymized', {
      header: 'Anonymized',
      cell: (row) => (row.getValue() ? 'Yes' : 'No'),
    }),
    columnHelper.accessor('documentKind', {
      header: 'File Extension',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('generatedAt', {
      header: 'Resume Generated At',
      cell: (row) => {
        const value = row.getValue()
        return value && new Date(value).toLocaleString()
      },
      id: 'generatedAt',
      sortingFn: (row1, row2, columnId) => {
        const date1 = new Date(row1.getValue(columnId))
        const date2 = new Date(row2.getValue(columnId))

        return date1.getTime() - date2.getTime()
      },
    }),
    columnHelper.accessor('id', {
      header: 'Download',
      cell: (row) => <Button onClick={() => onClick(row.getValue())}>Download</Button>,
    }),
  ]

  const initialSortState: SortingState = [
    {
      desc: true,
      id: 'generatedAt',
    },
  ]

  if (!resumes) {
    return <LoadingPage />
  }

  return (
    <VStack width={'100%'} align={'start'}>
      <NewResumeModal personId={id} isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />
      <Button variant={'solid'} colorScheme="green" onClick={onOpen}>
        Create New Resume
      </Button>
      <DataTable columns={columns} data={resumes} initialSortState={initialSortState} />
    </VStack>
  )
}

export default Resumes
