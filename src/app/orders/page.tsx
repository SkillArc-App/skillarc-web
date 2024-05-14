'use client'

import DataTable from '@/frontend/components/DataTable.component'
import { LoadingPage } from '@/frontend/components/Loading'
import { Checkbox, Link, Stack, Text } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { displayMap } from './constants'
import { useOrdersData } from './hooks/useOrdersData'
import { JobOrderSummary } from './types'

const FILL_THRESHOLD = 72

const Table = ({ data }: { data: JobOrderSummary[] }) => {
  const columnHelper = createColumnHelper<JobOrderSummary>()

  const columns = [
    columnHelper.accessor('employmentTitle', {
      header: 'Title',
      cell: (row) => (
        <Link href={`orders/${row.row.original.id}`} as={NextLink}>
          <div
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {row.getValue()}
          </div>
        </Link>
      ),
    }),
    columnHelper.accessor('employerName', {
      header: 'Employer',
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
    columnHelper.accessor('orderCount', {
      header: 'Order Count',
      cell: (row) => row.getValue() || 'Provide Order Count',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (row) => displayMap[row.getValue()],
    }),
    columnHelper.accessor('openedAt', {
      header: 'Opened At',
      id: 'openedAt',
      cell: (row) => {
        const dateOpened = new Date(row.getValue())

        const dateOpenedString = dateOpened.toLocaleDateString()
        const timeOpenInHours = Math.round((Date.now() - dateOpened.getTime()) / 1000 / 60 / 60)

        const icon = timeOpenInHours > FILL_THRESHOLD ? '🔥' : ''

        const color = timeOpenInHours > FILL_THRESHOLD ? 'red' : ''

        return <Text color={color}>{`${dateOpenedString} (${timeOpenInHours} hours) ${icon}`}</Text>
      },
      sortingFn: (row1, row2, columnId) => {
        const date1 = new Date(row1.getValue(columnId))
        const date2 = new Date(row2.getValue(columnId))

        return date1.getTime() - date2.getTime()
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
  const router = useRouter()
  const { data: orders } = useOrdersData()

  const searchParams = useSearchParams()
  const showClosed = searchParams?.get('show_closed')

  const filteredOrders =
    showClosed == 'yes'
      ? orders ?? []
      : orders?.filter((order) => order.status !== 'not_filled' && order.status !== 'filled') ?? []

  if (!orders) return <LoadingPage />

  return (
    <Stack overflow={'scroll'} pb={'2rem'}>
      <Checkbox
        onChange={() => {
          showClosed == 'yes' ? router.push('/orders') : router.push('/orders?show_closed=yes')
        }}
      >
        Show Closed Orders
      </Checkbox>
      <Table data={filteredOrders} />
    </Stack>
  )
}

export default Orders
