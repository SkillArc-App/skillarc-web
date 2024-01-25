'use client'

import { industries } from '@/common/static/industries'
import { CareerPath } from '@/common/types/Job'
import { Heading } from '@/frontend/components/Heading.component'
import { useAllEmployerData } from '@/frontend/hooks/useAllEmployerData'
import { useJobData } from '@/frontend/hooks/useJobData'
import { useMasterCertificationData } from '@/frontend/hooks/useMasterCertificationData'
import { useMasterSkillData } from '@/frontend/hooks/useMasterSkillData'
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import axios from 'axios'
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'

export default function Job({ params: { id } }: { params: { id: string } }) {
  const {
    getOneJob: { data: job, refetch: refetchJob },
  } = useJobData(id)

  const {
    getEmployers: { data: employers },
  } = useAllEmployerData()

  const {
    masterSkillQuery: { data: masterSkills },
  } = useMasterSkillData()

  const {
    masterCertificationQuery: { data: masterCertifications },
  } = useMasterCertificationData()

  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const { isOpen, onOpen, onClose } = useDisclosure({})

  const [employerId, setEmployerId] = useState(job?.employer.id)
  const [employmentTitle, setEmploymentTitle] = useState(job?.employment_title)
  const [location, setLocation] = useState(job?.location)
  const [employmentType, setEmploymentType] = useState(job?.employment_type)
  const [benefitsDescription, setBenefitsDescription] = useState(job?.benefits_description)
  const [responsibilitiesDescription, setResponsibilitiesDescription] = useState(
    job?.responsibilities_description,
  )
  const [requirementsDescription, setRequirementsDescription] = useState(
    job?.requirements_description,
  )
  const [workDays, setWorkDays] = useState(job?.work_days)
  const [schedule, setSchedule] = useState(job?.schedule)
  const [hideJob, setHideJob] = useState(job?.hide_job)

  const [careerPathTitle, setCareerPathTitle] = useState('')
  const [careerPathLowerLimit, setCareerPathLowerLimit] = useState('')
  const [careerPathUpperLimit, setCareerPathUpperLimit] = useState('')

  const [testimonialName, setTestimonialName] = useState('')
  const [testimonialTitle, setTestimonialTitle] = useState('')
  const [testimonial, setTestimonial] = useState('')
  const [testimonialPhotoUrl, setTestimonialPhotoUrl] = useState('')

  const [photoUrl, setPhotoUrl] = useState('')

  useEffect(() => {
    if (!job) return

    setEmployerId(job.employer.id)
    setEmploymentTitle(job.employment_title)
    setLocation(job.location)
    setEmploymentType(job.employment_type)
    setBenefitsDescription(job.benefits_description)
    setResponsibilitiesDescription(job.responsibilities_description)
    setRequirementsDescription(job.requirements_description)
    setWorkDays(job.work_days)
    setSchedule(job.schedule)
    setHideJob(job.hide_job)
  }, [job])

  const handleEmployerIdChange = (e: any) => {
    setEmployerId(e.target.value)
  }

  const handleEmploymentTitleChange = (e: any) => {
    setEmploymentTitle(e.target.value)
  }

  const handleLocationChange = (e: any) => {
    setLocation(e.target.value)
  }

  const handleEmploymentTypeChange = (e: any) => {
    setEmploymentType(e.target.value)
  }

  const handleBenefitsDescriptionChange = (e: any) => {
    setBenefitsDescription(e.target.value)
  }

  const handleResponsibilitiesDescriptionChange = (e: any) => {
    setResponsibilitiesDescription(e.target.value)
  }

  const handleRequirementsDescriptionChange = (e: any) => {
    setRequirementsDescription(e.target.value)
  }

  const handleWorkDaysChange = (e: any) => {
    setWorkDays(e.target.value)
  }

  const handleScheduleChange = (e: any) => {
    setSchedule(e.target.value)
  }

  const handleHideJobChange = () => {
    setHideJob(!hideJob)
  }

  const onSubmit = () => {
    console.log('token', token)
    axios
      .create({ withCredentials: false })
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`,
        {
          employer_id: employerId,
          employment_title: employmentTitle,
          location,
          employment_type: employmentType,
          benefits_description: benefitsDescription,
          responsibilities_description: responsibilitiesDescription,
          requirements_description: requirementsDescription,
          work_days: workDays,
          schedule,
          hide_job: hideJob,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        refetchJob()
        onClose()
      })
  }

  const createPath = () => {
    axios
      .create({ withCredentials: false })
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/career_paths`,
        {
          job_id: id,
          title: careerPathTitle,
          lower_limit: careerPathLowerLimit,
          upper_limit: careerPathUpperLimit,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setCareerPathTitle('')
        setCareerPathLowerLimit('')
        setCareerPathUpperLimit('')
        refetchJob()
      })
  }

  const createTestimonial = () => {
    if (!job) return

    axios
      .create({ withCredentials: false })
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/testimonials`,
        {
          jobId: id,
          name: testimonialName,
          title: testimonialTitle,
          testimonial,
          photoUrl: testimonialPhotoUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setTestimonialName('')
        setTestimonialTitle('')
        setTestimonial('')
        setTestimonialPhotoUrl('')
        refetchJob()
      })
  }

  const createPhoto = () => {
    axios
      .create({ withCredentials: false })
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/job_photos`,
        {
          photo_url: photoUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setPhotoUrl('')
        refetchJob()
      })
  }

  const movePathUp = (path: CareerPath) => {
    axios
      .create({ withCredentials: false })
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/career_paths/${path.id}/up`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        refetchJob()
      })
  }

  const movePathDown = (path: CareerPath) => {
    axios
      .create({ withCredentials: false })
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/career_paths/${path.id}/down`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        refetchJob()
      })
  }

  const removePath = (path: CareerPath) => {
    axios
      .create({ withCredentials: false })
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/career_paths/${path.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        refetchJob()
      })
  }

  const removeLearnedSkill = (learnedSkillId: string) => () => {
    if (!job) return

    const existingLearnedSkill = job.learnedSkills.find((ds: any) => {
      return ds.id === learnedSkillId
    })

    if (!existingLearnedSkill) return

    axios
      .create({ withCredentials: false })
      .delete(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/learned_skills/${learnedSkillId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        refetchJob()
      })
  }

  const removeDesiredSkill = (desiredSkillId: string) => () => {
    if (!job) return

    const existingDesiredSkill = job.desiredSkills.find((ds: any) => {
      return ds.id === desiredSkillId
    })

    if (!existingDesiredSkill) return
    if (!token) return

    axios
      .create({ withCredentials: false })
      .delete(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/desired_skills/${existingDesiredSkill.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        refetchJob()
      })
  }

  const addLearnedSkill = (learnedSkillName: string) => {
    if (!masterSkills) return

    const learnedSkill = masterSkills.find((ms: { skill: string }) => ms.skill === learnedSkillName)
    if (!learnedSkill) return
    if (!job) return

    const existingLearnedSkill = job?.learnedSkills
      .map((ds: any) => ds.masterSkill)
      .some((ms: any) => ms.id === learnedSkill.id)

    if (existingLearnedSkill) return

    axios
      .create({ withCredentials: false })
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/learned_skills`,
        {
          master_skill_id: learnedSkill.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        refetchJob()
      })
  }

  const addDesiredSkill = (desiredSkillName: string) => {
    if (!masterSkills) return
    if (!job) return

    const desiredSkill = masterSkills.find((ms: { skill: string }) => ms.skill === desiredSkillName)
    if (!desiredSkill) return

    axios
      .create({ withCredentials: false })
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/desired_skills`,
        {
          master_skill_id: desiredSkill.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        refetchJob()
      })
  }

  const addDesiredCertification = (desiredCertificationName: string) => {
    if (!masterCertifications) return
    if (!job) return

    const desiredCertification = masterCertifications.find(
      (mc) => mc.certification === desiredCertificationName,
    )
    if (!desiredCertification) return

    const existingDesiredCertification = job?.desiredCertifications
      .map((dc: any) => dc.masterCertification)
      .some((mc: any) => mc.id === desiredCertification.id)

    if (existingDesiredCertification) return

    axios
      .create({ withCredentials: false })
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/desired_certifications`,
        {
          job_id: id,
          master_certification_id: desiredCertification.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        refetchJob()
      })
  }

  const removeDesiredCertification = (desiredCertificationId: string) => () => {
    if (!job) return

    const existingDesiredCertification = job?.desiredCertifications.find((dc: any) => {
      return dc.id === desiredCertificationId
    })

    if (!existingDesiredCertification) return

    axios
      .create({ withCredentials: false })
      .delete(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/desired_certifications/${existingDesiredCertification.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        refetchJob()
      })
  }

  const addTag = (tag: string) => {
    axios
      .create({ withCredentials: false })
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/job_tags`,
        {
          job_id: id,
          tag,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        refetchJob()
      })
  }

  const removeTag = (jobTagId: string) => {
    axios
      .create({ withCredentials: false })
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/job_tags/${jobTagId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        refetchJob()
      })
  }

  const removeTestimonial = (testimonial: any) => {
    if (!job) return

    axios
      .create({ withCredentials: false })
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/testimonials/${testimonial.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        refetchJob()
      })
  }

  const removePhoto = (photoId: string) => {
    axios
      .create({ withCredentials: false })
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/job_photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        refetchJob()
      })
  }

  const addIndustry = (industry: string) => {
    if (!job) return
    if (job.industry.includes(industry)) return

    axios
      .create({ withCredentials: false })
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`,
        {
          industry: [...job.industry, industry],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        refetchJob()
      })
  }

  const removeIndustry = (industry: string) => {
    if (!job) return

    console.log('industry', industry)
    axios
      .create({ withCredentials: false })
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`,
        {
          industry: job.industry.filter((i: any) => i !== industry),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        refetchJob()
      })
  }

  if (!job) return <div>loading...</div>

  return (
    <Tabs my={'1rem'} variant={'enclosed'}>
      <TabList>
        <Tab>The Basics</Tab>
        <Tab>Industries</Tab>
        <Tab>Attached Skills</Tab>
        <Tab>Attached Certifications</Tab>
        <Tab>Testimonials</Tab>
        <Tab>Photos</Tab>
        <Tab>Career Path</Tab>
        <Tab>Tags</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Stack m={'1rem'} spacing={'1rem'}>
            <Flex>
              <Button onClick={onOpen} leftIcon={<EditIcon />} size="sm">
                edit
              </Button>
            </Flex>
            <Box>
              <b>Employer</b>:{' '}
              <Link href={`/admin/employers/${job.employer.id}`} as={NextLink}>
                {job.employer?.name}
              </Link>
            </Box>
            <Box>
              <b>Employment Title</b>: {job.employment_title}
            </Box>
            <Box>
              <b>Location</b>: {job.location}
            </Box>
            <Box>
              <b>Employment Type</b>: {job.employment_type}
            </Box>
            <Box>
              <b>Benefits Description</b>: {job.benefits_description}
            </Box>
            <Box>
              <b>Responsibilities Description</b>: {job.responsibilities_description}
            </Box>
            <Box>
              <b>Requirements Description</b>: {job.requirements_description}
            </Box>
            <Box>
              <b>Work Days</b>: {job.work_days}
            </Box>
            <Box>
              <b>Schedule</b>: {job.schedule}
            </Box>
            <Box>
              <b>Hidden</b>: {job.hide_job ? 'Yes' : 'No'}
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>New Seeker Invite</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing={3}>
                    <Select
                      placeholder="Employer"
                      value={employerId}
                      onChange={handleEmployerIdChange}
                    >
                      {employers?.map((employer: { id: string; name: string }, index: number) => {
                        return (
                          <option value={employer.id} key={employer.id}>
                            {employer.name}
                          </option>
                        )
                      })}
                    </Select>
                    <Input
                      value={employmentTitle}
                      onChange={handleEmploymentTitleChange}
                      placeholder="Employment Title"
                    />
                    <Input
                      value={location}
                      onChange={handleLocationChange}
                      placeholder="Location"
                    />
                    <Input
                      value={employmentType}
                      onChange={handleEmploymentTypeChange}
                      placeholder="Employment Type"
                    />
                    <Textarea
                      value={benefitsDescription}
                      onChange={handleBenefitsDescriptionChange}
                      placeholder="Benefits Description"
                    />
                    <Textarea
                      value={responsibilitiesDescription ?? ''}
                      onChange={handleResponsibilitiesDescriptionChange}
                      placeholder="Responsibilities Description"
                    />
                    <Textarea
                      value={requirementsDescription ?? ''}
                      onChange={handleRequirementsDescriptionChange}
                      placeholder="Requirements Description"
                    />
                    <Input
                      value={workDays ?? ''}
                      onChange={handleWorkDaysChange}
                      placeholder="Work Days"
                    />
                    <Input
                      value={schedule ?? ''}
                      onChange={handleScheduleChange}
                      placeholder="Schedule"
                    />
                    <span>
                      Hide Job: <Switch isChecked={hideJob} onChange={handleHideJobChange} />
                    </span>
                  </Stack>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="green" mr={3} onClick={onSubmit}>
                    Save
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>{' '}
          </Stack>
        </TabPanel>
        <TabPanel>
          <TableContainer>
            <Box px={'1rem'}>
              <Select onChange={(e) => addIndustry(e.target.value)} size={'sm'}>
                <option></option>
                {industries.map((i) => {
                  return <option key={i}>{i}</option>
                })}
              </Select>
            </Box>
            <Table variant="simple">
              <Tbody>
                {job.industry.map((industry: any, index: number) => {
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
        </TabPanel>
        <TabPanel>
          <Flex gap={'1rem'}>
            <Stack spacing={'1rem'}>
              <Heading type="h5">Desired Skills</Heading>
              <TableContainer>
                <Box px={'1rem'}>
                  <Select onChange={(e) => addDesiredSkill(e.target.value)} size={'sm'}>
                    <option></option>
                    {masterSkills?.map((ms: { id: string; skill: string }) => {
                      return <option key={ms.id}>{ms.skill}</option>
                    })}
                  </Select>
                </Box>
                <Table variant="simple">
                  <Tbody>
                    {job.desiredSkills.map((ds: any, index: number) => {
                      return (
                        <Tr key={index}>
                          <Td>{ds.masterSkill.skill}</Td>
                          <Td>
                            <Button size={'xs'}>
                              <DeleteIcon onClick={removeDesiredSkill(ds.id)} />
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
                  <Select onChange={(e) => addLearnedSkill(e.target.value)} size={'sm'}>
                    <option></option>
                    {masterSkills?.map((ms: { id: string; skill: string }) => {
                      return <option key={ms.id}>{ms.skill}</option>
                    })}
                  </Select>
                </Box>
                <Table variant="simple">
                  <Tbody>
                    {job.learnedSkills.map((ls: any, index: number) => {
                      return (
                        <Tr key={index}>
                          <Td>{ls.masterSkill.skill}</Td>
                          <Td>
                            <Button size={'xs'}>
                              <DeleteIcon onClick={removeLearnedSkill(ls.id)} />
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
        </TabPanel>
        <TabPanel>
          <TableContainer>
            <Box px={'1rem'}>
              <Select onChange={(e) => addDesiredCertification(e.target.value)} size={'sm'}>
                <option></option>
                {masterCertifications?.map((mc) => {
                  return <option key={mc.id}>{mc.certification}</option>
                })}
              </Select>
            </Box>
            <Table variant="simple">
              <Tbody>
                {job.desiredCertifications.map((dc: any, index: number) => {
                  return (
                    <Tr key={index}>
                      <Td>{dc.masterCertification.certification}</Td>
                      <Td>
                        <Button size={'xs'}>
                          <DeleteIcon onClick={removeDesiredCertification(dc.id)} />
                        </Button>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel>
          <Flex gap={'1rem'}>
            <TableContainer flex={2}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Title</Th>
                    <Th>Testimonial</Th>
                    <Th>Photo URL </Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {job.testimonials.map((testimonial: any, index: number) => {
                    return (
                      <Tr key={index}>
                        <Td>{testimonial.name}</Td>
                        <Td>{testimonial.title}</Td>
                        <Td whiteSpace={'normal'}>{testimonial.testimonial}</Td>
                        <Td whiteSpace={'normal'}>{testimonial.photo_url}</Td>
                        <Td>
                          <HStack>
                            <Button onClick={() => removeTestimonial(testimonial)} size={'xs'}>
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
            <Stack gap={'1rem'} flex={1}>
              <Input
                placeholder="Name"
                value={testimonialName}
                onChange={(e) => setTestimonialName(e.target.value)}
              />
              <Input
                placeholder="Title"
                value={testimonialTitle}
                onChange={(e) => setTestimonialTitle(e.target.value)}
              />
              <Textarea
                placeholder="Testimonial"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
              />

              <InputGroup>
                <InputLeftAddon>http://</InputLeftAddon>
                <Input
                  placeholder="Photo URL"
                  value={testimonialPhotoUrl}
                  onChange={(e) => setTestimonialPhotoUrl(e.target.value)}
                />
              </InputGroup>
              <Flex>
                <Button onClick={createTestimonial} colorScheme={'green'}>
                  Create
                </Button>
              </Flex>
            </Stack>
          </Flex>
        </TabPanel>
        <TabPanel>
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
                  {job.jobPhotos.map((jp: any, index: number) => {
                    return (
                      <Tr key={index}>
                        <Td>
                          <Image src={jp.photo_url} alt="Job image" />
                        </Td>
                        <Td whiteSpace={'normal'}>{jp.photo_url}</Td>
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
              <Input
                placeholder="Title"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
              <Flex>
                <Button onClick={createPhoto} colorScheme={'green'}>
                  Create
                </Button>
              </Flex>
            </Stack>
          </Flex>
        </TabPanel>
        <TabPanel>
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
                    ?.sort((a: any, b: any) => a.order - b.order)
                    .map((cp: any, index: number) => {
                      return (
                        <Tr key={index}>
                          <Td>{cp.order}</Td>
                          <Td>{cp.title}</Td>
                          <Td>{cp.lower_limit}</Td>
                          <Td>{cp.upper_limit}</Td>
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
        </TabPanel>
        <TabPanel>
          <TableContainer>
            <Box px={'1rem'}>
              <Select onChange={(e) => addTag(e.target.value)} size={'sm'}>
                <option></option>
                {[
                  'No experience needed',
                  'Part time only',
                  'Transportation assistance',
                  'ESL-Friendly',
                  'Fair chance employer',
                ].map((tag) => {
                  return <option key={tag}>{tag}</option>
                })}
              </Select>
            </Box>
            <Table variant="simple">
              <Tbody>
                {job.jobTag.map((tag: any, index: number) => {
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
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
