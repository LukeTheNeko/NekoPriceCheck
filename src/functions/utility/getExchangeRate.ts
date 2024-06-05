import axios from 'axios';

interface ExchangeRates {
    [currency: string]: {
        rate: number;
    };
}

const currencyCodes: Record<string, string> = {
    '1': 'USD',
    '2': 'GBP',
    '3': 'EUR',
    '4': 'CHF',
    '5': 'RUB',
    '7': 'BRL',
    '20': 'CAD',
    '21': 'AUD'
};  

export async function getExchangeRate(currencyId: string): Promise<number | null> {
    try {
        const currency = currencyCodes[currencyId];

        if (!currency) {
            console.error('Invalid currency ID');
            return null;
        }

        const exchangeRatesResponse = await axios.get<ExchangeRates>('https://www.floatrates.com/daily/usd.json');
        const rate = exchangeRatesResponse.data[currency.toLowerCase()]?.rate;

        if (!rate) {
            console.error('Exchange rate not found');
            return null;
        }

        return rate;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null;
    }
}