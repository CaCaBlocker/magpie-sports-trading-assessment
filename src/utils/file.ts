import {CardData} from '../types/types';
import {convertToPrice} from '../utils/price'

/**
 * The function converts a JSON object containing card data into an array of objects with specific
 * properties.
 * @param {CardData} cardData - an object containing data for multiple trading cards, where each key is
 * the name of a card and the value is an object containing various data points for that card (such as
 * grade, grading company, pricing source, etc.).
 * @returns The function `convertJSON` is returning an array of objects, where each object represents a
 * card and its data. The object properties include the card name, grade, grading company, pricing
 * source, average price, lower bound, upper bound, standard deviation, peak price, and peak date.
 */
const convertJSON = (cardData: CardData) => {
    const result = [];

    for (let key in cardData) {
        result.push({
            "Card Name": key,
            "Grade": cardData[key].data.grade,
            "Grading Company": cardData[key].data.gradingCompany,
            "Pricing Source": cardData[key].data.pricingSource,
            "Average Price": cardData[key].data.averagePrice,
            "Lower Bound": cardData[key].data.lowerBound,
            "Upper Bound": cardData[key].data.upperBound,
            "Standard Deviation": cardData[key].data.standardDeviation,
            "Peak Price": cardData[key].data.peakPrice,
            "Peak Date": cardData[key].data.peakDate
        });
    }
    return result;
}

/**
 * This function exports card data as a JSON file.
 * @param {CardData} cardData - The cardData parameter is an object that contains data related to a
 * card, such as its title, description, and image. This function takes this object and converts it
 * into a JSON string, which is then saved as a file and downloaded by the user.
 */
export const ExportJSON = (cardData: CardData) => {
    const jsonData = JSON.stringify(JSON.stringify(convertJSON(cardData)));
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'data.json';
    link.href = url;
    link.click();

}

/**
 * The function exports card data to a CSV format.
 * @param {CardData} cardData - CardData object that contains information about different trading
 * cards.
 * @returns an array of arrays, where each inner array represents a row of data for a CSV file. The
 * first inner array contains the headers for the columns, and the remaining inner arrays contain the
 * data for each card in the cardData object.
 */
export const ExportCSV = (cardData: CardData) => {
    const result = [
        ["Card Name", "Grade", "Grading Company", "Pricing Source", "Average Price", "Lower Bound", "Upper Bound", "Standard Deviation", "Peak Price", "Peak Date"]
    ];

    for (let key in cardData) {
        result.push([
            key,
            cardData[key].data.grade,
            cardData[key].data.gradingCompany,
            cardData[key].data.pricingSource,
            convertToPrice(cardData[key].data.averagePrice),
            convertToPrice(cardData[key].data.lowerBound),
            convertToPrice(cardData[key].data.upperBound),
            convertToPrice(cardData[key].data.standardDeviation),
            convertToPrice(cardData[key].data.peakPrice),
            cardData[key].data.peakDate
        ])
    }

    return result;
}
