import {useState, useEffect, useRef} from 'react';
import './App.css';

import {Card, CardData} from './types/types';

import getMarketPriceData from './services/getMarketPriceData';

import {convertToNumber, convertToPrice} from './utils/price';

import {ExportJSON, ExportCSV} from './utils/file';

import { CSVLink } from "react-csv";
import { DownloadTableExcel } from 'react-export-table-to-excel';

function App() {

  const [CardData, setPriceData] = useState<CardData | null>(null);

  const tableRef = useRef(null);

  const exportJson = () => {
    if (CardData !== null)
      ExportJSON(CardData);
  }

  useEffect(() => {
    const fetchData = async () => {
      return await getMarketPriceData()
    };

    fetchData()
      .then((data: Card[]) => {
        const _cardData: CardData = {};
        //  Filter Data
        for (const card of data) {
          if (card.cardName in _cardData) {
            _cardData[card.cardName].prices.push({txnDate: card.txnDate, price: convertToNumber(card.price)});
          }
          else {
            _cardData[card.cardName] = {
              data: {
                grade: card.grade,
                gradingCompany: card.gradingCompany,
                pricingSource: card.pricingSource,
                averagePrice: 0,
                peakPrice: 0,
                peakDate: "",
                standardDeviation: 0,
                lowerBound: 0,
                upperBound: 0
              },
              prices: [{txnDate: card.txnDate, price: convertToNumber(card.price)}]
            }
          }
        }
        //  Add special data 
        for (let cardName in _cardData) {
          let average = 0;
          let peakPrice = 0;
          let peakDate = "";
          let lowerBound = _cardData[cardName].prices[0] ? _cardData[cardName].prices[0].price : 0;
          // let upperBound = 0;
          for (let price of _cardData[cardName].prices) {
            average += price.price;

            if (peakPrice < price.price) {
              peakPrice = price.price;
              peakDate = price.txnDate;
            }

            if (lowerBound > price.price) {
              lowerBound = price.price;
            }
          }
          //  Add average
          //  Add lower bound
          _cardData[cardName].data.lowerBound = lowerBound;
          //  Add upper bound
          _cardData[cardName].data.upperBound = peakPrice;
          average /= _cardData[cardName].prices.length;
          _cardData[cardName].data.averagePrice = average;
          //  Add standard deviation
          let tempSum = 0;
          for (let price of _cardData[cardName].prices) {
            tempSum += Math.pow(price.price - average, 2);
          }
          _cardData[cardName].data.standardDeviation = Math.sqrt(tempSum / (_cardData[cardName].prices.length > 2 ? _cardData[cardName].prices.length - 1 : 1));
          //  Add peak price
          _cardData[cardName].data.peakPrice = peakPrice;
          //  Add peak date
          _cardData[cardName].data.peakDate = peakDate;
        }
        setPriceData(_cardData);
      })
      .catch((err) => {
        console.error(err);
      })
  }, [])
  
  return (
    <div className="App">
      {
        CardData === null 
        ? <h1>Loading...</h1> 
        : <div>
            <div id="buttonGroup">
              <button onClick={exportJson}>Export JSON</button>
              <CSVLink data={ExportCSV(CardData)}><button>Export CSV</button></CSVLink>
              <DownloadTableExcel
                    filename="data"
                    sheet="users"
                    currentTableRef={tableRef.current}
                >
                <button>Export XLSX</button>
              </DownloadTableExcel>
            </div>
            <table ref={tableRef}>
              <thead>
                <tr>
                  <th>Card Name</th>
                  <th>Grade</th>
                  <th>Grading Company</th>
                  <th>Pricing Source</th>
                  <th>Average Price</th>
                  <th>Lower Bound</th>
                  <th>Upper Bound</th>
                  <th>Standard Deviation</th>
                  <th>Peak Price</th>
                  <th>Peak Price Date</th>
                </tr>
              </thead>
              <tbody>
              {
                Object.keys(CardData).map((cardName, i) => (
                  <tr key={cardName + i}>
                    <td>{cardName}</td>
                    <td>{CardData[cardName].data.grade}</td>
                    <td>{CardData[cardName].data.gradingCompany}</td>
                    <td>{CardData[cardName].data.pricingSource}</td>
                    <td>{convertToPrice(CardData[cardName].data.averagePrice)}</td>
                    <td>{convertToPrice(CardData[cardName].data.lowerBound)}</td>
                    <td>{convertToPrice(CardData[cardName].data.upperBound)}</td>
                    <td>{convertToPrice(CardData[cardName].data.standardDeviation)}</td>
                    <td>{convertToPrice(CardData[cardName].data.peakPrice)}</td>
                    <td>{CardData[cardName].data.peakDate}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}

export default App;
