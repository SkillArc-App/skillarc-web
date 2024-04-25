import { MasterCertification } from '@/frontend/services/certification.service'
import { AdminJob } from '@/frontend/services/jobs.service'
import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Select, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'

const AttachedCertifications = ({
  job,
  addDesiredCertification,
  removeDesiredCertification,
  masterCertifications,
}: {
  job: AdminJob
  addDesiredCertification: (val: string) => void
  removeDesiredCertification: (val: string) => void
  masterCertifications: MasterCertification[]
}) => {
  return (
    <TableContainer>
      <Box px={'1rem'}>
        <label>
          Add A Desired Certification
          <Select onChange={(e) => addDesiredCertification(e.target.value)} size={'sm'}>
            <option></option>
            {masterCertifications?.map((mc) => {
              return <option key={mc.id}>{mc.certification}</option>
            })}
          </Select>
        </label>
      </Box>
      <Table variant="simple">
        <Tbody>
          {job.desiredCertifications.map((dc, index: number) => {
            return (
              <Tr key={index}>
                <Td>{dc.masterCertification.certification}</Td>
                <Td>
                  <Button size={'xs'}>
                    <DeleteIcon onClick={() => removeDesiredCertification(dc.id)} />
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

export default AttachedCertifications
