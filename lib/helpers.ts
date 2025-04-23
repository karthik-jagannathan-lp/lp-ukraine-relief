export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export const formatMoney = (
  amount: number | string,
  decimalCount = 0
): string => {
  let number = 0
  if (typeof amount === 'string') {
    number = parseFloat(amount)
  } else if (typeof amount === 'number') {
    number = amount
  } else {
    return 'NaN'
  }

  let numberString = Math.abs(number).toFixed(decimalCount)

  const [ones, decimals] = numberString.split('.')
  numberString = `${ones.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}${
    decimals ? `.${decimals}` : ''
  }`
  if (number < 0) numberString = `-${numberString}`
  return '$' + numberString
}

// optionally you can use unfetch package from npm or built yours to handle promise.
export const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  return res.json();
};
