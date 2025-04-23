import { GoogleSpreadsheet } from 'google-spreadsheet'
import type { NextApiRequest, NextApiResponse } from 'next'

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_KEY!, 'base64').toString()
)
const doc = new GoogleSpreadsheet(process.env.SHEET_KEY!)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('received hook')
  await doc.useServiceAccountAuth(credentials)
  console.log({ body: req.body })
  await doc.loadInfo()

  const order = req.body

  // create a sheet and set the header row
  const orders = doc.sheetsByIndex[0]
  const {
    payment_date,
    payer_email,
    first_name,
    last_name,
    mc_currency,
    mc_gross,
    mc_fee,
    ipn_track_id,
  } = order

  // append rows
  await orders.addRow([
    payment_date,
    payer_email,
    first_name,
    last_name,
    mc_currency,
    mc_gross,
    mc_fee,
    ipn_track_id,
    JSON.stringify(order),
  ])
  res.send('Hello Express app!')
}
