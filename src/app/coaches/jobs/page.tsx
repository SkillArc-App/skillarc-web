'use client'

import DataTable from '@/frontend/components/DataTable.component'
import { Link } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useCoachJobs } from '../hooks/useCoachJobs'
import { CoachJob } from '../types'

const Jobs = () => {
  const { data: jobs } = useCoachJobs()

  return <Table data={jobs ?? []} />
}

const Table = ({ data }: { data: CoachJob[] }) => {
  const columnHelper = createColumnHelper<CoachJob>()

  const columns = [
    columnHelper.accessor('employmentTitle', {
      header: 'Title',
      cell: (row) => (
        <Link as={NextLink} href={`/jobs/${row.row.original.id}`}>
          {row.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('employerName', {
      header: 'Employer',
      cell: (row) => row.getValue(),
    }),
  ]

  return <DataTable columns={columns} data={data} />
}

export default Jobs
