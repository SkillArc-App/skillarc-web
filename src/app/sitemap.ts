import { MetadataRoute } from 'next'

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT_URL) {
    return process.env.NEXT_PUBLIC_ENVIRONMENT_URL
  }

  throw "Base URL not set"
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getBaseUrl(),
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: 'monthly'
    },
    {
      url: `${getBaseUrl()}/jobs`,
      lastModified: new Date(),
      priority: 1.0,
      changeFrequency: 'daily'
    },
  ]
}