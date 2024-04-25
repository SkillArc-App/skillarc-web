import { AdminJob } from '@/frontend/services/jobs.service'
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

const CareerPaths = ({
  job,
  careerPathTitle,
  setCareerPathTitle,
  careerPathLowerLimit,
  setCareerPathLowerLimit,
  careerPathUpperLimit,
  setCareerPathUpperLimit,
  createPath,
  removePath,
  movePathUp,
  movePathDown,
}: {
  job: AdminJob
  careerPathTitle: string
  setCareerPathTitle: (val: string) => void
  careerPathLowerLimit: string
  setCareerPathLowerLimit: (val: string) => void
  careerPathUpperLimit: string
  setCareerPathUpperLimit: (val: string) => void
  createPath: () => void
  removePath: (val: any) => void
  movePathUp: (val: any) => void
  movePathDown: (val: any) => void
}) => {
  return (
    <Flex gap={'1rem'}>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Order</Th>
              <Th>Title</Th>
              <Th>Lower limit</Th>
              <Th>Upper limit</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {job.careerPaths
              .sort((a, b) => a.order - b.order)
              .map((cp, index: number) => {
                return (
                  <Tr key={index}>
                    <Td>{cp.order}</Td>
                    <Td>{cp.title}</Td>
                    <Td>{cp.lowerLimit}</Td>
                    <Td>{cp.upperLimit}</Td>
                    <Td>
                      <HStack>
                        <Button onClick={() => movePathUp(cp)} size={'xs'}>
                          <ArrowUpIcon />
                        </Button>
                        <Button onClick={() => movePathDown(cp)} size={'xs'}>
                          <ArrowDownIcon />
                        </Button>
                        <Button onClick={() => removePath(cp)} size={'xs'}>
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
      <Stack gap={'1rem'}>
        <Input
          placeholder="Title"
          value={careerPathTitle}
          onChange={(e) => setCareerPathTitle(e.target.value)}
        />
        <InputGroup>
          <InputLeftAddon>$</InputLeftAddon>
          <Input
            placeholder="Lower limit"
            value={careerPathLowerLimit}
            onChange={(e) => setCareerPathLowerLimit(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <InputLeftAddon>$</InputLeftAddon>
          <Input
            placeholder="Upper limit"
            value={careerPathUpperLimit}
            onChange={(e) => setCareerPathUpperLimit(e.target.value)}
          />
        </InputGroup>
        <Flex>
          <Button onClick={createPath} colorScheme={'green'}>
            Create
          </Button>
        </Flex>
      </Stack>
    </Flex>
  )
}

export default CareerPaths
