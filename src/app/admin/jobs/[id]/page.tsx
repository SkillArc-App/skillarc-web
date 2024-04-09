'use client'

import { industries } from '@/common/static/industries'
import { tags } from '@/common/static/tags'
import { Heading } from '@/frontend/components/Heading.component'
import { useAdminJobData } from '@/frontend/hooks/useAdminJobData'
import { useAllEmployerData } from '@/frontend/hooks/useAllEmployerData'
import { useMasterCertificationData } from '@/frontend/hooks/useMasterCertificationData'
import { useMasterSkillData } from '@/frontend/hooks/useMasterSkillData'
import { destroy, post, put } from '@/frontend/http-common'
import { CareerPath, Testimonial } from '@/frontend/services/jobs.service'
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
  Radio,
  RadioGroup,
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
import { useAuth0 } from 'lib/auth-wrapper'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Job({ params: { id } }: { params: { id: string } }) {
  const {
    getOneJob: { data: job, refetch: refetchJob },
  } = useAdminJobData(id)

  const {
    getEmployers: { data: employers },
  } = useAllEmployerData()

  const {
    masterSkillQuery: { data: masterSkills },
  } = useMasterSkillData()

  const {
    masterCertificationQuery: { data: masterCertifications },
  } = useMasterCertificationData()

  const categoryOptions = [
    {
      value: 'marketplace',
      label: 'Marketplace',
    },
    {
      value: 'staffing',
      label: 'Staffing',
    },
  ]

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

  const [category, setCategory] = useState<string>(job?.category ?? '')
  const [employerId, setEmployerId] = useState(job?.employer.id)
  const [employmentTitle, setEmploymentTitle] = useState(job?.employmentTitle)
  const [location, setLocation] = useState(job?.location)
  const [employmentType, setEmploymentType] = useState(job?.employmentType)
  const [benefitsDescription, setBenefitsDescription] = useState(job?.benefitsDescription)
  const [responsibilitiesDescription, setResponsibilitiesDescription] = useState(
    job?.responsibilitiesDescription,
  )
  const [requirementsDescription, setRequirementsDescription] = useState(
    job?.requirementsDescription,
  )
  const [workDays, setWorkDays] = useState(job?.workDays)
  const [schedule, setSchedule] = useState(job?.schedule)
  const [hideJob, setHideJob] = useState(job?.hideJob)

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

    setCategory(job.category)
    setEmployerId(job.employer.id)
    setEmploymentTitle(job.employmentTitle)
    setLocation(job.location)
    setEmploymentType(job.employmentType)
    setBenefitsDescription(job.benefitsDescription)
    setResponsibilitiesDescription(job.responsibilitiesDescription)
    setRequirementsDescription(job.requirementsDescription)
    setWorkDays(job.workDays)
    setSchedule(job.schedule)
    setHideJob(job.hideJob)
  }, [job])

  const handleHideJobChange = () => {
    setHideJob(!hideJob)
  }

  const onSubmit = async () => {
    if (!token) return

    await put(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/jobs/${id}`,
      {
        category,
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
      token,
    )
    refetchJob()
    onClose()
  }

  const createPath = async () => {
    if (!token) return

    await post(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/career_paths`,
      {
        job_id: id,
        title: careerPathTitle,
        lower_limit: careerPathLowerLimit,
        upper_limit: careerPathUpperLimit,
      },
      token,
    )

    setCareerPathTitle('')
    setCareerPathLowerLimit('')
    setCareerPathUpperLimit('')
    refetchJob()
  }

  const createTestimonial = async () => {
    if (!job) return
    if (!token) return

    await post(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/testimonials`,
      {
        jobId: id,
        name: testimonialName,
        title: testimonialTitle,
        testimonial,
        photoUrl: testimonialPhotoUrl,
      },
      token,
    )

    setTestimonialName('')
    setTestimonialTitle('')
    setTestimonial('')
    setTestimonialPhotoUrl('')
    refetchJob()
  }

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

  const movePathUp = async (path: CareerPath) => {
    if (!token) return

    await put(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/career_paths/${path.id}/up`, {}, token)

    refetchJob()
  }

  const movePathDown = async (path: CareerPath) => {
    if (!token) return

    await put(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/career_paths/${path.id}/down`,
      {},
      token,
    )

    refetchJob()
  }

  const removePath = async (path: CareerPath) => {
    if (!token) return

    await destroy(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/career_paths/${path.id}`, token)

    refetchJob()
  }

  const removeLearnedSkill = (learnedSkillId: string) => async () => {
    if (!job) return
    if (!token) return

    const existingLearnedSkill = job.learnedSkills.find((ds) => {
      return ds.id === learnedSkillId
    })

    if (!existingLearnedSkill) return

    await destroy(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/learned_skills/${learnedSkillId}`,
      token,
    )

    refetchJob()
  }

  const removeDesiredSkill = (desiredSkillId: string) => async () => {
    if (!job) return

    const existingDesiredSkill = job.desiredSkills.find((ds) => {
      return ds.id === desiredSkillId
    })

    if (!existingDesiredSkill) return
    if (!token) return

    await destroy(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/desired_skills/${existingDesiredSkill.id}`,
      token,
    )

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
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/learned_skills`,
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
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/desired_skills`,
      {
        master_skill_id: desiredSkill.id,
      },
      token,
    )

    refetchJob()
  }

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
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/desired_certifications`,
      {
        job_id: id,
        master_certification_id: desiredCertification.id,
      },
      token,
    )

    refetchJob()
  }

  const removeDesiredCertification = async (desiredCertificationId: string) => async () => {
    if (!job) return
    if (!token) return

    const existingDesiredCertification = job?.desiredCertifications.find((dc) => {
      return dc.id === desiredCertificationId
    })

    if (!existingDesiredCertification) return

    await destroy(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/desired_certifications/${existingDesiredCertification.id}`,
      token,
    )

    refetchJob()
  }

  const addTag = async (tag: string) => {
    if (!token) return

    await post(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/job_tags`,
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

    await destroy(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/job_tags/${jobTagId}`, token)

    refetchJob()
  }

  const removeTestimonial = async (testimonial: Testimonial) => {
    if (!job) return
    if (!token) return

    await destroy(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/testimonials/${testimonial.id}`,
      token,
    )

    refetchJob()
  }

  const removePhoto = async (photoId: string) => {
    if (!token) return

    await destroy(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/job_photos/${photoId}`, token)

    refetchJob()
  }

  const addIndustry = async (industry: string) => {
    if (!job) return
    if (job.industry.includes(industry)) return
    if (!token) return

    await put(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/jobs/${id}`,
      {
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
      `${process.env.NEXT_PUBLIC_API_URL}/admin/jobs/${id}`,
      {
        industry: job.industry.filter((i) => i !== industry),
      },
      token,
    )

    refetchJob()
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
              <b>Category</b>: {job.category}
            </Box>
            <Box>
              <b>Employer</b>:{' '}
              <Link href={`/admin/employers/${job.employer.id}`} as={NextLink}>
                {job.employer?.name}
              </Link>
            </Box>
            <Box>
              <b>Employment Title</b>: {job.employmentTitle}
            </Box>
            <Box>
              <b>Location</b>: {job.location}
            </Box>
            <Box>
              <b>Employment Type</b>: {job.employmentType}
            </Box>
            <Box>
              <b>Benefits Description</b>:
              <ReactMarkdown>{job.benefitsDescription ?? ''}</ReactMarkdown>
            </Box>
            <Box>
              <b>Responsibilities Description</b>:
              <ReactMarkdown>{job.responsibilitiesDescription ?? ''}</ReactMarkdown>
            </Box>
            <Box>
              <b>Requirements Description</b>:
              <ReactMarkdown>{job.requirementsDescription ?? ''}</ReactMarkdown>
            </Box>
            <Box>
              <b>Work Days</b>: {job.workDays}
            </Box>
            <Box>
              <b>Schedule</b>: {job.schedule}
            </Box>
            <Box>
              <b>Hidden</b>: {job.hideJob ? 'Yes' : 'No'}
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>New Seeker Invite</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing={3}>
                    <RadioGroup value={category} onChange={(e) => setCategory(e)}>
                      <Stack>
                        {categoryOptions.map((category, index) => {
                          return (
                            <Radio key={index} value={category.value}>
                              {category.label}
                            </Radio>
                          )
                        })}
                      </Stack>
                    </RadioGroup>
                    <Select
                      placeholder="Employer"
                      value={employerId}
                      onChange={(e) => setEmployerId(e.target.value)}
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
                      onChange={(e) => setEmploymentTitle(e.target.value)}
                      placeholder="Employment Title"
                    />
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                    />
                    <Input
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value as 'FULLTIME' | 'PARTTIME')}
                      placeholder="Employment Type"
                    />
                    <Textarea
                      value={benefitsDescription}
                      onChange={(e) => setBenefitsDescription(e.target.value)}
                      placeholder="Benefits Description"
                    />
                    <Textarea
                      value={responsibilitiesDescription ?? ''}
                      onChange={(e) => setResponsibilitiesDescription(e.target.value)}
                      placeholder="Responsibilities Description"
                    />
                    <Textarea
                      value={requirementsDescription ?? ''}
                      onChange={(e) => setRequirementsDescription(e.target.value)}
                      placeholder="Requirements Description"
                    />
                    <Input
                      value={workDays ?? ''}
                      onChange={(e) => setWorkDays(e.target.value)}
                      placeholder="Work Days"
                    />
                    <Input
                      value={schedule ?? ''}
                      onChange={(e) => setSchedule(e.target.value)}
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
        </TabPanel>
        <TabPanel>
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
                    <Th>Photo Preview</Th>
                    <Th>Photo URL</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {job.testimonials.map((testimonial, index) => {
                    return (
                      <Tr key={index}>
                        <Td>{testimonial.name}</Td>
                        <Td>{testimonial.title}</Td>
                        <Td whiteSpace={'normal'}>{testimonial.testimonial}</Td>
                        <Td>
                          <Image src={testimonial.photoUrl ?? undefined} alt="Testimonial image" />
                        </Td>
                        <Td whiteSpace={'normal'}>{testimonial.photoUrl}</Td>
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
                placeholder="Job Title"
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
              <Input
                placeholder="URL"
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
        </TabPanel>
        <TabPanel>
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
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
