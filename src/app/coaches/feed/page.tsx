'use client'

import DataTable from '@/app/components/DataTable'
import { Link } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useCoachFeed } from '../hooks/useCoachFeed'
import { FeedEvent } from '../types'

const Feed = () => {
  const { data: feedEvents } = useCoachFeed()

  const columnHelper = createColumnHelper<FeedEvent>()
  const occurredAtColumnId = 'occurred-at'

  const columns = [
    columnHelper.accessor('seekerEmail', {
      header: 'Email',
      cell: (row) => (
        <Link as={NextLink} href={`/coaches/contexts/${row.row.original.contextId}`}>
          {row.getValue()}
        </Link>
      ),
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
