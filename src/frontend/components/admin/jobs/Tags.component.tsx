import { AdminJob } from '@/frontend/services/jobs.service'
import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Select, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'

const Tags = ({
  job,
  tags,
  addTag,
  removeTag,
}: {
  job: AdminJob
  tags: string[]
  addTag: (val: string) => void
  removeTag: (val: string) => void
}) => {
  return (
    <TableContainer>
      <Box px={'1rem'}>
        <label>
          Add A New Tag
          <Select onChange={(e) => addTag(e.target.value)} size={'sm'}>
            <option></option>
            {tags.map((tag) => {
              return <option key={tag}>{tag}</option>
            })}
          </Select>
        </label>
      </Box>
      <Table variant="simple">
        <Tbody>
          {job.jobTag.map((tag, index) => {
            return (
              <Tr key={index}>
                <Td>{tag.tag.name}</Td>
                <Td>
                  <Button size={'xs'}>
                    <DeleteIcon onClick={() => removeTag(tag.id)} />
                  </Button>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default Tags
