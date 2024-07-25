import { PartialRequired } from '@/app/common/types/partial-required'
import FormikInput from '@/app/components/FormikInput'
import FormikTextArea from '@/app/components/FormikTextArea'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { SubmittableCoachTask } from '../../types'

interface ReminderProps {
  isOpen: boolean
  contextId?: string | null
  onClose: () => void
  onSubmit: (lead: SubmittableCoachTask) => void
}

// Some chatGPT code to get a string like
// toISOString() but in the local timezone
// the datetime-local does handle timezones so we have
// to add the back in later
const formatDateTimeAsIso = (date = new Date()) => {
  const pad = (x: number) => x.toString().padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1) // getMonth() is zero-indexed
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const defaultTime = () => {
  // Create a new Date object for tomorrow by adding one day to the current date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Set the time to 8 AM local time
  tomorrow.setHours(9, 0, 0, 0)

  return tomorrow
}

const isValid = (
  reminder: Partial<SubmittableCoachTask>,
): reminder is PartialRequired<SubmittableCoachTask, 'note' | 'reminderAt'> => {
  return !!reminder.note && !!reminder.reminderAt
}

const ReminderModal = ({ isOpen, onClose, onSubmit, contextId = null }: ReminderProps) => {
  const initialValue: Partial<SubmittableCoachTask> = {
    note: '',
    reminderAt: formatDateTimeAsIso(defaultTime()),
  }

  const handleSubmit = (values: Partial<SubmittableCoachTask>) => {
    if (isValid(values)) {
      onSubmit({
        note: values.note,

        // We do this here to basically add the timezone back in
        reminderAt: new Date(values.reminderAt).toISOString(),
        contextId,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new reminder</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={handleSubmit}>
          {(props) => (
            <Form>
              <ModalBody>
                <VStack spacing={2}>
                  <FormikInput<string>
                    isRequired
                    type="datetime-local"
                    min={formatDateTimeAsIso()}
                    label="Reminder Time"
                    name="reminderAt"
                  />
                  <FormikTextArea isRequired type="textarea" label="Reminder Note" name="note" />
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="green" mr={3} isLoading={props.isSubmitting} type="submit">
                  Save
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default ReminderModal
