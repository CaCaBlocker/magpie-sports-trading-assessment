import {useState, useEffect} from 'react';
import './App.css';

import {Card, CardData} from './types/types';

import getMarketPriceData from './services/getMarketPriceData';

function App() {

  const [CardData, setPriceData] = useState<CardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      return await getMarketPriceData()
    };

    const convertToNumber = (priceString: string):number => Number(priceString.slice(1))

    fetchData()
      .then((data: Card[]) => {
        const _cardData: CardData = {};
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

              },
              prices: [{txnDate: card.txnDate, price: convertToNumber(card.price)}]
            }
          }
        }
        setPriceData(_cardData);
      })
      .catch((err) => {
        console.error(err);
      })
  }, [CardData])
  
  return (
    <div className="App">
      {
        CardData === null 
        ? <h1>No Data</h1> 
        : <div>
          <table>
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
                <th>Peak price</th>
                <th>Peak price Date</th>
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
