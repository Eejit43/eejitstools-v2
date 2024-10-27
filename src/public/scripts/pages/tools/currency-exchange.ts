/* eslint-disable @typescript-eslint/naming-convention */
interface ExchangeRateData {
    time_last_update_unix: number;
    time_next_update_unix: number;
    conversion_rates: Record<string, number>;
}
/* eslint-enable @typescript-eslint/naming-convention */

const ratesGrid = document.querySelector<HTMLDivElement>('#rates-grid')!;

const currencies = [
    { name: 'Canadian Dollar', abbreviation: 'CAD', symbol: '$' },
    { name: 'Euro', abbreviation: 'EUR', symbol: '€' },
    { name: 'Great British Pound Sterling', abbreviation: 'GBP', symbol: '£' },
    { name: 'Australian Dollar', abbreviation: 'AUD', symbol: '$' },
    { name: 'Costa Rican Colón', abbreviation: 'CRC', symbol: '₡' },
    { name: 'Japanese Yen', abbreviation: 'JPY', symbol: '¥' },
];

// eslint-disable-next-line unicorn/prefer-top-level-await
fetch('https://v6.exchangerate-api.com/v6/822304e8ee8183e9de49f5df/latest/usd').then(async (response) => {
    const fullData = (await response.json()) as ExchangeRateData;

    const rates = fullData.conversion_rates;

    document.querySelector<HTMLSpanElement>('#last-updated')!.textContent =
        `${new Date(fullData.time_last_update_unix * 1000).toLocaleDateString('en-US')}, ${new Date(
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

            const endCurrencyTooltip = document.createElement('span');
            endCurrencyTooltip.textContent = currency.abbreviation;
            endCurrencyTooltip.dataset.tooltip = currency.name;

            container.append(startCurrency, ` ${currency.symbol}${rates[currency.abbreviation].toLocaleString()} `, endCurrencyTooltip);

            return container;
        }),
    );

    const secondDiv = document.createElement('div');

    secondDiv.append(
        ...currencies.map((currency) => {
            const container = document.createElement('div');

            const startCurrency = document.createElement('span');
            startCurrency.classList.add('start-currency');
            startCurrency.textContent = `${currency.symbol}1 ${currency.abbreviation} =`;

            container.append(startCurrency, ` $${(1 / rates[currency.abbreviation]).toLocaleString()} USD`);

            return container;
        }),
    );

    ratesGrid.innerHTML = '';

    ratesGrid.append(firstDiv, secondDiv);
});
