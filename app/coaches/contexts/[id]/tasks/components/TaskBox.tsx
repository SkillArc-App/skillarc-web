import { CoachTask } from '@/coaches/types'
import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { FaCheck } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'

interface TaskProps {
  task: CoachTask
  onTaskCompleted(id: string): void
  onTaskCancelled(id: string): void
}

export const TaskBox = ({ task, onTaskCancelled, onTaskCompleted }: TaskProps) => {
  const dateObj = new Date(task.reminderAt)

  return (
    <Box boxShadow="0px .25rem .25rem rgba(0, 0, 0, 0.1)" bg={'white'} py={'1rem'} px={'0.5rem'}>
      <Box display="flex" alignItems={'center'} justifyContent={'space-between'} flexDir="row">
        <VStack align={'flex-start'}>
          <Text variant={'b2'}>{task.note}</Text>
          <Text variant={'b3'}>
            {`${dateObj.toLocaleTimeString()} ${dateObj.toLocaleDateString()} `}
          </Text>
        </VStack>
        <HStack>
          <IconButton
            ml={2}
            colorScheme="red"
            aria-label="Cancel Task"
            icon={<FaXmark />}
            onClick={() => onTaskCancelled(task.id)}
          />
          <IconButton
            ml={2}
            colorScheme="green"
            aria-label="Complete Task"
            icon={<FaCheck />}
            onClick={() => onTaskCompleted(task.id)}
          />
        </HStack>
      </Box>
    </Box>
  )
}
