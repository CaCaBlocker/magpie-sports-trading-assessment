import axios from "axios";

const getMarketPriceData = async () => {
    const result = await axios.get('https://mocki.io/v1/70f45519-0232-463b-bd4f-88e9d7213d26');
    return result.data;
}

export default getMarketPriceData;