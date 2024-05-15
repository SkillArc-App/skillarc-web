'use client'

import DataTable from '@/frontend/components/DataTable.component'
import FormInputField from '@/frontend/components/FormInputField'
import FormikSelect from '@/frontend/components/FormikSelect'
import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { put } from '@/frontend/http-common'
import { EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
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
  SimpleGrid,
  Spacer,
  Stack,
  Tag,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useState } from 'react'
import { colorMap, displayMap } from '../constants'
import { useOrderActivationMutation } from '../hooks/useOrderActivationMutation'
import { useOrderClosedMutation } from '../hooks/useOrderClosedNotFilledMutation'
import { useOrderMutation } from '../hooks/useOrderMutation'
import { useOrderQuery } from '../hooks/useOrderQuery'
import { Candidate, CandidateStatuses, CandidateStatusesMapping, JobOrder } from '../types'

const QuantityDisplay = ({ id, orderCount }: JobOrder) => {
  const [editing, setEditing] = useState(!orderCount)
  const jobOrder = useOrderMutation()

  const initialValue = { orderCount: orderCount ?? 1 }

  const handleSubmit = ({ orderCount }: { orderCount: number }) => {
    jobOrder.mutate({ id, orderCount })
    setEditing(false)
  }

  if (editing) {
    return (
      <Formik initialValues={initialValue} onSubmit={handleSubmit}>
        {(props) => (
          <Form>
            <HStack>
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
            </HStack>
          </Form>
        )}
      </Formik>
    )
  } else {
    return (
      <HStack cursor="pointer" _hover={{ '.editIcon': { opacity: 1 } }}>
        <Text>{`Order Count: ${orderCount}`}</Text>
        <Box className="editIcon" opacity={0}>
          <EditIcon onClick={() => setEditing(true)} />
        </Box>
      </HStack>
    )
  }
}

const JobOrderCta = ({ id, status }: JobOrder) => {
  const activate = useOrderActivationMutation()
  const close = useOrderClosedMutation()
  const jobClosed = ['filled', 'not_filled'].includes(status ?? '')

  return jobClosed ? (
    <Button onClick={() => activate.mutate(id)}>Reactivate Job Order</Button>
  ) : (
    <Button onClick={() => close.mutate(id)}>Close Job Order Without Filling</Button>
  )
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
        <Link onClick={() => onCandidateClick(row.row.original)}>
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
  const { data: order, refetch: refetchOrder } = useOrderQuery(id)

  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const token = useAuthToken()

  const onCandidateClick = (candidate: Candidate) => {
    setActiveCandidate(candidate)
    onOpen()
  }

  const onSubmit = async ({ activeCandidateStatus }: { activeCandidateStatus: string }) => {
    if (!token) return
    if (!activeCandidate) return

    await put(
      `/job_orders/orders/${id}/candidates/${activeCandidate?.seekerId}`,
      {
        status: activeCandidateStatus,
      },
      token,
    )

    await refetchOrder()
    onClose()
  }

  const onAddNote = () => {
    console.log('Adding note', noteDraft)

    refetchOrder()
    setNoteDraft('')
  }

  if (!order) return <LoadingPage />

  const initialValue = {
    activeCandidateStatus: activeCandidate?.status ?? '',
  }

  return (
    <>
      <Stack gap={'1rem'} pb={'2rem'}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink as={NextLink} href="/orders">
              {'< Back to Orders'}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
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
            <Flex>
              <QuantityDisplay {...order} />
              <Spacer />
              <JobOrderCta {...order} />
            </Flex>
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
          <Formik initialValues={initialValue} onSubmit={onSubmit}>
            <Form>
              <ModalBody>
                <Stack spacing={2}>
                  <FormikSelect
                    name="activeCandidateStatus"
                    label="Status"
                    options={Object.values(CandidateStatuses).map((status) => ({
                      key: status,
                      value: status,
                    }))}
                  />
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" type="submit">
                  Save
                </Button>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Order
