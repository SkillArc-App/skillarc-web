'use client'

import DataTable from '@/app/components/DataTable'
import { LoadingPage } from '@/app/components/Loading'
import { useAuthToken } from '@/app/hooks/useAuthToken'
import { post, put } from '@/app/http-common'
import { Box, Button, HStack, IconButton, Link, VStack } from '@chakra-ui/react'
import { SortingState, createColumnHelper } from '@tanstack/react-table'
import NextLink from 'next/link'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import { useCoachTasks } from '../hooks/useCoachTasks'
import { CoachTask, SubmittableCoachTask } from '../types'
import ReminderModal from './components/ReminderModal'

const Tasks = () => {
  const { data: tasks, isLoading, refetch } = useCoachTasks()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const token = useAuthToken()

  const handleSubmitTask = async (reminder: SubmittableCoachTask) => {
    if (!token) return

    await post(`/coaches/tasks/reminders`, { reminder }, token)
    refetch()

    setIsModalOpen(false)
  }

  // For now this both "completes" and "cancels" tasks
  const handleCompleteTask = async (id: string) => {
    if (!token) return

    await put(`/coaches/tasks/reminders/${id}/complete`, {}, token)
    refetch()
  }

  const filteredTasks = tasks?.filter(({ state }) => state === 'set') ?? []

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <Box>
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
      />
      <VStack width={'100%'} align={'start'}>
        <Button variant={'solid'} colorScheme="green" onClick={() => setIsModalOpen(true)}>
          New Reminder
        </Button>

        {tasks && <Table data={filteredTasks} handleCompleteReminder={handleCompleteTask} />}
      </VStack>
    </Box>
  )
}

const Table = ({
  data,
  handleCompleteReminder,
}: {
  data: CoachTask[]
  handleCompleteReminder: (id: string) => void
}) => {
  const columnHelper = createColumnHelper<CoachTask>()
  const dueAtColumnId = 'due-at'

  const columns = [
    columnHelper.accessor('contextId', {
      header: 'Associated Seeker',
      cell: (row) => {
        if (!!row.getValue()) {
          return (
            <Link as={NextLink} href={`/coaches/contexts/${row.getValue()}/tasks`}>
              Jump to Seeker
            </Link>
          )
        } else {
          return 'No associated seeker'
        }
      },
    }),
    columnHelper.accessor('note', {
      header: 'Task',
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
    columnHelper.accessor('reminderAt', {
      header: 'Due at',
      id: dueAtColumnId,
      cell: (row) => {
        const reminderDate = new Date(row.getValue())

        if (new Date() > reminderDate) {
          return (
            <p
              style={{
                color: 'red',
              }}
            >{`Overdue: ${new Date(row.getValue()).toLocaleString()}`}</p>
          )
        } else {
          return new Date(row.getValue()).toLocaleString()
        }
      },
      sortDescFirst: false,
      sortingFn: (row1, row2, columnId) => {
        const date1 = new Date(row1.getValue(columnId))
        const date2 = new Date(row2.getValue(columnId))

        return date1.getTime() - date2.getTime()
      },
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: (row) => (
        <HStack>
          <IconButton
            ml={2}
            colorScheme="red"
            aria-label="Cancel Task"
            icon={<FaXmark />}
            onClick={() => handleCompleteReminder(row.getValue())}
          />
          <IconButton
            ml={2}
            colorScheme="green"
            aria-label="Complete Task"
            icon={<FaCheck />}
            onClick={() => handleCompleteReminder(row.getValue())}
          />
        </HStack>
      ),
    }),
  ]

  const initialSortState: SortingState = [
    {
      desc: false,
      id: dueAtColumnId,
    },
  ]

  return <DataTable columns={columns} data={data} initialSortState={initialSortState} />
}

export default Tasks
