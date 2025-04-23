import { GOAL_TOTAL } from 'lib/constants'
import { formatMoney } from 'lib/helpers'
import React, { useEffect, useState } from 'react'
import { Donation } from 'types'

const ProgressBar = ({ donations }: { donations: Donation[] }) => {
  const progressBarRef = React.useRef<HTMLDivElement>(null)
  const [percentage, setPercentage] = useState(0)

  const donationTotal = donations.length > 0 ?
    donations
    .map((d) => +d.mc_gross)
    .reduce((acc, donation) => acc + donation) 
    : 0;

  function updateProgressBar() {
    const progressBar = progressBarRef.current // corresponding DOM node
    const local_percentage = Math.floor((donationTotal / GOAL_TOTAL) * 100)
    setPercentage(local_percentage)

    if (progressBar) {
      progressBar.style.width = `${local_percentage}%`
    }
  }

  useEffect(() => {
    setTimeout(() => {
      updateProgressBar()
    }, 500)
  }, [])
  return (
    <>
      <h2 className="text-base font-medium text-gray-900">
        <span className="text-2xl font-extrabold">
          {formatMoney(donationTotal)}
          {'   '}
        </span>{' '}
        <span className="text-sm text-gray-500">
          raised of {formatMoney(GOAL_TOTAL)} goal ({percentage}%)
        </span>
      </h2>
      <div className="relative h-2 overflow-hidden rounded-full">
        <div className="absolute h-full w-full bg-gray-200"></div>
        <div
          ref={progressBarRef}
          id="bar"
          style={{ width: '0%' }}
          className="relative h-full bg-blue-500 transition-all duration-1000 ease-out"
        ></div>
      </div>
      <div className="text-lg">{donations.length} donations</div>
    </>
  )
}

export default ProgressBar
