'use client'

import { useCoachSeekerTasks } from '@/app/coaches/hooks/useCoachTasks'
import { CoachTask } from '@/app/coaches/types'
import { IdParams } from '@/app/common/types/PageParams'
import { Heading } from '@/app/components/Heading'
import { LoadingPage } from '@/app/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { put } from '@/frontend/http-common'
import { Stack } from '@chakra-ui/react'
import { TaskBox } from './components/TaskBox'

interface GroupedReminders {
  [key: string]: CoachTask[]
}

const Tasks = ({ params: { id } }: IdParams) => {
  const token = useAuthToken()
  const { data: tasks, refetch } = useCoachSeekerTasks(id)

  const filteredTasks = tasks?.filter(({ state }) => state === 'set')

  const groupedReminders = (filteredTasks ?? [])
    .sort((a, b) => {
      return new Date(b.reminderAt).getTime() - new Date(a.reminderAt).getTime()
    })
    .reduce((acc: GroupedReminders, curr) => {
      const month = new Date(curr.reminderAt).getMonth()
      const year = new Date(curr.reminderAt).getFullYear()

      const yearMonthDate = new Date(year, month).toString()

      const monthNotes = acc[yearMonthDate] || []

      return { ...acc, [yearMonthDate]: [...monthNotes, curr] }
    }, {})

  if (!filteredTasks) {
    return <LoadingPage />
  }

  // For now this both "completes" and "cancels" tasks
  const handleCompleteTask = async (id: string) => {
    if (!token) return

    await put(`/coaches/tasks/reminders/${id}/complete`, {}, token)
    refetch()
  }

  return (
    <Stack pr={'1rem'} gap={'1rem'} overflowY={'scroll'}>
      {Object.entries(groupedReminders)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, tasks]) => (
          <Stack key={date}>
            <Heading type="h3" color={'black'}>
              {new Date(date).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </Heading>
            {tasks.map((task) => (
              <TaskBox
                key={task.id}
                task={task}
                onTaskCancelled={handleCompleteTask}
                onTaskCompleted={handleCompleteTask}
              />
            ))}
          </Stack>
        ))}
    </Stack>
  )
}

export default Tasks
