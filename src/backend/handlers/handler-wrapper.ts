import type { NextApiRequest, NextApiResponse } from 'next'
import { authHandler } from './auth-handler'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
type HttpHandler = (request: NextApiRequest, response: NextApiResponse) => void

interface RouteHandlerParams {
  GET?: HttpHandler
  POST?: HttpHandler
  PUT?: HttpHandler
  PATCH?: HttpHandler
  DELETE?: HttpHandler
}

export async function routeHandler(
  request: NextApiRequest,
  response: NextApiResponse,
  handlers: RouteHandlerParams,
) {
  const method = request.method as HttpMethod
  const handler = handlers[method]

  if (!handler) {
    return response.status(405).send('Method not allowed')
  }

  // protect specific user/profile/jobInteraction routes with auth
  const isAuthorized = await authHandler(request, response)
  if (!isAuthorized) {
    return response.status(401).json({ message: 'Unauthorized' })
  }

  console.log(`\n`)
  console.log('-----------------Incoming Request---------------------')
  console.log(`Handling ${method} request to ${request.url}`)
  console.log(`\n`)
  console.log(`Request body: ${JSON.stringify(request.body)}`)
  console.log(`\n`)
  console.log(`Request query: ${JSON.stringify(request.query)}`)
  console.log('-----------------Incoming Request---------------------')
  console.log(`\n\n`)

  return await handler!(request, response)
}
