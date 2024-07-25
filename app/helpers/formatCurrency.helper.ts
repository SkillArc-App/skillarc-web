export function formatCurrency(inputString: string): string | null {
  try {
    // attempt to convert input string to number
    const value = parseFloat(inputString.replace(/[^\d.-]/g, ''))

    // set the locale to use comma separators and the dollar sign
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })

    // format the number as currency
    const formattedValue = formatter.format(value)

    return formattedValue
  } catch (error) {
    // input string is not a valid number
    return null
  }
}
