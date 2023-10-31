export type EnvironmentVariables = {
  environment: 'local' | 'dev' | 'test' | 'prod'
  baseAppUrl: string
  baseClientAppUrl: string
}

export const envVars = (): EnvironmentVariables => {
  const shortEnv = (process.env.NEXT_PUBLIC_ENV as 'local' | 'dev' | 'test' | 'prod') || 'local'

  const EnvironmentVars: EnvironmentVariables = {
    environment: process.env.NEXT_PUBLIC_ENV as 'local' | 'dev' | 'test' | 'prod',
    baseAppUrl: getBaseClientAppUrl(shortEnv),
    baseClientAppUrl: getBaseClientAppUrl(shortEnv),
  }
  return EnvironmentVars
}

const getBaseAppUrl = (env: string): string => {
  switch (env) {
    case 'dev':
      return 'https://dev.d3umgbd1ryvwpy.amplifyapp.com'
    case 'prod':
      return 'https://prod.d3umgbd1ryvwpy.amplifyapp.com'
    default:
      return 'http://localhost:3000'
  }
}

const getBaseClientAppUrl = (env: string): string => {
  switch (env) {
    case 'dev':
      return 'https://dev.blocktrainapp.com'
    case 'prod':
      return 'https://app.blocktrainapp.com'
    default:
      return 'http://localhost:3000'
  }
}
