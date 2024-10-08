'use client'

import { useAdminJob } from '@/admin/hooks/useAdminJob'
import { tags } from '@/common/static/tags'
import { IdParams } from '@/common/types/PageParams'
import { useAuthToken } from '@/hooks/useAuthToken'
import { destroy, post } from '@/http-common'
import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Select, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'

const TagsPage = ({ params: { id } }: IdParams) => {
  const { data: job, refetch: refetchJob } = useAdminJob(id)
  const token = useAuthToken()

  const addTag = async (tag: string) => {
    if (!token) return

    await post(
      `/jobs/${id}/job_tags`,
      {
        job_id: id,
        tag,
      },
      token,
    )

    refetchJob()
  }

  const removeTag = async (jobTagId: string) => {
    if (!token) return

    await destroy(`/jobs/${id}/job_tags/${jobTagId}`, token)

    refetchJob()
  }

  if (!job) return <></>

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

export default TagsPage
