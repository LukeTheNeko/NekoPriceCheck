export function currencySymbols(currency: string) {
    const symbols: { [key: string]: string } = {
        '1': '$',   // USD
        '2': '£',   // GBP
        '3': '€',   // EUR
        '4': 'CHF', // CHF
        '5': '₽',   // RUB
        '7': 'R$',  // BRL
        '20': 'C$', // CAD
        '21': 'A$', // AUD
       
    };

    return symbols[currency] || '';
}