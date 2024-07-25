'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { useMasterCertificationData } from '@/app/admin/hooks/useMasterCertificationData'
import { IdParams } from '@/app/common/types/PageParams'
import { useAuthToken } from '@/app/hooks/useAuthToken'
import { destroy, post } from '@/app/http-common'
import { DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Select, Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react'

const AttachedCertificationsPage = ({ params: { id } }: IdParams) => {
  const { data: job, refetch } = useAdminJob(id)
  const {
    masterCertificationQuery: { data: masterCertifications },
  } = useMasterCertificationData()

  const token = useAuthToken()

  const addDesiredCertification = async (desiredCertificationName: string) => {
    if (!masterCertifications) return
    if (!job) return
    if (!token) return

    const desiredCertification = masterCertifications.find(
      (mc) => mc.certification === desiredCertificationName,
    )
    if (!desiredCertification) return

    const existingDesiredCertification = job?.desiredCertifications
      .map((dc) => dc.masterCertification)
      .some((mc) => mc.id === desiredCertification.id)

    if (existingDesiredCertification) return

    await post(
      `/jobs/${job.id}/desired_certifications`,
      {
        job_id: id,
        master_certification_id: desiredCertification.id,
      },
      token,
    )

    refetch()
  }

  const removeDesiredCertification = async (desiredCertificationId: string) => {
    if (!job) return
    if (!token) return

    const existingDesiredCertification = job?.desiredCertifications.find((dc) => {
      return dc.id === desiredCertificationId
    })

    if (!existingDesiredCertification) return

    await destroy(
      `/jobs/${job.id}/desired_certifications/${existingDesiredCertification.id}`,
      token,
    )

    refetch()
  }

  if (!job) return <></>

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

export default AttachedCertificationsPage
