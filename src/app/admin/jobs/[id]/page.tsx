'use client'

import { useAdminJob } from '@/app/admin/hooks/useAdminJob'
import { useAllEmployers } from '@/app/admin/hooks/useAllEmployerData'
import { tags } from '@/common/static/tags'
import AttachedCertifications from '@/frontend/components/admin/jobs/AttachedCertifications.component'
import AttachedSkills from '@/frontend/components/admin/jobs/AttachedSkills.component'
import CareerPaths from '@/frontend/components/admin/jobs/CareerPaths.component'
import Industries from '@/frontend/components/admin/jobs/Industries.component'
import Photos from '@/frontend/components/admin/jobs/Photos.component'
import Tags from '@/frontend/components/admin/jobs/Tags.component'
import Testimonials from '@/frontend/components/admin/jobs/Testimonials.component'
import TheBasics from '@/frontend/components/admin/jobs/TheBasics.component'
import { useMasterCertificationData } from '@/frontend/hooks/useMasterCertificationData'
import { useMasterSkillData } from '@/frontend/hooks/useMasterSkillData'
import { destroy, post, put } from '@/frontend/http-common'
import { CareerPath, Testimonial } from '@/frontend/services/jobs.service'
import { Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react'
import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'

export default function Job({ params: { id } }: { params: { id: string } }) {
  const { data: job, refetch: refetchJob } = useAdminJob(id)
  const { data: employers } = useAllEmployers()

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

  const removeLearnedSkill = async (learnedSkillId: string) => {
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

  const removeDesiredSkill = async (desiredSkillId: string) => {
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

  const removeDesiredCertification = async (desiredCertificationId: string) => {
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
          <TheBasics
            categoryOptions={categoryOptions}
            employmentTitle={employmentTitle ?? ''}
            setEmploymentTitle={setEmploymentTitle}
            location={location ?? ''}
            setLocation={setLocation}
            employmentType={employmentType ?? 'FULLTIME'}
            setEmploymentType={setEmploymentType}
            category={category ?? 'marketplace'}
            setCategory={setCategory}
            employers={employers ?? []}
            employerId={employerId ?? ''}
            setEmployerId={setEmployerId}
            benefitsDescription={benefitsDescription ?? ''}
            setBenefitsDescription={setBenefitsDescription}
            responsibilitiesDescription={responsibilitiesDescription ?? ''}
            setResponsibilitiesDescription={setResponsibilitiesDescription}
            requirementsDescription={requirementsDescription ?? ''}
            setRequirementsDescription={setRequirementsDescription}
            workDays={workDays ?? ''}
            setWorkDays={setWorkDays}
            schedule={schedule ?? ''}
            setSchedule={setSchedule}
            hideJob={hideJob ?? false}
            handleHideJobChange={handleHideJobChange}
            onSubmit={onSubmit}
            isOpen={isOpen}
            onClose={onClose}
            job={job}
            onOpen={onOpen}
          />
        </TabPanel>
        <TabPanel>
          <Industries job={job} addIndustry={addIndustry} removeIndustry={removeIndustry} />
        </TabPanel>
        <TabPanel>
          <AttachedSkills
            job={job}
            addLearnedSkill={addLearnedSkill}
            removeLearnedSkill={removeLearnedSkill}
            addDesiredSkill={addDesiredSkill}
            removeDesiredSkill={removeDesiredSkill}
            masterSkills={masterSkills}
          />
        </TabPanel>
        <TabPanel>
          <AttachedCertifications
            job={job}
            addDesiredCertification={addDesiredCertification}
            removeDesiredCertification={removeDesiredCertification}
            masterCertifications={masterCertifications ?? []}
          />
        </TabPanel>
        <TabPanel>
          <Testimonials
            job={job}
            testimonialName={testimonialName}
            setTestimonialName={setTestimonialName}
            testimonialTitle={testimonialTitle}
            setTestimonialTitle={setTestimonialTitle}
            testimonial={testimonial}
            setTestimonial={setTestimonial}
            testimonialPhotoUrl={testimonialPhotoUrl}
            setTestimonialPhotoUrl={setTestimonialPhotoUrl}
            createTestimonial={createTestimonial}
            removeTestimonial={removeTestimonial}
          />
        </TabPanel>
        <TabPanel>
          <Photos
            job={job}
            photoUrl={photoUrl}
            setPhotoUrl={setPhotoUrl}
            createPhoto={createPhoto}
            removePhoto={removePhoto}
          />
        </TabPanel>
        <TabPanel>
          <CareerPaths
            job={job}
            careerPathTitle={careerPathTitle}
            setCareerPathTitle={setCareerPathTitle}
            careerPathLowerLimit={careerPathLowerLimit}
            setCareerPathLowerLimit={setCareerPathLowerLimit}
            careerPathUpperLimit={careerPathUpperLimit}
            setCareerPathUpperLimit={setCareerPathUpperLimit}
            createPath={createPath}
            removePath={removePath}
            movePathUp={movePathUp}
            movePathDown={movePathDown}
          />
        </TabPanel>
        <TabPanel>
          <Tags job={job} addTag={addTag} removeTag={removeTag} tags={tags} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
