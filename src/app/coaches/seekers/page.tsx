'use client'

import { useCoachSeekersData } from '@/app/coaches/hooks/useCoachSeekersData'
import { CoachSeeker } from '@/app/coaches/types'
import DataTable from '@/frontend/components/DataTable.component'
import { Box, HStack, Link, Tag } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'

const Coaches = () => {
  const { data } = useCoachSeekersData()

  return <Box width={'100%'}>{data && <Table data={data} />}</Box>
}

const Table = ({ data }: { data: CoachSeeker[] }) => {
  const columnHelper = createColumnHelper<CoachSeeker>()
  const lastActiveColumnId = 'last-active-on'

  const columns = [
    columnHelper.accessor('firstName', {
      header: 'Name',
      cell: (row) => (
        <Link as={NextLink} href={`/coaches/contexts/${row.row.original.id}`}>
          {`${row.getValue()} ${row.row.original.lastName}`}
        </Link>
      ),
    }),
    columnHelper.accessor('seekerId', {
      header: 'Navigation',
      cell: (row) => (
        <div>
          <Link as={NextLink} href={`/profiles/${row.row.original.seekerId}`}>
            Profile
          </Link>{' '}
          <Link as={NextLink} href={`/coaches/contexts/${row.row.original.id}`}>
            Dash
          </Link>
        </div>
      ),
    }),
    columnHelper.accessor('assignedCoach', {
      header: 'Coach',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('certifiedBy', {
      header: 'Certified By',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('barriers', {
      header: 'Barriers',
      cell: (row) => (
        <HStack>
          {row.getValue().map((barrier, key) => (
            <Tag key={key}>{barrier.name}</Tag>
          ))}
        </HStack>
      ),
    }),
    columnHelper.accessor('lastActiveOn', {
      header: 'Last Active On',
      id: lastActiveColumnId,
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
    columnHelper.accessor('lastContacted', {
      header: 'Last Contacted',
      cell: (row) => {
        return row.getValue() === 'Never' ? row.getValue() : new Date(row.getValue()).toDateString()
      },
      sortingFn: 'datetime',
    }),
  ]

  const initialSortState: SortingState = [
    {
      desc: true,
      id: lastActiveColumnId,
    },
  ]

  return <DataTable columns={columns} data={data} initialSortState={initialSortState} />
}

export default Coaches
