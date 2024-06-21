'use client'

import { downloadResume } from '@/app/documents/downloadResume'
import { useResumeMutation } from '@/app/documents/hooks/useResumeMutation'
import { useResumesQuery } from '@/app/documents/hooks/useResumesQuery'
import { Resume, ResumeRequest } from '@/app/documents/types'
import DataTable from '@/frontend/components/DataTable.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { Button, Stack, VStack, useDisclosure } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Suspense } from 'react'
import NewResumeModal from './components/NewResumeModal'

const Resumes = () => {
  return (
    <Stack width={'100%'}>
      <Suspense>
        <ResumesTable />
      </Suspense>
    </Stack>
  )
}

const ResumesTable = () => {
  const { id } = useFixedParams('id')
  const { data: resumes } = useResumesQuery(id)
  const resume = useResumeMutation()
  const { isOpen, onOpen, onClose } = useDisclosure({})
  const token = useAuthToken()

  const columnHelper = createColumnHelper<Resume>()

  const onSubmit = (request: ResumeRequest) => {
    resume.mutate(request)
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
      cell: (row) => new Date(row.getValue()).toLocaleString(),
    }),
    columnHelper.accessor('id', {
      header: 'Download',
      cell: (row) => <Button onClick={() => onClick(row.getValue())}>Download</Button>,
    }),
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
      <DataTable columns={columns} data={resumes} />
    </VStack>
  )
}

export default Resumes
