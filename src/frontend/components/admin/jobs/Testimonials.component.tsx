import { AdminJob, Testimonial } from '@/frontend/services/jobs.service'
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

const Testimonials = ({
  job,
  testimonialName,
  setTestimonialName,
  testimonialTitle,
  setTestimonialTitle,
  testimonial,
  setTestimonial,
  testimonialPhotoUrl,
  setTestimonialPhotoUrl,
  createTestimonial,
  removeTestimonial,
}: {
  job: AdminJob
  testimonialName: string
  setTestimonialName: (val: string) => void
  testimonialTitle: string
  setTestimonialTitle: (val: string) => void
  testimonial: string
  setTestimonial: (val: string) => void
  testimonialPhotoUrl: string
  setTestimonialPhotoUrl: (val: string) => void
  createTestimonial: () => void
  removeTestimonial: (val: Testimonial) => void
}) => {
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

export default Testimonials
