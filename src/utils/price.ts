export const convertToNumber = (priceString: string):number => Number(priceString.slice(1).split(',').join(''));
export const convertToPrice = (price: number): string => "$" + price.toFixed(2);