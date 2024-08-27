'use client'

import DataTable from '@/components/DataTable'
import { Link, Text } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useCoachFeed } from '../hooks/useCoachFeed'
import { FeedEvent } from '../types'

const Feed = () => {
  const { data: feedEvents } = useCoachFeed()

  const columnHelper = createColumnHelper<FeedEvent>()
  const occurredAtColumnId = 'occurred-at'

  const columns = [
    columnHelper.accessor('contextId', {
      header: 'Email',
      cell: (row) =>
        !!row.getValue() ? (
          <Link as={NextLink} href={`/coaches/contexts/${row.row.original.contextId}`}>
            {row.row.original.seekerEmail ?? 'Unknown'}
          </Link>
        ) : (
          <Text>{row.row.original.seekerEmail ?? 'Unknown'}</Text>
        ),
    }),
    columnHelper.accessor('seekerPhoneNumber', {
      header: 'Phone',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('description', {
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
    columnHelper.accessor('occurredAt', {
      header: 'Occurred At',
      id: occurredAtColumnId,
      cell: (row) => {
        const date = new Date(row.getValue())

        return date.toLocaleString()
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
      desc: true,
      id: occurredAtColumnId,
    },
  ]

  return <DataTable columns={columns} data={feedEvents ?? []} initialSortState={initialSortState} />
}

export default Feed
