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
import { Job } from 'app/common/types/Job'
import FormikInput from 'app/components/FormikInput'
import FormikSelect from 'app/components/FormikSelect'
import FormikSwitch from 'app/components/FormikSwitch'
import FormikTextArea from 'app/components/FormikTextArea'
import { Form, Formik } from 'formik'
import { useAllEmployers } from '../../hooks/useAllEmployerData'

const categoryOptions = [
  {
    value: 'marketplace',
    label: 'Marketplace',
  },
  {
    value: 'staffing',
    label: 'Staffing',
  },
]

type JobModalProps = {
  isOpen: boolean
  title: string
  onClose: () => void
  initialValue: Partial<JobBasics>
  onSubmit: (job: Partial<JobBasics>) => void
}

export type JobBasics = {
  employerId: string
  hideJob: boolean
} & Pick<
  Job,
  | 'category'
  | 'employmentTitle'
  | 'location'
  | 'employmentType'
  | 'benefitsDescription'
  | 'responsibilitiesDescription'
  | 'requirementsDescription'
  | 'workDays'
  | 'schedule'
>

export function JobBasicsModal({ isOpen, title, onClose, initialValue, onSubmit }: JobModalProps) {
  const { data: employers } = useAllEmployers()

  if (!employers) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <Formik initialValues={initialValue} onSubmit={onSubmit}>
          {(props) => (
            <Form>
              <ModalBody>
                <VStack spacing={2}>
                  <FormikSelect
                    label="Category"
                    name="category"
                    isRequired
                    options={
                      categoryOptions?.map((category) => ({
                        key: category.value,
                        value: category.label,
                      })) ?? []
                    }
                  />
                  <FormikSelect
                    label="Employer"
                    name="employerId"
                    isRequired
                    options={
                      employers?.map((employer) => ({
                        key: employer.id,
                        value: employer.name,
                      })) ?? []
                    }
                  />
                  <FormikInput<string>
                    isRequired
                    type="text"
                    label="Employment Title"
                    name="employmentTitle"
                  />
                  <FormikInput<string> isRequired type="text" label="Location" name="location" />
                  <FormikSelect
                    label="Employment Type"
                    name="employmentType"
                    isRequired
                    options={[
                      { key: 'FULLTIME', value: 'FULLTIME' },
                      { key: 'PARTTIME', value: 'PARTTIME' },
                    ]}
                  />
                  <FormikTextArea
                    isRequired
                    label="Benefits Description"
                    name="benefitsDescription"
                  />
                  <FormikTextArea
                    isRequired
                    label="Responsibilities Description"
                    name="responsibilitiesDescription"
                  />
                  <FormikTextArea
                    isRequired
                    label="Requirements Description"
                    name="requirementsDescription"
                  />
                  <FormikTextArea isRequired label="Work days" name="workDays" />
                  <FormikTextArea isRequired label="Schedule" name="schedule" />
                  <FormikSwitch label="Hide Job" name="hideJob" />
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
