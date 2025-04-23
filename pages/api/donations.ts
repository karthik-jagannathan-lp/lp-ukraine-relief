import { getDonations } from 'lib/server'
import type { NextApiRequest, NextApiResponse } from 'next'

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_KEY!, 'base64').toString()
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const donations = await getDonations(process.env.GOOGLE_SERVICE_KEY!)
  res.status(200).json(donations)
}
