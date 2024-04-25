import { industries } from '@/common/static/industries'
import { AdminJob } from '@/frontend/services/jobs.service'
import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Select, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'

const Industries = ({
  job,
  addIndustry,
  removeIndustry,
}: {
  job: AdminJob
  addIndustry: (val: string) => void
  removeIndustry: (val: string) => void
}) => {
  return (
    <TableContainer>
      <Box px={'1rem'}>
        <label>
          Add New Industries
          <Select onChange={(e) => addIndustry(e.target.value)} size={'sm'}>
            <option></option>
            {industries.map((i) => {
              return <option key={i}>{i}</option>
            })}
          </Select>
        </label>
      </Box>
      <Table variant="simple">
        <Tbody>
          {job.industry.map((industry, index) => {
            return (
              <Tr key={index}>
                <Td>{industry}</Td>
                <Td>
                  <Button size={'xs'}>
                    <DeleteIcon onClick={() => removeIndustry(industry)} />
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

export default Industries
