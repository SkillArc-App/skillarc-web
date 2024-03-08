'use client'

import { useCoachLeadsQuery } from '@/app/coaches/hooks/useCoachLeadsQuery'
import DataTable from '@/frontend/components/DataTable.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import { Box, Button, Link, VStack } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useState } from 'react'
import { SeekerLead, SubmittableSeekerLead } from '../types'
import NewLeadModal from './components/NewLeadModal'

const Leads = () => {
  const { data: leads, isLoading, refetch } = useCoachLeadsQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const token = useAuthToken()

  const handleSubmit = (lead: SubmittableSeekerLead) => {
    if (!token) return

    post(`${process.env.NEXT_PUBLIC_API_URL}/coaches/leads/`, { lead }, token).then(() => {
      refetch()

      setIsModalOpen(false)
    })
  }

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <Box>
      <NewLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <VStack width={'100%'} align={'start'}>
        <Button variant={'solid'} colorScheme="green" onClick={() => setIsModalOpen(true)}>
          New Lead
        </Button>
        {leads && <Table data={leads} />}
      </VStack>
    </Box>
  )
}

const Table = ({ data }: { data: SeekerLead[] }) => {
  const columnHelper = createColumnHelper<SeekerLead>()

  const columns = [
    columnHelper.accessor('firstName', {
      header: 'Name',
      cell: (row) => (
        <Link as={NextLink} href={`/coaches/contexts/${row.row.original.id}`}>
          {`${row.getValue()} ${row.row.original.lastName}`}
        </Link>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Navigation',
      cell: (row) => (
        <Link as={NextLink} href={`/coaches/contexts/${row.getValue()}`}>
          Dash
        </Link>
      ),
    }),
    columnHelper.accessor('assignedCoach', {
      header: 'Coach',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('phoneNumber', {
      header: 'Phone Number',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('leadCapturedAt', {
      header: 'Lead Captured',
      cell: (row) => {
        try {
          return new Date(row.getValue()).toDateString()
        } catch (e) {
          return row.getValue()
        }
      },
      sortUndefined: 1,
      sortDescFirst: false,
      sortingFn: (row1, row2, columnId) => {
        const date1 = new Date(row1.getValue(columnId))
        const date2 = new Date(row2.getValue(columnId))

        return date1.getTime() - date2.getTime()
      },
    }),
    columnHelper.accessor('leadCapturedBy', {
      header: 'Lead Captured By',
      cell: (row) => row.getValue(),
    }),
  ]

  return <DataTable columns={columns} data={data} />
}

export default Leads
