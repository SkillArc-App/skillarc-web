'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { useMasterSkillData } from '@/app/admin/hooks/useMasterSkillData'
import { IdParams } from '@/app/common/types/PageParams'
import { Heading } from '@/app/components/Heading'
import { useAuthToken } from '@/app/hooks/useAuthToken'
import { destroy, post } from '@/app/http-common'
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

const AttachedSkillsPage = ({ params: { id } }: IdParams) => {
  const { data: job, refetch: refetchJob } = useAdminJob(id)

  const token = useAuthToken()

  const {
    masterSkillQuery: { data: masterSkills },
  } = useMasterSkillData()

  const removeLearnedSkill = async (learnedSkillId: string) => {
    if (!job) return
    if (!token) return

    const existingLearnedSkill = job.learnedSkills.find((ds) => {
      return ds.id === learnedSkillId
    })

    if (!existingLearnedSkill) return

    await destroy(`/jobs/${job.id}/learned_skills/${learnedSkillId}`, token)

    refetchJob()
  }

  const removeDesiredSkill = async (desiredSkillId: string) => {
    if (!job) return

    const existingDesiredSkill = job.desiredSkills.find((ds) => {
      return ds.id === desiredSkillId
    })

    if (!existingDesiredSkill) return
    if (!token) return

    await destroy(`/jobs/${job.id}/desired_skills/${existingDesiredSkill.id}`, token)

    refetchJob()
  }

  const addLearnedSkill = async (learnedSkillName: string) => {
    if (!masterSkills) return
    if (!token) return

    const learnedSkill = masterSkills.find((ms: { skill: string }) => ms.skill === learnedSkillName)
    if (!learnedSkill) return
    if (!job) return

    const existingLearnedSkill = job?.learnedSkills
      .map((ds) => ds.masterSkill)
      .some((ms) => ms.id === learnedSkill.id)

    if (existingLearnedSkill) return

    await post(
      `/jobs/${job.id}/learned_skills`,
      {
        master_skill_id: learnedSkill.id,
      },
      token,
    )

    refetchJob()
  }

  const addDesiredSkill = async (desiredSkillName: string) => {
    if (!masterSkills) return
    if (!job) return

    const desiredSkill = masterSkills.find((ms: { skill: string }) => ms.skill === desiredSkillName)
    if (!desiredSkill) return
    if (!token) return

    await post(
      `/jobs/${job.id}/desired_skills`,
      {
        master_skill_id: desiredSkill.id,
      },
      token,
    )

    refetchJob()
  }

  if (!job) return <></>

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

export default AttachedSkillsPage
