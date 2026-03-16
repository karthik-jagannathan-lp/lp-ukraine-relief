import { FireIcon, HeartIcon, ShareIcon } from '@heroicons/react/solid'
import DonationsPopup from 'components/DonationsPopup'
import ProgressBar from 'components/ProgressBar'
import SharePopup from 'components/SharePopup'
import Updates from 'components/Updates'
import { FILTER_DONATION_DATE } from 'lib/constants'
import { getDonations } from 'lib/server'
import moment from 'moment'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Index = ({
  fallbackData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const donations = fallbackData.donations
  const [shareOpen, setShareOpen] = useState(false)
  const [donationsOpen, setDonationsOpen] = useState(false)

  const donationsShortList = useMemo(() => {
    if (donations.length === 0) {
      return null;
    }
    const recent = donations
      .sort(function (left, right) {
        return moment
          .utc(right.payment_date)
          .diff(moment.utc(left.payment_date))
      })
      .slice(0, 3)

    const highest = donations.reduce(function (prev, current) {
      return +prev.mc_gross > +current.mc_gross ? prev : current
    })
    return [{ ...highest, comment: 'Top donation' }, ...recent]
  }, [])
  const totalDonationsInPastDay = () => {
    const today = moment().startOf('day')
    const yesterday = moment().subtract(1, 'day').startOf('day')
    return donations.filter((d) => {
      const date = moment(d.payment_date)
      return date.isSameOrAfter(yesterday) && date.isSameOrBefore(today)
    }).length
  }

  return (
    <>
      <ToastContainer />
      <SharePopup popupState={{ shareOpen, setShareOpen }} />
      <DonationsPopup
        donations={donations}
        popupState={{ donationsOpen, setDonationsOpen }}
      />

      <Head>
        <title>Fundraiser by Logistics Plus</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      <div className="min-h-full bg-stone-50">
        <nav className="bg-stone-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="/logo.png"
                    alt="Workflow"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="/logo.png"
                    alt="Workflow"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <a
                    href="https://www.paypal.com/donate/?hosted_button_id=PJNGWRVDL624E"
                    target={`_blank`}
                    className="relative inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <HeartIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Donate now</span>
                  </a>
                  <button
                    type="button"
                    className="relative ml-4 hidden items-center rounded-md border border-transparent border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:inline-flex"
                    onClick={() => setShareOpen(true)}
                  >
                    <ShareIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">

            <main className="px-2 md:col-span-12 lg:col-span-8">
              <div className="mt-4">
                <div className="space-y-8">

                  <aside className="block lg:hidden">
                    <div className="sticky top-4 space-y-4">
                      <section aria-labelledby="who-to-follow-heading">
                        <div className="rounded-lg bg-white shadow">
                          <div className="space-y-3 p-6">
                            <ProgressBar donations={donations} />
                            <div className="flex flex-col items-center space-y-4">
                              <a
                                href="https://www.paypal.com/donate/?hosted_button_id=PJNGWRVDL624E"
                                target={`_blank`}
                                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                <HeartIcon
                                  className="-ml-1 mr-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span>Donate now</span>
                              </a>
                              <button
                                type="button"
                                className="inline-flex w-full items-center justify-center rounded-md  border  border-transparent border-blue-600 px-4 py-4 text-sm font-medium text-blue-600  shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => setShareOpen(true)}
                              >
                                <ShareIcon
                                  className="-ml-1 mr-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span>Share</span>
                              </button>
                            </div>
                            {totalDonationsInPastDay() > 0 && (
                              <div>
                                <div className="inline-flex items-center justify-center rounded-full bg-purple-50 px-2 py-2 align-middle text-sm font-medium text-purple-700">
                                  <FireIcon
                                    className="h-5 w-5 text-purple-400"
                                    aria-hidden="true"
                                  />
                                </div>

                                <span className="font-semiBold text-purple-700">
                                  {' '}
                                  {totalDonationsInPastDay()} people just
                                  donated
                                </span>
                              </div>
                            )}

                            <div className="mt-9 flow-root">
                              <ul
                                role="list"
                                className=" divide-y divide-gray-200"
                              >
                                {donationsShortList && donationsShortList.map((donation) => (
                                  <li
                                    key={donation.id}
                                    className="flex items-center space-x-3 py-4"
                                  >
                                    <div className="flex-shrink-0">
                                      <img
                                        className="h-8 w-8 rounded-full"
                                        src="/avatar.svg"
                                        alt=""
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        <span>{donation.name}</span>
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        <span>
                                          {' '}
                                          {/* {formatMoney(
                                            donation.mc_gross
                                          )} •  */}
                                          {donation.date}
                                          {donation.comment && (
                                            <>
                                              {' '}
                                              •{' '}
                                              <span className="cursor-pointer underline underline-offset-1">
                                                {donation.comment}
                                              </span>
                                            </>
                                          )}
                                        </span>
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-6">
                              <button
                                onClick={() => setDonationsOpen(true)}
                                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                              >
                                View all
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </aside>
                  <div className="max-w-3xl mx-auto" id="main-content">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                      Help Secure Clean Water for Chornomorsk's Hospital
                    </h2>
                    <p className="mb-4">
                      Chornomorsk, Ukraine—Erie's sister city—continues to face daily attacks on its critical civilian infrastructure. Power and heating systems have been repeatedly targeted, and intelligence services are now warning that <b>water supply facilities may be the next primary target,</b> especially during the summer months.
                    </p>
                    <p className="mb-4">
                      In response, the Town of Chornomorsk is investing in resilience to protect its residents and ensure continuity of essential services.
                    </p>
                    <div className="mb-6">
                      <img src="hospital.jpeg" alt="Chornomorsk Hospital" className="w-full rounded-md shadow-sm" />
                      <p className="text-sm text-center mt-2 text-gray-500">Chornomorsk Hospital and staff</p>
                    </div>
                    <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded mb-6">
                      <h3 className="text-xl font-bold mb-4">The Critical Need</h3>
                      <p className="mb-4">
                        The town's hospital is being developed as a <b>Resilience Center</b>—a facility capable of operating independently in emergency conditions, or "island mode," during prolonged outages.
                      </p>
                      <ul className="space-y-2 mb-4">
                        <li>✅ <b>Diesel generators</b> are already in place</li>
                        <li>✅ <b>Solar panels</b> and <b>battery storage</b> are being sourced through international donors</li>
                        <li>❌ <b>A secure water supply is still missing</b></li>
                      </ul>
                      <p>
                        Without access to water, the hospital cannot function autonomously—and in times of crisis, this puts both patients and the broader community at serious risk.
                      </p>
                    </div>

                    <div className="bg-gray-50 border-l-4 border-green-500 p-6 rounded mb-6">
                      <h3 className="text-xl font-bold mb-4">The Solution</h3>
                      <p className="mb-4">
                        Chornomorsk plans to <b>drill an artesian water well</b> on hospital grounds. This well would:
                      </p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>Provide a <b>reliable, independent water source</b> for hospital operations</li>
                        <li>Serve as a <b>water truck filling point</b> for emergency distribution throughout the town</li>
                        <li>Strengthen the hospital's ability to operate during infrastructure attacks or outages</li>
                      </ul>
                      <p>
                        The town has already experienced water shortages following previous attacks, and the current emergency water distribution system is <b>not sufficient</b>—even during winter conditions.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-6 rounded mb-6">
                      <h3 className="text-xl font-bold mb-4">Funding Goal</h3>
                      <p className="text-2xl font-bold text-blue-600 mb-4">$60,000 USD</p>
                      <p className="mb-4">
                        Your support will directly fund a life‑saving infrastructure project that helps ensure <b>medical care, clean water, and community resilience</b> for the people of Chornomorsk.
                      </p>
                      <p className="font-medium">
                        <b>Every dollar brings us closer to a hospital that can stand strong—no matter the circumstances.</b>
                      </p>
                    </div>
                  </div>
                  <Updates />
                </div>
              </div>
            </main>
            <aside className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-4 space-y-4">
                <section aria-labelledby="who-to-follow-heading">
                  <div className="rounded-lg bg-white shadow-xl">
                    <div className="space-y-3 p-6">
                      <ProgressBar donations={donations} />
                      <div className="flex flex-col items-center space-y-4">
                        <a
                          href="https://www.paypal.com/donate/?hosted_button_id=PJNGWRVDL624E"
                          target={`_blank`}
                          className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <HeartIcon
                            className="-ml-1 mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          <span>Donate now</span>
                        </a>
                        <button
                          type="button"
                          className="inline-flex w-full items-center justify-center rounded-md  border  border-transparent border-blue-600 px-4 py-4 text-sm font-medium text-blue-600  shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={() => setShareOpen(true)}
                        >
                          <ShareIcon
                            className="-ml-1 mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          <span>Share</span>
                        </button>
                      </div>
                      {totalDonationsInPastDay() > 0 && (
                        <div>
                          <div className="inline-flex items-center justify-center rounded-full bg-purple-50 px-2 py-2 align-middle text-sm font-medium text-purple-700">
                            <FireIcon
                              className="h-5 w-5 text-purple-400"
                              aria-hidden="true"
                            />
                          </div>

                          <span className="font-semiBold text-purple-700">
                            {' '}
                            {totalDonationsInPastDay()} people just donated
                          </span>
                        </div>
                      )}

                      <div className="mt-9 flow-root">
                        <ul role="list" className=" divide-y divide-gray-200">
                          {donationsShortList && donationsShortList.map((donation) => (
                            <li
                              key={donation.id}
                              className="flex items-center space-x-3 py-4"
                            >
                              <div className="flex-shrink-0">
                                <img
                                  className="h-8 w-8 rounded-full"
                                  src="/avatar.svg"
                                  alt=""
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  <span>{donation.name}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                  <span>
                                    {' '}
                                    {/* {formatMoney(donation.mc_gross)} •{' '} */}
                                    {donation.date}
                                    {donation.comment && (
                                      <>
                                        {' '}
                                        •{' '}
                                        <span className="cursor-pointer underline underline-offset-1">
                                          {donation.comment}
                                        </span>
                                      </>
                                    )}
                                  </span>
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => setDonationsOpen(true)}
                          className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          View all
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </div>
        <footer className="flex h-24 w-full items-center justify-center border-t">
          <a
            className="flex items-center justify-center gap-2"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <Image
              src="/logo.png"
              alt="Logistics Plus"
              width={102}
              height={24}
            />
          </a>
        </footer>
      </div>
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
