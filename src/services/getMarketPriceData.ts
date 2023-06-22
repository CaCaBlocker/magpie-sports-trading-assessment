import axios from "axios";

/**
 * The function retrieves market price data from a specified URL using the axios library in TypeScript.
 * @returns The `getMarketPriceData` function is returning the data obtained from the API endpoint
 * `https://mocki.io/v1/70f45519-0232-463b-bd4f-88e9d7213d26` using the Axios library. The data
 * returned is in the form of a Promise, which resolves to the actual data once the API call is
 * complete.
 */
const getMarketPriceData = async () => {
    const result = await axios.get('https://mocki.io/v1/70f45519-0232-463b-bd4f-88e9d7213d26');
    return result.data;
}

export default getMarketPriceData;