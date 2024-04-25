import { AdminJob } from '@/frontend/services/jobs.service'
import { DeleteIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react'
import { Heading } from '../../Heading.component'

const AttachedSkills = ({
  job,
  masterSkills,
  addDesiredSkill,
  addLearnedSkill,
  removeDesiredSkill,
  removeLearnedSkill,
}: {
  job: AdminJob
  masterSkills: any[]
  addDesiredSkill: (skill: string) => void
  addLearnedSkill: (skill: string) => void
  removeDesiredSkill: (skill: string) => void
  removeLearnedSkill: (skill: string) => void
}) => {
  return (
    <Flex gap={'1rem'}>
      <Stack spacing={'1rem'}>
        <Heading type="h5">Desired Skills</Heading>
        <TableContainer>
          <Box px={'1rem'}>
            <label>
              Add New Desired Skills
              <Select onChange={(e) => addDesiredSkill(e.target.value)} size={'sm'}>
                <option></option>
                {masterSkills?.map((ms: { id: string; skill: string }) => {
                  return <option key={ms.id}>{ms.skill}</option>
                })}
              </Select>
            </label>
          </Box>
          <Table variant="simple">
            <Tbody>
              {job.desiredSkills.map((ds, index) => {
                return (
                  <Tr key={index}>
                    <Td>{ds.masterSkill.skill}</Td>
                    <Td>
                      <Button size={'xs'}>
                        <DeleteIcon onClick={() => removeDesiredSkill(ds.id)} />
                      </Button>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
      <Stack spacing={'1rem'}>
        <Heading type="h5">Learned Skills</Heading>
        <TableContainer>
          <Box px={'1rem'}>
            <label>
              Add New Learned Skills
              <Select onChange={(e) => addLearnedSkill(e.target.value)} size={'sm'}>
                <option></option>
                {masterSkills?.map((ms: { id: string; skill: string }) => {
                  return <option key={ms.id}>{ms.skill}</option>
                })}
              </Select>
            </label>
          </Box>
          <Table variant="simple">
            <Tbody>
              {job.learnedSkills.map((ls, index) => {
                return (
                  <Tr key={index}>
                    <Td>{ls.masterSkill.skill}</Td>
                    <Td>
                      <Button size={'xs'}>
                        <DeleteIcon onClick={() => removeLearnedSkill(ls.id)} />
                      </Button>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Flex>
  )
}

export default AttachedSkills
