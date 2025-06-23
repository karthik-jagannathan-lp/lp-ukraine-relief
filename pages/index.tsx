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
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                      Dear Friends of Erie and Beyond,                    </h2>
                    <p className="mb-4">
                      We’ve just received a heartfelt message from our sister city of <strong>Chornomorsk, Ukraine</strong>—a message rooted in resilience, urgency, and hope.
                    </p>

                    <div className="mb-6">
                      <img src="ukraine-map.png" alt="Map showing Chornomorsk" className="w-full rounded-md shadow-sm" />
                      <p className="text-sm text-center mt-2 text-gray-500">Chornomorsk, Ukraine</p>
                    </div>

                    <p className="mb-4">
                      As nearby Odesa’s hospitals struggle to meet the growing needs of civilians and military personnel, Chornomorsk Hospital has been asked to step up as a key provider of civilian medical care.
                    </p>
                    <div className="mb-6">
                      <img
                        src="ukraine-damage.jpg"
                        className="rounded-lg object-cover shadow-lg w-full"
                        alt="Destruction in Ukraine"

                      />
                      <p className="text-sm text-center mt-2 text-gray-500">Damage to shipping containers in the port of Chornomorsk</p>

                    </div>

                    <p className="mb-4">
                      The hospital itself has recently suffered damage from bombings—yet the staff continues to serve their community with strength and compassion.
                    </p>
                    <div className="mb-6">
                      <img src="hospital-damage.jpg" alt="Damage to the hospital" className="w-full rounded-md shadow-sm" />
                      <p className="text-sm text-center mt-2 text-gray-500">Chornomorsk Hospital after being damaged by bombs</p>

                    </div>

                    <p className="mb-4">
                      Despite these hardships, they are taking on more patients than ever. But there is one critical gap in care they cannot fill alone:
                    </p>

                    <div className="bg-gray-100 p-4 rounded mb-4">
                      <p className="mb-2 font-medium">They urgently need a mammography machine.</p>
                      <p>This vital equipment will allow early detection and screening for breast cancer—especially important for women displaced by the war.</p>
                    </div>

                    <p className="mb-4">
                      <strong>Estimated cost:</strong> $240,000 — far beyond the means of the town, the hospital, or its local volunteers.
                    </p>

                    <p className="mb-4">
                      Ukrainian businesses have already pledged support. Now, they are asking if Erie—and our extended community—can help too.
                    </p>

                    <div className="bg-gray-50 border border-gray-200 p-4 rounded mb-4">
                      <p className="mb-2"><strong>Fundraising Goal:</strong> $300,000</p>
                      <p>To purchase, deliver, and install a certified mammography machine at Chornomorsk Hospital.</p>
                      <p className="mt-2">Every donation helps. Even $10 or $20 adds up.</p>
                    </div>

                    <p className="mb-4">
                      Let’s come together in solidarity with Chornomorsk. Every act of generosity brings hope and healing to those who need it most.
                    </p>

                    <div className="mb-6">
                      <img src="/community-support.jpg" alt="Community support" className="w-full rounded-md shadow-sm" />

                    </div>

                    <div className="mt-6 p-4 bg-gray-100 rounded">
                      <p className="mb-1">Questions or want to learn more?</p>
                      <a href="mailto:erie.chornomorsk@logisticsplus.com" className="text-blue-600 hover:underline">
                        erie.chornomorsk@logisticsplus.com
                      </a>
                    </div>

                    <p className="mt-8 text-center">
                      Erie has always stood for international friendship and compassion. Let’s carry that spirit forward—especially now, when it’s needed most.
                    </p>
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
