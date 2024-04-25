import { AdminJob } from '@/frontend/services/jobs.service'
import { DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  Image,
  Input,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'

const Photos = ({
  job,
  photoUrl,
  setPhotoUrl,
  createPhoto,
  removePhoto,
}: {
  job: AdminJob
  photoUrl: string
  setPhotoUrl: (val: string) => void
  createPhoto: () => void
  removePhoto: (val: string) => void
}) => {
  return (
    <Flex gap={'1rem'}>
      <TableContainer flex={2}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Preview</Th>
              <Th>Photo URL</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {job.jobPhotos.map((jp, index: number) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Image src={jp.photoUrl} alt="Job image" />
                  </Td>
                  <Td whiteSpace={'normal'}>{jp.photoUrl}</Td>
                  <Td>
                    <Button onClick={() => removePhoto(jp.id)} size={'xs'}>
                      <DeleteIcon />
                    </Button>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Stack gap={'1rem'} flex={1}>
        <Input placeholder="URL" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
        <Flex>
          <Button onClick={createPhoto} colorScheme={'green'}>
            Create
          </Button>
        </Flex>
      </Stack>
    </Flex>
  )
}

export default Photos
