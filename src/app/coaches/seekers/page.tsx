'use client'

import DataTable from '@/frontend/components/DataTable.component'
import { CoachSeeker, useCoachSeekersData } from '@/frontend/hooks/useCoachSeekersData'
import { Box, HStack, Link, Tag } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'

const Coaches = () => {
  const { data } = useCoachSeekersData()

  return (
    <Box width={'100%'}>
      {data && <Table data={data} />}
    </Box>
  )
}


const Table = ({ data }: { data: CoachSeeker[] }) => {
  const columnHelper = createColumnHelper<CoachSeeker>()
  const lastActiveColumnId = 'last-active-on'

  const columns = [
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (row) => (
        <Link as={NextLink} href={`/coaches/s/${row.row.original.seekerId}`}>
          {row.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('seekerId', {
      header: 'Profile',
      cell: (row) => (
        <Link as={NextLink} href={`/profiles/${row.row.original.seekerId}`}>
          Jump to Profile
        </Link>
      ),
    }),
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('assignedCoach', {
      header: 'Assigned Coach',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('barriers', {
      header: 'Barriers',
      cell: (row) => (
        <HStack>
          {row.getValue().map((barrier, key) => (
            <Tag key={key}>{barrier}</Tag>
          ))}
        </HStack>
      ),
    }),
    columnHelper.accessor('lastActiveOn', {
      header: 'Last Active On',
      id: lastActiveColumnId,
      cell: (row) => row.getValue(),
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
      cell: (row) => row.getValue(),
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
