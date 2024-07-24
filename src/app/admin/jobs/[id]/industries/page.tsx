'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { industries } from '@/common/static/industries'
import { IdParams } from '@/common/types/PageParams'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { put } from '@/frontend/http-common'
import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Select, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'

const Industries = ({ params: { id } }: IdParams) => {
  const { data: job, refetch: refetchJob } = useAdminJob(id)

  const token = useAuthToken()

  const addIndustry = async (industry: string) => {
    if (!job) return
    if (job.industry.includes(industry)) return
    if (!token) return

    await put(
      `/admin/jobs/${id}`,
      {
        ...job,
        industry: [...job.industry, industry],
      },
      token,
    )

    refetchJob()
  }

  const removeIndustry = async (industry: string) => {
    if (!job) return
    if (!token) return

    await put(
      `/admin/jobs/${id}`,
      {
        ...job,
        industry: job.industry.filter((i) => i !== industry),
      },
      token,
    )

    refetchJob()
  }

  if (!job) return <></>

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
