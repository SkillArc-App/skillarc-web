'use client'

import DataTable from '@/frontend/components/DataTable.component'
import FormikSelect from '@/frontend/components/FormikSelect'
import { LoadingPage } from '@/frontend/components/Loading'
import {
  Button,
  Checkbox,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { orderDisplayMap } from '../constants'
import { useAddOrderMutation } from '../hooks/useAddOrderMutation'
import { useJobsQuery } from '../hooks/useJobsQuery'
import { useOrdersQuery } from '../hooks/useOrdersQuery'
import { JobOrderSummary } from '../types'
import { useTeamsQuery } from '../../teams/hooks/useTeamsQuery'
import { Team } from '../../teams/types'

const FILL_THRESHOLD = 72

const Table = ({ data, teams }: { data: JobOrderSummary[], teams: Team[] }) => {
  const columnHelper = createColumnHelper<JobOrderSummary>()

  const columns = [
    columnHelper.accessor('employmentTitle', {
      header: 'Title',
      filterFn: 'includesString',
      cell: (row) => (
        <Link href={`/orders/${row.row.original.id}`} as={NextLink}>
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
      filterFn: 'includesString',
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
    columnHelper.accessor('teamId', {
      header: 'Team',
      cell: (row) => teams.find((team) => team.id == row.getValue())?.name
    }),
    columnHelper.accessor('orderCount', {
      header: 'Order',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('hireCount', {
      header: 'Hires',
      cell: (row) => row.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (row) => orderDisplayMap[row.getValue()],
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

const NewJobOrderModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { data: jobs } = useJobsQuery()
  const addOder = useAddOrderMutation({ onSuccess: onClose })

  if (!jobs) {
    return <></>
  }

  const initialValue = {
    jobId: jobs[0].id,
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create A New Job Order</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={(form) => addOder.mutate(form)}>
          <Form>
            <ModalBody>
              <Stack spacing={2}>
                <FormikSelect
                  name="jobId"
                  label="Select Job"
                  options={jobs.map((job) => ({
                    key: job.id,
                    value: `${job.employmentTitle}: ${job.employerName}`,
                  }))}
                />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" type="submit" isLoading={addOder.isLoading}>
                Save
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  )
}

const Orders = () => {
  const router = useRouter()
  const { data: orders } = useOrdersQuery()
  const { data: teams } = useTeamsQuery()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const searchParams = useSearchParams()
  const showClosedParam = searchParams?.get('show_closed')
  const showClosed = showClosedParam == 'yes'

  const filteredOrders = showClosed
    ? orders ?? []
    : orders?.filter((order) => order.status !== 'not_filled' && order.status !== 'filled') ?? []

  if (!orders) return <LoadingPage />

  return (
    <Stack overflow={'scroll'} pt={'2rem'}>
      <HStack>
        <Checkbox
          isChecked={showClosed}
          onChange={() => {
            showClosed ? router.push('/orders') : router.push('/orders?show_closed=yes')
          }}
        >
          Show Closed Orders
        </Checkbox>
        <Spacer />
        <Button colorScheme="green" onClick={onOpen}>
          Create New Job Order
        </Button>
      </HStack>
      <Table data={filteredOrders} teams={teams ?? []} />
      <NewJobOrderModal isOpen={isOpen} onClose={onClose} />
    </Stack>
  )
}

export default Orders
