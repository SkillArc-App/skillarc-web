'use client'

import DataTable from '@/frontend/components/DataTable.component'
import FormInputField from '@/frontend/components/FormInputField'
import { LoadingPage } from '@/frontend/components/Loading'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  GridItem,
  HStack,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useState } from 'react'
import { useOrderData } from '../hooks/useOrderData'
import { useOrderMutation } from '../hooks/useOrderMutation'
import { Candidate, CandidateStatusesMapping, JobOrderStatusMapping } from '../types'

const colorMap: JobOrderStatusMapping = {
  needs_order_count: 'red',
  open: 'blue',
  waiting_on_employer: 'yellow.500',
  filled: 'green',
  not_filled: 'red',
}

const displayMap: JobOrderStatusMapping = {
  needs_order_count: 'Needs Order Count',
  open: 'Open',
  waiting_on_employer: 'Waiting on Employer',
  filled: 'Closed',
  not_filled: 'Closed Without Fill',
}

const QuantityDisplay = ({ id, orderCount }: { id: string; orderCount?: number }) => {
  const [editing, setEditing] = useState(!orderCount)
  const jobOrder = useOrderMutation()

  const initialValue = { orderCount: orderCount ?? 10 }

  const handleSubmit = ({ orderCount }: { orderCount: number }) => {
    jobOrder.mutate({ id, orderCount })
    setEditing(false)
  }

  if (editing) {
    return (
      <Formik initialValues={initialValue} onSubmit={handleSubmit}>
        {(props) => (
          <Form>
            <VStack>
              <FormInputField<number>
                isRequired
                type="number"
                min={1}
                label="Order Count"
                name="orderCount"
              />
              <Button variant={'primary'} mt={'1rem'} isLoading={props.isSubmitting} type="submit">
                Update
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    )
  } else {
    return (
      <HStack cursor="pointer" _hover={{ '.editIcon': { opacity: 1 } }}>
        <Text>{`${orderCount} positions`}</Text>
        <Box className="editIcon" opacity={0}>
          <EditIcon onClick={() => setEditing(true)} />
        </Box>
      </HStack>
    )
  }
}

const CandidateTable = ({
  candidates,
  onCandidateClick,
}: {
  candidates: Candidate[]
  onCandidateClick: (candidate: Candidate) => void
}) => {
  const columnHelper = createColumnHelper<Candidate>()

  const columns = [
    columnHelper.accessor(() => {}, {
      header: 'Name',
      sortingFn: (a, b) => {
        return `${a.original.firstName} ${a.original.lastName}`.localeCompare(
          `${b.original.firstName} ${b.original.lastName}`,
        )
      },
      cell: (row) => (
        <Link onClick={() => onCandidateClick(row.row.original)} href="" as={NextLink}>
          {row.row.original.firstName} {row.row.original.lastName}
        </Link>
      ),
    }),
    columnHelper.accessor('appliedAt', {
      header: 'Applied At',
      cell: (row) => (row.getValue() ? new Date(row.getValue() ?? '').toDateString() : ''),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (row) => {
        const status = row.getValue()

        const colorMap: CandidateStatusesMapping = {
          added: 'blue',
          recommended: 'yellow.500',
          hired: 'green',
          rescinded: 'red',
        }

        const displayMap: CandidateStatusesMapping = {
          added: 'Open',
          recommended: 'Sent to Employer',
          hired: 'Hired',
          rescinded: 'Rejected',
        }

        return <Text color={colorMap[status]}>{displayMap[status]}</Text>
      },
    }),
  ]

  return <DataTable columns={columns} data={candidates} />
}

const Order = () => {
  const { id } = useFixedParams('id')
  const { data: order, refetch: refetchOrder } = useOrderData(id)

  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onCandidateClick = (candidate: Candidate) => {
    setActiveCandidate(candidate)
    onOpen()
  }

  const onAddNote = () => {
    console.log('Adding note', noteDraft)

    refetchOrder()
    setNoteDraft('')
  }

  if (!order) return <LoadingPage />

  return (
    <>
      <Stack gap={'1rem'} pb={'2rem'}>
        <Card>
          <CardHeader>
            <Heading size={'md'}>
              <HStack gap={'0.5rem'}>
                <Box>
                  {order.employmentTitle} - {order.employerName}
                </Box>
                <Tag colorScheme={colorMap[order.status]}>{displayMap[order.status]}</Tag>
              </HStack>
            </Heading>
          </CardHeader>
          <CardBody>
            <QuantityDisplay orderCount={order.orderCount} id={order.id} />
          </CardBody>
        </Card>
        <SimpleGrid columns={5} gap={'1rem'}>
          <GridItem colSpan={2}>
            <Stack>
              <Textarea
                background={'white'}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return
                  onAddNote()
                }}
              ></Textarea>
              {(order.notes ?? []).map((note) => {
                return (
                  <Card key={note.id}>
                    <CardBody>
                      <Stack>
                        <Text variant={'b2'}>{note.content}</Text>
                        <Text color={'gray'} variant={'b3'}>
                          {note.noteTakenBy} - {new Date(note.createdAt).toDateString()}
                        </Text>
                      </Stack>
                    </CardBody>
                  </Card>
                )
              })}
            </Stack>
          </GridItem>
          <GridItem colSpan={3}>
            <Card>
              <CandidateTable
                onCandidateClick={onCandidateClick}
                candidates={order.candidates ?? []}
              />
            </Card>
          </GridItem>
        </SimpleGrid>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {activeCandidate?.firstName} {activeCandidate?.lastName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack>
              <b>Status</b>
              <Select>
                <option value="open">Open</option>
                <option value="sent_to_employer">Sent to Employer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </Select>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" type="submit">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Order
