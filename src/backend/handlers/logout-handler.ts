import { envVars } from '@/frontend/services/env.service'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function logoutViaAuth0(req: NextApiRequest, res: NextApiResponse) {
  const endsessionURL = `https://blocktrain.us.auth0.com/v2/logout?client_id=88jXfMofB4jqBDbqB5d6V8fuXejwJTxO`
  return res.redirect(`${endsessionURL}&returnTo=${envVars().baseClientAppUrl}`)
}
