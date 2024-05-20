'use client'

import { useCoachLeadsQuery } from '@/app/coaches/hooks/useCoachLeadsQuery'
import DataTable from '@/frontend/components/DataTable.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useUser } from '@/frontend/hooks/useUser'
import { post } from '@/frontend/http-common'
import { Box, Button, Checkbox, Link, VStack } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { SeekerLead, SubmittableSeekerLead } from '../types'
import NewLeadModal from './components/NewLeadModal'

const Skeleton = () => {
  return (
    <Suspense>
      <Leads/>
    </Suspense>
  )
}

const Leads = () => {
  const { data: leads, isLoading, refetch } = useCoachLeadsQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const token = useAuthToken()

  const { data: user } = useUser()
  const router = useRouter()

  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')

  const filteredLeads =
    filter !== 'no' ? leads?.filter((lead) => lead.assignedCoach == user?.email) : leads

  const handleSubmit = (lead: SubmittableSeekerLead) => {
    if (!token) return

    post(`/coaches/leads/`, { lead }, token).then(() => {
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
        <Checkbox
          isChecked={filter !== 'no'}
          onChange={() =>
            filter !== 'no'
              ? router.push('/coaches/leads?filter=no')
              : router.push('/coaches/leads?filter=yes')
          }
        >
          Owned by Me
        </Checkbox>
        {filteredLeads && <Table data={filteredLeads} />}
      </VStack>
    </Box>
  )
}

const Table = ({ data }: { data: SeekerLead[] }) => {
  const columnHelper = createColumnHelper<SeekerLead>()
  const occurredAtColumnId = 'occurred-at'

  const columns = [
    columnHelper.accessor('firstName', {
      header: 'Name',
      cell: (row) => (
        <Link as={NextLink} href={`/coaches/contexts/${row.row.original.id}`}>
          {`${row.getValue()} ${row.row.original.lastName}`}
        </Link>
      ),
      filterFn: (row, _, filterValue) => {
        const fullName = `${row.original.firstName} ${row.original.lastName}`.toLowerCase()
        return fullName.includes(filterValue.toLowerCase())
      },
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
      filterFn: 'includesString',
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
      id: occurredAtColumnId,
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

  const initialSortState: SortingState = [
    {
      desc: true,
      id: occurredAtColumnId,
    },
  ]

  return <DataTable columns={columns} data={data} initialSortState={initialSortState} />
}

export default Skeleton
