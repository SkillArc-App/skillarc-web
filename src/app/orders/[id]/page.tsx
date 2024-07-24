'use client'

import DataTable from '@/app/components/DataTable'
import FormikInput from '@/app/components/FormikInput'
import FormikSelect from '@/app/components/FormikSelect'
import { LoadingPage } from '@/app/components/Loading'
import NotesList from '@/app/components/NoteList'
import { useTeamsQuery } from '@/app/teams/hooks/useTeamsQuery'
import { IdParams } from '@/common/types/PageParams'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
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
  GridItem,
  HStack,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useState } from 'react'
import { FaEllipsis } from 'react-icons/fa6'
import {
  candidateColorMap,
  candidateDisplayMap,
  orderColorMap,
  orderDisplayMap,
} from '../constants'
import { useNotes } from '../hooks/useNotes'
import { useOrderActivationMutation } from '../hooks/useOrderActivationMutation'
import { useOrderClosedMutation } from '../hooks/useOrderClosedNotFilledMutation'
import { useOrderMutation } from '../hooks/useOrderMutation'
import { useOrderQuery } from '../hooks/useOrderQuery'
import { Candidate, CandidateStatuses, JobOrder } from '../types'

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
              <FormikInput<number>
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
    <Button onClick={() => activate.mutate(id)}>Reactivate</Button>
  ) : (
    <Button onClick={() => close.mutate(id)}>Close Without Filling</Button>
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
      filterFn: (row, _, filterValue) => {
        const fullName = `${row.original.firstName} ${row.original.lastName}`.toLowerCase()
        return fullName.includes(filterValue.toLowerCase())
      },
      cell: (row) => {
        const candidate = row.row.original
        return (
          <Stack>
            <Link onClick={() => onCandidateClick(candidate)}>
              {candidate.firstName} {candidate.lastName}
            </Link>
            {candidate.recommendedAt && (
              <Text color={'gray'} fontSize={'xs'}>
                Recommended by {candidate.recommendedBy} -{' '}
                {new Date(candidate.recommendedAt).toDateString()}
              </Text>
            )}
          </Stack>
        )
      },
    }),
    columnHelper.accessor('appliedAt', {
      header: 'Applied At',
      cell: (row) => (row.getValue() ? new Date(row.getValue() ?? '').toDateString() : ''),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (row) => {
        const status = row.getValue()

        return <Text color={candidateColorMap[status]}>{candidateDisplayMap[status]}</Text>
      },
    }),
    columnHelper.accessor(() => {}, {
      header: 'Actions',
      cell: (row) => {
        return (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<FaEllipsis />}
              size={'sm'}
              variant="ghost"
            />
            <MenuList>
              <MenuItem>
                <NextLink href={`/coaches/contexts/${row.row.original.personId}`}>
                  Coach Profile
                </NextLink>
              </MenuItem>
              <MenuItem>
                <NextLink href={`/profiles/${row.row.original.personId}`}>Seeker Profile</NextLink>
              </MenuItem>
            </MenuList>
          </Menu>
        )
      },
    }),
  ]

  return <DataTable columns={columns} data={candidates} />
}

const Order = ({ params: { id } }: IdParams) => {
  const { data: order, refetch: refetchOrder } = useOrderQuery(id)
  const { data: teams } = useTeamsQuery()
  const { addNote, modifyNote, removeNote } = useNotes()

  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null)
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
      `/job_orders/orders/${id}/candidates/${activeCandidate?.personId}`,
      {
        status: activeCandidateStatus,
      },
      token,
    )

    await refetchOrder()
    onClose()
  }

  if (!order) return <LoadingPage />

  const initialValue = {
    activeCandidateStatus: activeCandidate?.status ?? '',
  }
  const team = teams?.find((team) => team.id == order.teamId)

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
        <Card role="region">
          <CardHeader>
            <HStack>
              <VStack align={'start'}>
                <Heading size={'md'}>
                  <Link as={NextLink} href={`/jobs/${order.jobId}`}>
                    {order.employmentTitle} - {order.employerName}
                  </Link>
                </Heading>
                <HStack>
                  <Tag colorScheme={orderColorMap[order.status]}>
                    {orderDisplayMap[order.status]}
                  </Tag>
                  {team && <Tag>{team.name}</Tag>}
                </HStack>
              </VStack>
              <Spacer />
              <QuantityDisplay {...order} />
              <JobOrderCta {...order} />
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align={'start'}>
              <Heading size={'sm'}>Candidate Requirements</Heading>
              <Text>{order.requirementsDescription}</Text>
              <Heading size={'sm'}>Candidate Responsibilities</Heading>
              <Text>{order.responsibilitiesDescription}</Text>
            </VStack>
          </CardBody>
        </Card>
        <SimpleGrid columns={5} gap={'1rem'}>
          <GridItem colSpan={2}>
            <NotesList
              notes={order.notes}
              onCreate={(note) => addNote.mutateAsync({ jobId: id, note })}
              onModify={(noteId, note) => modifyNote.mutateAsync({ jobId: id, note, noteId })}
              onDelete={(noteId) => removeNote.mutateAsync({ jobId: id, noteId })}
            />
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
            {(props) => (
              <Form>
                <ModalBody>
                  <Stack spacing={2}>
                    <FormikSelect
                      name="activeCandidateStatus"
                      label="Status"
                      options={Object.values(CandidateStatuses).map((status) => ({
                        key: status,
                        value: candidateDisplayMap[status],
                      }))}
                    />
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="green" isLoading={props.isSubmitting} type="submit">
                    Save
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Order
