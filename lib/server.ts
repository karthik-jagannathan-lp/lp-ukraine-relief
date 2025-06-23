import moment from 'moment'
import { extractSheets } from 'spreadsheet-to-json'
import { Donation } from 'types'
import { FILTER_DONATION_DATE } from './constants'

export const getDonations = async (serviceKey: string) => {
  const credentials = JSON.parse(Buffer.from(serviceKey, 'base64').toString())
  const donations: Donation[] = (
    await extractSheets({
      spreadsheetKey: process.env.SHEET_KEY,
      credentials: credentials,
      sheetsToExtract: ['ukraine_donations'],
    })
  ).ukraine_donations.map((d: any) => {
    return {
      id:
        Math.floor(Math.random() * 5000) +
        d.ipn_track_id +
        Math.floor(Math.random() * 500),
      name: d.first_name + ' ' + d.last_name,
      date: moment(d.payment_date).fromNow(),
      mc_gross: +d.mc_gross,
      payment_date: d.payment_date,
    }
  }).filter( (d: Donation) => (new Date(d.payment_date) > FILTER_DONATION_DATE));

  return donations
}
