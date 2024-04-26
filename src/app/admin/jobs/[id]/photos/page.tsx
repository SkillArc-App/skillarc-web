'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { destroy, post } from '@/frontend/http-common'
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
import { useState } from 'react'

const PhotosPage = () => {
  const { id } = useFixedParams('id')

  const { data: job, refetch: refetchJob } = useAdminJob(id)

  const token = useAuthToken()

  const [photoUrl, setPhotoUrl] = useState('')

  const createPhoto = async () => {
    if (!token) return

    await post(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/job_photos`,
      {
        photoUrl,
      },
      token,
    )
    await setPhotoUrl('')
    await refetchJob()
  }

  const removePhoto = async (photoId: string) => {
    if (!token) return

    await destroy(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/job_photos/${photoId}`, token)

    refetchJob()
  }

  if (!job) return <></>

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

export default PhotosPage
