import { MetadataRoute } from 'next'
import { SearchJob } from './common/types/Search'
import { get } from './http-common'

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT_URL) {
    return process.env.NEXT_PUBLIC_ENVIRONMENT_URL
  }

  throw 'Base URL not set'
}

const getJobs = async (): Promise<SearchJob[]> => {
  if (process.env.NEXT_DYNAMIC_SITEMAP != 'true') {
    return []
  }

  return (await get<SearchJob[]>('seekers/jobs')).data
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobs()
  const jobSites: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${getBaseUrl()}/jobs/${job.id}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly',
  }))

  return [
    {
      url: getBaseUrl(),
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: 'monthly',
    },
    {
      url: `${getBaseUrl()}/jobs`,
      lastModified: new Date(),
      priority: 1.0,
      changeFrequency: 'daily',
    },
    ...jobSites
  ]
}
