/**
 * The function takes a string representing a price and returns a number by removing the currency
 * symbol and commas.
 * @param {string} priceString - A string representing a price value, with a currency symbol at the
 * beginning and commas separating thousands. For example, ",234.56".
 */
export const convertToNumber = (priceString: string):number => Number(priceString.slice(1).split(',').join(''));
/**
 * The function converts a number to a string representing a price with two decimal places and a dollar
 * sign.
 * @param {number} price - a number representing a price value.
 */
export const convertToPrice = (price: number): string => "$" + price.toFixed(2);