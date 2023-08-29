/* eslint-disable @typescript-eslint/naming-convention */
interface ExchangeRateData {
    time_last_update_unix: number;
    time_next_update_unix: number;
    conversion_rates: Record<string, number>;
}
/* eslint-enable @typescript-eslint/naming-convention */

const ratesGrid = document.querySelector('#rates-grid') as HTMLDivElement;

const currencies = [
    { name: 'CAD', symbol: '$' },
    { name: 'EUR', symbol: '€' },
    { name: 'GBP', symbol: '£' },
    { name: 'AUD', symbol: '$' },
    { name: 'CRC', symbol: '₡' },
    { name: 'JPY', symbol: '¥' },
];

// eslint-disable-next-line unicorn/prefer-top-level-await
fetch('https://v6.exchangerate-api.com/v6/822304e8ee8183e9de49f5df/latest/usd').then(async (response) => {
    const fullData = (await response.json()) as ExchangeRateData;

    const rates = fullData.conversion_rates;

    (document.querySelector('#last-updated') as HTMLSpanElement).textContent = `${new Date(fullData.time_last_update_unix * 1000).toLocaleDateString('en-US')}, ${new Date(
        fullData.time_last_update_unix * 1000,
    ).toLocaleTimeString('en-US')}`;

    const firstDiv = document.createElement('div');

    firstDiv.append(
        ...currencies.map((currency, index) => {
            const container = document.createElement('div');

            const startCurrency = document.createElement('span');
            startCurrency.classList.add('start-currency');
            startCurrency.textContent = '$1 ';

            if (index === 0) {
                const tooltip = document.createElement('span');
                tooltip.textContent = 'USD';
                tooltip.dataset.tooltip = 'United States Dollar';

                startCurrency.append(tooltip);
            } else startCurrency.textContent += 'USD';

            startCurrency.append(' =');

            container.append(startCurrency, ` ${currency.symbol}${rates[currency.name].toLocaleString()} ${currency.name}`);

            return container;
        }),
    );

    const secondDiv = document.createElement('div');

    secondDiv.append(
        ...currencies.map((currency) => {
            const container = document.createElement('div');

            const startCurrency = document.createElement('span');
            startCurrency.classList.add('start-currency');
            startCurrency.textContent = `${currency.symbol}1 ${currency.name} =`;

            container.append(startCurrency, ` $${(1 / rates[currency.name]).toLocaleString()} USD`);

            return container;
        }),
    );

    ratesGrid.innerHTML = '';

    ratesGrid.append(firstDiv, secondDiv);

    // (document.querySelector('#usd-cad') as HTMLSpanElement).textContent = `$${rates.CAD.toLocaleString()}`;
    // (document.querySelector('#usd-eur') as HTMLSpanElement).textContent = `€${rates.EUR.toLocaleString()}`;
    // (document.querySelector('#usd-gbp') as HTMLSpanElement).textContent = `£${rates.GBP.toLocaleString()}`;
    // (document.querySelector('#usd-aud') as HTMLSpanElement).textContent = `$${rates.AUD.toLocaleString()}`;
    // (document.querySelector('#usd-crc') as HTMLSpanElement).textContent = `₡${rates.CRC.toLocaleString()}`;
    // (document.querySelector('#usd-jpy') as HTMLSpanElement).textContent = `¥${rates.JPY.toLocaleString()}`;
    // (document.querySelector('#cad-usd') as HTMLSpanElement).textContent = `$${(1 / rates.CAD).toLocaleString()}`;
    // (document.querySelector('#eur-usd') as HTMLSpanElement).textContent = `$${(1 / rates.EUR).toLocaleString()}`;
    // (document.querySelector('#gbp-usd') as HTMLSpanElement).textContent = `$${(1 / rates.GBP).toLocaleString()}`;
    // (document.querySelector('#aud-usd') as HTMLSpanElement).textContent = `$${(1 / rates.AUD).toLocaleString()}`;
    // (document.querySelector('#crc-usd') as HTMLSpanElement).textContent = `$${(1 / rates.CRC).toLocaleString()}`;
    // (document.querySelector('#jpy-usd') as HTMLSpanElement).textContent = `$${(1 / rates.JPY).toLocaleString()}`;
});
