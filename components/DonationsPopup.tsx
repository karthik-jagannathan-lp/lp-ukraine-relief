import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { HeartIcon } from '@heroicons/react/solid'
import { classNames, formatMoney } from 'lib/helpers'
import moment from 'moment'
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Donation } from 'types'

const DonationsPopup = ({
  donations,
  popupState,
}: {
  donations: Donation[]
  popupState: {
    donationsOpen: boolean
    setDonationsOpen: Dispatch<SetStateAction<boolean>>
  }
}) => {
  const { donationsOpen, setDonationsOpen } = popupState

  const tabs = [
    { name: 'Most Recent', value: 'recent' },
    { name: 'Top Donations', value: 'top' },
  ]

  const [currentTab, setCurrentTab] = useState(tabs[0])
  const [sortedDonations, setSortedDonations] = useState(donations)

  const sortDonations = (value: string) => {
    if (value === 'recent') {
      setSortedDonations(
        donations.sort(function (left, right) {
          return moment
            .utc(right.payment_date)
            .diff(moment.utc(left.payment_date))
        })
      )
    }
    if (value === 'top') {
      setSortedDonations(
        donations.sort((a, b) => {
          return +b.mc_gross - +a.mc_gross
        })
      )
    }
  }

  useEffect(() => {
    sortDonations(currentTab.value)
  }, [])

  return (
    <Transition.Root show={donationsOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setDonationsOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {' '}
                        Donations ({donations.length}){' '}
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-blue-500"
                          onClick={() => setDonationsOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <a
                      href="https://www.paypal.com/donate/?hosted_button_id=PJNGWRVDL624E"
                      target={`_blank`}
                      className="relative my-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <HeartIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      <span>Donate now</span>
                    </a>
                  </div>
                  {/* <div className="border-b border-gray-200">
                    <div className="px-6">
                      <nav
                        className="-mb-px flex space-x-6"
                        x-descriptions="Tab component"
                      >
                        {tabs.map((tab) => (
                          <button
                            onClick={() => {
                              setCurrentTab(tab)
                              sortDonations(tab.value)
                            }}
                            key={tab.name}
                            className={classNames(
                              tab.name === currentTab.name
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                              'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                            )}
                          >
                            {tab.name}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div> */}
                  <ul
                    role="list"
                    className="flex-1 divide-y divide-gray-200 overflow-y-auto"
                  >
                    {sortedDonations.map((donation) => (
                      <li key={donation.id}>
                        <div className="group relative flex items-center py-6 px-5">
                          <span className="-m-1 block flex-1 p-1">
                            <div
                              className="absolute inset-0 group-hover:bg-gray-50"
                              aria-hidden="true"
                            />
                            <div className="relative flex min-w-0 flex-1 items-center">
                              <span className="relative inline-block flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src="/avatar.svg"
                                  alt=""
                                />
                              </span>
                              <div className="ml-4 truncate">
                                <p className="truncate text-sm font-medium text-gray-900">
                                  {donation.name}
                                </p>
                                <p className="truncate text-sm text-gray-500">
                                  {/* {formatMoney(donation.mc_gross)} •{' '} */}
                                  {donation.date}
                                </p>
                              </div>
                            </div>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default DonationsPopup
