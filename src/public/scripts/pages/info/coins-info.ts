import { FilteredCoin } from '../../../../route-handlers/coins-info';
import { CoinType, CoinVariant } from '../../../../route-handlers/coins-list';
import { loadPopupImages } from '../../functions.js';

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

        const lastCoinVariant = coinType.coins.at(-1);

        coinTypeImage.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${lastCoinVariant ? `${coinType.id}/${lastCoinVariant.id}` : 'default'}.png`;
        coinTypeImage.alt = lastCoinVariant?.name ?? 'Default coin image';

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
    backButtonDiv.id = 'back-button-container';

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
        coinTypeImage.alt = coinVariant.name;

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
    if (coinType.constants) coinVariant = { ...coinType.constants, ...coinVariant };

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

    backButtonDiv.append(startOverButton, ' ', backButton);
    outputDiv.append(backButtonDiv);

    const header = document.createElement('h2');
    header.textContent = coinVariant.name;

    outputDiv.append(header);

    const informationGrid = document.createElement('div');
    informationGrid.id = 'information-grid';
    informationGrid.classList.add('basic-grid');

    const informationGridCell = document.createElement('div');

    const coinInformation: { icon: string; name: string; value: string | null | (() => HTMLElement | string | null) }[] = [
        { icon: 'calendar-range', name: 'Years Minted', value: getCoinYears(coinVariant) },
        {
            icon: 'coins',
            name: 'Total Minted',
            value: () => {
                const variantTotalsAlreadyAdded: FilteredCoin[] = [];

                let total = 0;

                for (const coin of coinVariant.coins) {
                    if (!coin.mintage) continue;

                    if (coin.mintageForAllVarieties)
                        if (variantTotalsAlreadyAdded.some((variant) => variant.year === coin.year && variant.mintMark === coin.mintMark)) continue;
                        else variantTotalsAlreadyAdded.push(coin);

                    total += coin.mintage;
                }

                const lastDateWithMintage = coinVariant.coins.findLast((coin) => coin.mintage)?.year;

                if (!lastDateWithMintage) return '';

                return `${total.toLocaleString()}${lastDateWithMintage === coinVariant.coins.at(-1)!.year ? '' : ` (as of ${lastDateWithMintage})`}`;
            },
        },
        { icon: 'dollar-sign', name: 'Value', value: `$${coinType.value.toFixed(2)}` },
        {
            icon: 'vial',
            name: 'Composition',
            value: () => {
                if (!coinVariant.composition) return null;

                if ('amounts' in coinVariant.composition) return coinVariant.composition.amounts.map((entry) => formatComposition(entry.value, entry.type)).join(', ');
                else {
                    const listElement = document.createElement('ul');

                    for (const yearRange of coinVariant.composition) {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${yearRange.amounts.map((entry) => formatComposition(entry.value, entry.type)).join(', ')} (${formatYearRange(
                            yearRange.startYear,
                            yearRange.endYear,
                        )})`;

                        listElement.append(listItem);
                    }

                    return listElement;
                }
            },
        },
        {
            icon: 'weight-scale',
            name: 'Mass',
            value: () => {
                if (!coinVariant.mass) return null;

                if (typeof coinVariant.mass === 'number') return `${coinVariant.mass.toFixed(2)} grams`;

                const listElement = document.createElement('ul');

                for (const yearRange of coinVariant.mass) {
                    const listItem = document.createElement('li');

                    if (yearRange.value) listItem.append(`${yearRange.value.toFixed(2)} grams`);
                    else {
                        const unknownSpan = document.createElement('span');
                        unknownSpan.dataset.unknown = 'true';
                        unknownSpan.textContent = 'Unknown';

                        listItem.append(unknownSpan);
                    }

                    listItem.append(` (${formatYearRange(yearRange.startYear, yearRange.endYear)})`);

                    listElement.append(listItem);
                }

                return listElement;
            },
        },
        { icon: 'circle', name: 'Diameter', value: coinVariant.diameter ? `${coinVariant.diameter} mm` : null },
        { icon: 'coin-blank', name: 'Edge', value: coinVariant.edge ? (typeof coinVariant.edge === 'string' ? coinVariant.edge : `Reeded (${coinVariant.edge.reeds} reeds)`) : null },
        {
            icon: 'database',
            name: `Numista ${coinVariant.numistaEntry && Array.isArray(coinVariant.numistaEntry) && coinVariant.numistaEntry.length > 1 ? 'Entries' : 'Entry'}`,
            value: () => {
                if (!coinVariant.numistaEntry) return null;

                const linkContainer = document.createElement('span');

                const numistaIds = typeof coinVariant.numistaEntry === 'number' ? [coinVariant.numistaEntry] : coinVariant.numistaEntry;

                for (const [index, numistaId] of numistaIds.entries()) {
                    const linkElement = document.createElement('a');
                    linkElement.href = `https://en.numista.com/catalogue/pieces${numistaId}.html`;
                    linkElement.target = '_blank';
                    linkElement.textContent = `#${numistaId}`;

                    linkContainer.append(linkElement);
                    if (index !== numistaIds.length - 1) linkContainer.append(', ');
                }

                return linkContainer;
            },
        },
        {
            icon: 'newspaper',
            name: 'Wikipedia Article',
            value: () => {
                if (!coinVariant.wikipediaArticle) return null;

                const linkElement = document.createElement('a');
                linkElement.href = `https://en.wikipedia.org/wiki/${coinVariant.wikipediaArticle.replaceAll(' ', '_')}`;
                linkElement.target = '_blank';
                linkElement.textContent = coinVariant.wikipediaArticle.replace('#', ' § ');

                return linkElement;
            },
        },
    ];

    for (const item of coinInformation) {
        const row = document.createElement('div');
        row.classList.add('coin-information-row');

        const icon = document.createElement('i');
        icon.className = `fa-regular fa-${item.icon}`;

        row.append(icon, ' ');

        row.append(item.name);

        let value = document.createElement('span');

        const itemValue = typeof item.value === 'function' ? item.value() : item.value;
        if (itemValue)
            if (typeof itemValue === 'string') value.textContent = itemValue;
            else if (itemValue.tagName === 'SPAN') value = itemValue;
            else value.append(itemValue);
        else {
            value.dataset.unknown = 'true';
            value.textContent = 'Unknown';
        }

        row.append(': ', value);

        informationGridCell.append(row);
    }

    const imageElement = document.createElement('img');
    imageElement.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.id}/${coinVariant.id}.png`;
    imageElement.alt = coinVariant.name;
    imageElement.classList.add('popup-image');

    informationGrid.append(informationGridCell, imageElement);

    outputDiv.append(informationGrid);

    loadPopupImages();
}

/**
 * Gets the year range for a given coin variant.
 * @param variant The coin variant to get the year range for.
 */
export function getCoinYears(variant: CoinVariant<FilteredCoin>): string {
    if (variant.years) return variant.years;

    const startYear = variant.coins[0].year;
    const endYear = variant.active ? 'date' : variant.coins.at(-1)!.year;

    return formatYearRange(startYear, endYear);
}

/**
 * Formats the percentage and type of a coin's composition.
 * @param value The composition percentage.
 * @param type The composition type.
 */
function formatComposition(value: number, type: string) {
    return value === 100 ? `${type.slice(0, 1).toUpperCase()}${type.slice(1)}` : `${value}% ${type}`;
}

/**
 * Formats a year range to either a single year or a range.
 * @param startYear The start year.
 * @param endYear The end year.
 */
function formatYearRange(startYear: string | number, endYear: string | number | undefined): string {
    return startYear === endYear ? startYear.toString() : `${startYear}–${endYear ?? 'date'}`;
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
