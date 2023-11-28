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
    backButton.textContent = 'Back';
    backButton.dataset.iconBefore = '\uF053';
    backButton.addEventListener('click', loadCoinsInfo);

    backButtonDiv.append(backButton);
    outputDiv.append(backButtonDiv);

    for (const coinVariant of coinType.coins) {
        const coinTypeElement = document.createElement('div');
        coinTypeElement.classList.add('coin-type');
        coinTypeElement.textContent = `${coinVariant.name} (${getCoinYears(coinVariant)})`;

        const coinTypeImage = document.createElement('img');
        coinTypeImage.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.id}/${coinVariant.id}.png`;

        coinTypeElement.prepend(coinTypeImage);

        outputGridDiv.append(coinTypeElement);
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
