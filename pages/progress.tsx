import ProgressBar from 'components/ProgressBar'
import { getDonations } from 'lib/server'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import 'react-toastify/dist/ReactToastify.css'

const Index = ({
  fallbackData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const donations = fallbackData.donations

  return (
    <>
      <Head>
        <title>Fundraiser by Logistics Plus</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      <ProgressBar donations={donations} />
    </>
  )
}

export default Index

export const getStaticProps = async () => {
  const donations = await getDonations(process.env.GOOGLE_SERVICE_KEY!)

  return {
    props: { fallbackData: { donations } },
    revalidate: 10,
  }
}
