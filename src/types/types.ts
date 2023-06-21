export type Card = {
    cardName: string;
    grade: string;
    gradingCompany: string;
    price: string;
    pricingSource: string;
    txnDate: string;
}

export type CardData = {
    [key: string] : {
      data: {    
        grade: string;
        gradingCompany: string;
        pricingSource: string;
        averagePrice: number;
        peakPrice: number;
        peakDate: string;
        standardDeviation: number;
        lowerBound: number;
        upperBound: number;
      },
      prices: Array<{txnDate: string, price: number}>
    }
}