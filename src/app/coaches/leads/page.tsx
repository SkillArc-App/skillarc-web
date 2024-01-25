'use client'

import { useCoachLeadsQuery } from '@/app/coaches/hooks/useCoachLeadsQuery'
import DataTable from '@/frontend/components/DataTable.component'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { post } from '@/frontend/http-common'
import { Box, Button, VStack } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { useState } from 'react'
import { SeekerLead, SubmittableSeekerLead } from '../types'
import NewLeadModal from './components/NewLeadModal'

const Leads = () => {
  const { data: leads } = useCoachLeadsQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newLeads, setNewLeads] = useState<SeekerLead[]>([])
  const token = useAuthToken()

  const handleSubmit = (lead: SubmittableSeekerLead) => {
    if (!token) return

    post(`${process.env.NEXT_PUBLIC_API_URL}/coaches/leads/`, { lead }, token, {
      camel: true,
    }).then(() => {
      setNewLeads((currentNewLeads) => {
        return [
          ...(currentNewLeads ?? []),
          { ...lead, leadCapturedBy: 'You', leadCapturedAt: 'Now', status: 'new' },
        ]
      })

      setIsModalOpen(false)
    })
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
        {leads && <Table data={[...leads, ...newLeads]} />}
      </VStack>
    </Box>
  )
}

const Table = ({ data }: { data: SeekerLead[] }) => {
  const columnHelper = createColumnHelper<SeekerLead>()

  const columns = [
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
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
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('leadCapturedBy', {
      header: 'Lead Captured By',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (row) => row.getValue(),
    }),
  ]

  return <DataTable columns={columns} data={data} />
}

export default Leads
