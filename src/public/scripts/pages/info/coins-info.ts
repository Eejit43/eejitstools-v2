import { FilteredCoin } from '../../../../route-handlers/coins-info';
import { CoinType, CoinVariant } from '../../../../route-handlers/coins-list';

const outputDiv = document.querySelector('#output') as HTMLDivElement;
const outputGridDiv = document.querySelector('#output-grid') as HTMLDivElement;

let coinsInfo: CoinType<CoinVariant<FilteredCoin>>[];

/**
 * Loads all coin information and displays it in the document.
 */
async function loadCoinsInfo() {
    if (!coinsInfo) coinsInfo = (await (await fetch('/coins-info')).json()) as CoinType<CoinVariant<FilteredCoin>>[];

    outputDiv.innerHTML = '';
    outputGridDiv.innerHTML = '';

    for (const coinType of coinsInfo) {
        const coinTypeElement = document.createElement('div');
        coinTypeElement.classList.add('coin-type');
        coinTypeElement.textContent = `${coinType.name} ($${coinType.value.toFixed(2)})`;
        coinTypeElement.addEventListener('click', () => loadCoinTypeInfo(coinType));

        const coinTypeImage = document.createElement('img');
        coinTypeImage.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${
            coinType.coins.at(-1)?.id ? `${coinType.id}/${coinType.coins.at(-1)?.id}` : 'default'
        }.png`;

        coinTypeElement.prepend(coinTypeImage);

        outputGridDiv.append(coinTypeElement);
    }
}

loadCoinsInfo(); // eslint-disable-line unicorn/prefer-top-level-await

/**
 * Loads information for a coin type.
 * @param coinType The coin type to load information for.
 */
function loadCoinTypeInfo(coinType: CoinType<CoinVariant<FilteredCoin>>) {
    outputDiv.innerHTML = '';
    outputGridDiv.innerHTML = '';

    const backButtonDiv = document.createElement('div');

    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.textContent = 'Back';
    backButton.dataset.iconBefore = '\uF053';
    backButton.addEventListener('click', loadCoinsInfo);

    backButtonDiv.append(backButton);
    outputDiv.append(backButtonDiv);

    for (const coinVariant of coinType.coins) {
        const coinVariantElement = document.createElement('div');
        coinVariantElement.classList.add('coin-type');
        coinVariantElement.textContent = `${coinVariant.name} (${getCoinYears(coinVariant)})`;
        coinVariantElement.addEventListener('click', () => loadCoinVariantInfo(coinType, coinVariant));

        const coinTypeImage = document.createElement('img');
        coinTypeImage.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.id}/${coinVariant.id}.png`;

        coinVariantElement.prepend(coinTypeImage);

        outputGridDiv.append(coinVariantElement);
    }
}

/**
 * Loads information for a coin variant.
 * @param coinType The coin variant's parent type.
 * @param coinVariant The coin variant to load information for.
 */
function loadCoinVariantInfo(coinType: CoinType<CoinVariant<FilteredCoin>>, coinVariant: CoinVariant<FilteredCoin>) {
    outputDiv.innerHTML = '';
    outputGridDiv.innerHTML = '';

    const backButtonDiv = document.createElement('div');
    backButtonDiv.id = 'back-button-container';

    const startOverButton = document.createElement('button');
    startOverButton.textContent = 'Start Over';
    startOverButton.dataset.iconBefore = '\uF323';
    startOverButton.addEventListener('click', loadCoinsInfo);

    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.textContent = 'Back';
    backButton.dataset.iconBefore = '\uF053';
    backButton.addEventListener('click', () => loadCoinTypeInfo(coinType));

    backButtonDiv.append(startOverButton, document.createTextNode(' '), backButton);
    outputDiv.append(backButtonDiv);

    const header = document.createElement('h2');
    header.textContent = coinVariant.name;

    outputDiv.append(header);

    const coinInformation: { icon: string; name: string; value: string }[] = [
        { icon: 'calendar-range', name: 'Years Minted', value: getCoinYears(coinVariant) },
        { icon: 'coins', name: 'Total Minted', value: '' },
        { icon: 'dollar-sign', name: 'Value', value: `$${coinType.value.toFixed(2)}` },
        { icon: 'vial', name: 'Composition', value: '' },
        { icon: 'weight-scale', name: 'Weight', value: '' },
        { icon: 'circle', name: 'Diameter', value: '' },
        { icon: 'coin-blank', name: 'Thickness', value: '' },
        { icon: 'database', name: 'Numista Entry', value: '' },
    ];

    for (const item of coinInformation) {
        const row = document.createElement('div');
        row.classList.add('coin-information-row');

        const icon = document.createElement('i');
        icon.className = `fa-regular fa-${item.icon}`;

        row.append(icon, ' ');

        row.append(item.name);

        const value = document.createElement('span');

        if (item.value) value.textContent = item.value.trim();
        else {
            value.dataset.unknown = 'true';
            value.textContent = 'Unknown';
        }

        row.append(': ', value);

        outputDiv.append(row);
    }
}

/**
 * Gets the year range for a given coin variant.
 * @param variant The coin variant to get the year range for.
 */
export function getCoinYears(variant: CoinVariant<FilteredCoin>): string {
    if (variant.years) return variant.years;

    const startYear = variant.coins[0].year;
    const endYear = variant.active ? 'date' : variant.coins.at(-1)!.year;

    return startYear === endYear ? startYear : `${startYear}–${endYear}`;
}

document.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft') return;

    if (
        event.altKey ||
        event.metaKey ||
        (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || (document.activeElement as HTMLElement).contentEditable === 'true'))
    )
        return;

    const backButton = document.querySelector('#back-button') as HTMLButtonElement | null;

    if (backButton) backButton.click();
});
