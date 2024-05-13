'use client'

import DataTable from '@/frontend/components/DataTable.component'
import { Link, Stack, Text } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useOrdersData } from './hooks/useOrdersData'
import { JobOrderStatusMapping, JobOrderStatuses, JobOrderSummary } from './types'

const FILL_THRESHOLD = 72

const statusMappings: JobOrderStatusMapping = {
  needs_order_count: "Needs Order Count",
  open: 'Open',
  waiting_on_employer: 'Waiting on Employer',
  filled: 'Closed',
  not_filled: 'Closed Without Fill',
}

const Table = ({ data }: { data: JobOrderSummary[] }) => {
  const columnHelper = createColumnHelper<JobOrderSummary>()

  const columns = [
    columnHelper.accessor('employmentTitle', {
      header: 'Title',
      cell: (row) => (
        <Link href={`orders/${row.row.original.id}`} as={NextLink}>
          {row.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('employerName', {
      header: 'Employer',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('orderCount', {
      header: 'Order Count',
      cell: (row) => row.getValue() || "Provide Order Count",
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (row) => statusMappings[row.getValue()],
    }),
    columnHelper.accessor('openedAt', {
      header: 'Opened At',
      cell: (row) => {
        const dateOpened = new Date(row.getValue())

        const dateOpenedString = dateOpened.toLocaleDateString()
        const timeOpenInHours = Math.round((Date.now() - dateOpened.getTime()) / 1000 / 60 / 60)

        const icon = timeOpenInHours > FILL_THRESHOLD ? '🔥' : ''

        const color = timeOpenInHours > FILL_THRESHOLD ? 'red' : ''

        return <Text color={color}>{`${dateOpenedString} (${timeOpenInHours} hours) ${icon}`}</Text>
      },
    }),
  ]

  const initialSortState: SortingState = [
    {
      desc: false,
      id: 'openedAt',
    },
  ]

  return <DataTable columns={columns} data={data} initialSortState={initialSortState} />
}

const Orders = () => {
  const { data: orders } = useOrdersData()

  if (!orders) return <></>

  return (
    <Stack overflow={'scroll'} pb={'2rem'}>
      <Table data={orders} />
    </Stack>
  )
}

export default Orders
