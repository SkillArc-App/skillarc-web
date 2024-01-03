import { Text } from '@/frontend/components/Text.component'
import { useUser } from '@/frontend/hooks/useUser'
import { FrontendAnalyticsService } from '@/frontend/services/analytics.service'
import {
  Box,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spacer,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FaChevronRight, FaCircleCheck } from 'react-icons/fa6'

const FastTrackModal = () => {
  const router = useRouter()
  const { data: user } = useUser()

  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  useEffect(() => {
    if (isOpen) {
      FrontendAnalyticsService.track('FastTrackModal-opened')
    }
  }, [])

  const onModalClose = () => {
    onClose()
    FrontendAnalyticsService.track('FastTrackModal-closed')
  }

  const allTasksComplete =
    user?.fastTrackTasks?.profile.every((task) => task.is_complete) &&
    user?.fastTrackTasks?.career.every((task) => task.is_complete)

  if (allTasksComplete) return <></>

  const profileTasks = user?.fastTrackTasks?.profile.map((task) => {
    return {
      name: task.name,
      isComplete: task.is_complete,
      onClick: () => {
        FrontendAnalyticsService.track('FastTrackModal-profile-task-clicked', {
          taskName: task.name,
        })
        onClose()
        router.push(task.route)
      },
    }
  })

  const careerTasks = user?.fastTrackTasks?.career.map((task) => {
    return {
      name: task.name,
      isComplete: task.is_complete,
      onClick: () => {
        FrontendAnalyticsService.track('FastTrackModal-career-task-clicked', {
          taskName: task.name,
        })
        router.push(task.route)
      },
    }
  })

  if (!profileTasks) return <></>
  if (!careerTasks) return <></>

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <ModalOverlay />
      <ModalContent m={'1rem'}>
        <ModalHeader>
          <Text type="overline">YOUR FAST TRACK TO THE TRADES</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack mb={'1rem'} gap={'1rem'}>
            <TaskGroup tasks={profileTasks} groupTitle="✏️ Get Ready to Apply" />
            <Divider borderColor="greyscale.300" />
            <TaskGroup tasks={careerTasks} groupTitle="🚀 Start your career!" />
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const Task = ({
  task,
  isComplete,
  onClick,
}: {
  task: string
  isComplete: boolean
  onClick: () => void
}) => {
  return (
    <HStack onClick={onClick} cursor={'pointer'}>
      <FaCircleCheck size="1.5rem" color="green" />
      <Text as={isComplete ? 's' : undefined} type="b1">
        {task}
      </Text>
      <Spacer />
      <FaChevronRight size="1.5rem" />
    </HStack>
  )
}

const TaskGroup = ({
  groupTitle,
  tasks,
}: {
  groupTitle: string
  tasks: { name: string; isComplete: boolean; onClick: () => void }[]
}) => {
  const progress = tasks.reduce(
    (acc, { isComplete }) => {
      if (isComplete) {
        acc.complete += 1
      }
      acc.outOf += 1
      return acc
    },
    { complete: 0, outOf: 0 },
  )

  const { complete, outOf } = progress
  return (
    <Box>
      <HStack>
        <Text type="b1Bold">{groupTitle}</Text>
        <Spacer />
        <Text type="b2">
          {complete}/{outOf}
        </Text>
      </HStack>
      <Progress
        mt={'0.75rem'}
        mb={'2rem'}
        borderRadius={2}
        colorScheme="green"
        size="sm"
        value={(complete / outOf) * 100}
      />
      <Stack gap={'1.5rem'}>
        {tasks.map(({ name, isComplete, onClick }, key) => {
          return <Task isComplete={isComplete} task={name} onClick={onClick} key={key} />
        })}
      </Stack>
    </Box>
  )
}

export default FastTrackModal
