'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { Testimonial } from '@/common/types/Job'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { destroy, post } from '@/frontend/http-common'
import { DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useState } from 'react'

const TestimonialsPage = () => {
  const { id } = useFixedParams('id')

  const { data: job, refetch: refetchJob } = useAdminJob(id)

  const token = useAuthToken()

  const [testimonialName, setTestimonialName] = useState('')
  const [testimonialTitle, setTestimonialTitle] = useState('')
  const [testimonial, setTestimonial] = useState('')
  const [testimonialPhotoUrl, setTestimonialPhotoUrl] = useState('')

  const createTestimonial = async () => {
    if (!job) return
    if (!token) return

    await post(
      `/jobs/${job.id}/testimonials`,
      {
        jobId: id,
        name: testimonialName,
        title: testimonialTitle,
        testimonial,
        photoUrl: testimonialPhotoUrl,
      },
      token,
    )

    setTestimonialName('')
    setTestimonialTitle('')
    setTestimonial('')
    setTestimonialPhotoUrl('')
    refetchJob()
  }

  const removeTestimonial = async (testimonial: Testimonial) => {
    if (!job) return
    if (!token) return

    await destroy(`/jobs/${job.id}/testimonials/${testimonial.id}`, token)

    refetchJob()
  }

  if (!job) return <></>

  return (
    <Flex gap={'1rem'}>
      <TableContainer flex={2}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Title</Th>
              <Th>Testimonial</Th>
              <Th>Photo Preview</Th>
              <Th>Photo URL</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {job.testimonials.map((testimonial, index) => {
              return (
                <Tr key={index}>
                  <Td>{testimonial.name}</Td>
                  <Td>{testimonial.title}</Td>
                  <Td whiteSpace={'normal'}>{testimonial.testimonial}</Td>
                  <Td>
                    <Image src={testimonial.photoUrl ?? undefined} alt="Testimonial image" />
                  </Td>
                  <Td whiteSpace={'normal'}>{testimonial.photoUrl}</Td>
                  <Td>
                    <HStack>
                      <Button onClick={() => removeTestimonial(testimonial)} size={'xs'}>
                        <DeleteIcon />
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Stack gap={'1rem'} flex={1}>
        <Input
          placeholder="Name"
          value={testimonialName}
          onChange={(e) => setTestimonialName(e.target.value)}
        />
        <Input
          placeholder="Job Title"
          value={testimonialTitle}
          onChange={(e) => setTestimonialTitle(e.target.value)}
        />
        <Textarea
          placeholder="Testimonial"
          value={testimonial}
          onChange={(e) => setTestimonial(e.target.value)}
        />

        <InputGroup>
          <InputLeftAddon>http://</InputLeftAddon>
          <Input
            placeholder="Photo URL"
            value={testimonialPhotoUrl}
            onChange={(e) => setTestimonialPhotoUrl(e.target.value)}
          />
        </InputGroup>
        <Flex>
          <Button onClick={createTestimonial} colorScheme={'green'}>
            Create
          </Button>
        </Flex>
      </Stack>
    </Flex>
  )
}

export default TestimonialsPage
