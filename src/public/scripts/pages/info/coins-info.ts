import { FilteredCoin } from '../../../../route-handlers/coins-info';
import { CoinDenomination, CoinDesign } from '../../../../route-handlers/coins-list';
import { loadPopupImages } from '../../functions.js';

const outputDiv = document.querySelector('#output') as HTMLDivElement;
const outputGridDiv = document.querySelector('#output-grid') as HTMLDivElement;

let coinsInfo: CoinDenomination<CoinDesign<FilteredCoin>>[];

/**
 * Loads all coin information and displays it in the document.
 */
async function loadCoinsInfo() {
    if (!coinsInfo) coinsInfo = (await (await fetch('/coins-info')).json()) as CoinDenomination<CoinDesign<FilteredCoin>>[];

    outputDiv.innerHTML = '';
    outputGridDiv.innerHTML = '';

    const searchParameters = new URLSearchParams(window.location.search);
    const denominationSearch = searchParameters.get('denomination');
    const designSearch = searchParameters.get('design');

    const foundDenomination = denominationSearch ? coinsInfo.find((denomination) => denomination.id === denominationSearch) : null;
    const foundDesign = foundDenomination && designSearch ? foundDenomination.designs.find((design) => design.id === designSearch) : null;

    if (foundDenomination && foundDesign) return loadCoinDesignInfo(foundDenomination, foundDesign);
    else if (foundDenomination) return loadCoinDenominationInfo(foundDenomination);

    for (const denomination of coinsInfo) {
        const coinDenominationElement = document.createElement('div');
        coinDenominationElement.classList.add('information-button');
        coinDenominationElement.textContent = `${denomination.name} ($${denomination.value.toFixed(2)})`;
        coinDenominationElement.addEventListener('click', () => {
            const searchParameters = new URLSearchParams(window.location.search);
            searchParameters.set('denomination', denomination.id);
            window.history.pushState(null, '', `?${searchParameters.toString()}`);

            loadCoinDenominationInfo(denomination);
        });

        const coinDenominationImage = document.createElement('img');

        const lastCoinDesign = denomination.designs.at(-1)!;

        coinDenominationImage.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${denomination.id}/designs/${lastCoinDesign.id}.png`;
        coinDenominationImage.alt = lastCoinDesign.name;

        coinDenominationElement.prepend(coinDenominationImage);

        outputGridDiv.append(coinDenominationElement);
    }
}

/**
 * Loads information for a coin denomination.
 * @param denomination The denomination to load information for.
 */
function loadCoinDenominationInfo(denomination: CoinDenomination<CoinDesign<FilteredCoin>>) {
    outputDiv.innerHTML = '';
    outputGridDiv.innerHTML = '';

    const backButtonDiv = document.createElement('div');
    backButtonDiv.id = 'back-button-container';

    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.textContent = 'Back';
    backButton.dataset.iconBefore = '\uF053';
    backButton.addEventListener('click', () => {
        const searchParameters = new URLSearchParams(window.location.search);
        searchParameters.delete('denomination');
        window.history.pushState(null, '', `?${searchParameters.toString()}`);

        loadCoinsInfo();
    });

    backButtonDiv.append(backButton);
    outputDiv.append(backButtonDiv);

    for (const design of denomination.designs) {
        const coinDesignElement = document.createElement('div');
        coinDesignElement.classList.add('information-button');
        coinDesignElement.textContent = `${design.name} (${getCoinYears(design)})`;
        coinDesignElement.addEventListener('click', () => {
            const searchParameters = new URLSearchParams(window.location.search);
            searchParameters.set('denomination', denomination.id);
            searchParameters.set('design', design.id);
            window.history.pushState(null, '', `?${searchParameters.toString()}`);

            loadCoinDesignInfo(denomination, design);
        });

        const coinDesignImage = document.createElement('img');
        coinDesignImage.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${denomination.id}/designs/${design.id}.png`;
        coinDesignImage.alt = design.name;

        coinDesignElement.prepend(coinDesignImage);

        outputGridDiv.append(coinDesignElement);
    }
}

/**
 * Loads information for a coin design.
 * @param denomination The coin designs's parent denomination.
 * @param design The coin design to load information for.
 */
function loadCoinDesignInfo(denomination: CoinDenomination<CoinDesign<FilteredCoin>>, design: CoinDesign<FilteredCoin>) {
    if (denomination.constants) design = { ...denomination.constants, ...design };

    outputDiv.innerHTML = '';
    outputGridDiv.innerHTML = '';

    const backButtonDiv = document.createElement('div');
    backButtonDiv.id = 'back-button-container';

    const startOverButton = document.createElement('button');
    startOverButton.textContent = 'Start Over';
    startOverButton.dataset.iconBefore = '\uF323';
    startOverButton.addEventListener('click', () => {
        const searchParameters = new URLSearchParams(window.location.search);
        searchParameters.delete('denomination');
        searchParameters.delete('design');
        window.history.pushState(null, '', `?${searchParameters.toString()}`);

        loadCoinsInfo();
    });

    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.textContent = 'Back';
    backButton.dataset.iconBefore = '\uF053';
    backButton.addEventListener('click', () => {
        const searchParameters = new URLSearchParams(window.location.search);
        searchParameters.delete('design');
        window.history.pushState(null, '', `?${searchParameters.toString()}`);

        loadCoinDenominationInfo(denomination);
    });

    backButtonDiv.append(startOverButton, ' ', backButton);
    outputDiv.append(backButtonDiv);

    const header = document.createElement('h2');
    header.textContent = design.name;

    outputDiv.append(header);

    const informationGrid = document.createElement('div');
    informationGrid.id = 'information-grid';
    informationGrid.classList.add('basic-grid');

    const informationGridCell = document.createElement('div');

    const designInformation: { icon: string; name: string; value: string | null | (() => HTMLElement | string | null) }[] = [
        { icon: 'calendar-range', name: 'Years Minted', value: getCoinYears(design) },
        {
            icon: 'coins',
            name: 'Total Minted',
            value: () => {
                const variantTotalsAlreadyAdded: FilteredCoin[] = [];

                let total = 0;

                for (const coin of design.coins) {
                    if (!coin.mintage) continue;

                    if (coin.mintageForAllVarieties)
                        if (variantTotalsAlreadyAdded.some((variant) => variant.year === coin.year && variant.mintMark === coin.mintMark)) continue;
                        else variantTotalsAlreadyAdded.push(coin);

                    total += coin.mintage;
                }

                const lastDateWithMintage = design.coins.findLast((coin) => coin.mintage)?.year;

                if (!lastDateWithMintage) return '';

                return `${total.toLocaleString()}${lastDateWithMintage === design.coins.at(-1)!.year ? '' : ` (as of ${lastDateWithMintage})`}`;
            },
        },
        { icon: 'dollar-sign', name: 'Value', value: `$${denomination.value.toFixed(2)}` },
        {
            icon: 'vial',
            name: 'Composition',
            value: () => {
                if (!design.composition) return null;

                if ('amounts' in design.composition) return design.composition.amounts.map((entry) => formatComposition(entry.value, entry.type)).join(', ');
                else {
                    const listElement = document.createElement('ul');

                    for (const yearRange of design.composition) {
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
                if (!design.mass) return null;

                if (typeof design.mass === 'number') return `${design.mass.toFixed(2)} grams`;

                const listElement = document.createElement('ul');

                for (const yearRange of design.mass) {
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
        {
            icon: 'circle',
            name: 'Diameter',
            value: () => {
                if (!design.diameter) return null;

                if (typeof design.diameter === 'number') return `${design.diameter} mm`;

                const listElement = document.createElement('ul');

                for (const yearRange of design.diameter) {
                    const listItem = document.createElement('li');

                    if (yearRange.value) listItem.append(`${yearRange.value} mm`);
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
        {
            icon: 'coin-blank',
            name: 'Edge',
            value: () => {
                if (!design.edge) return null;

                if (typeof design.edge === 'string') return design.edge;

                if (typeof design.edge === 'object' && 'reeds' in design.edge) return `Reeded (${design.edge.reeds} reeds)`;

                const listElement = document.createElement('ul');

                for (const yearRange of design.edge) {
                    const listItem = document.createElement('li');

                    if (yearRange.value) listItem.append(typeof yearRange.value === 'string' ? yearRange.value : `Reeded (${yearRange.value.reeds} reeds)`);
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
        {
            icon: 'database',
            name: `Numista ${design.numistaEntry && Array.isArray(design.numistaEntry) && design.numistaEntry.length > 1 ? 'Entries' : 'Entry'}`,
            value: () => {
                if (design.numistaEntry === false) return 'None';
                if (!design.numistaEntry) return null;

                const linkContainer = document.createElement('span');

                const numistaIds = typeof design.numistaEntry === 'number' ? [design.numistaEntry] : design.numistaEntry;

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
                if (!design.wikipediaArticle) return null;

                const linkContainer = document.createElement('span');

                const wikipediaArticles = typeof design.wikipediaArticle === 'string' ? [design.wikipediaArticle] : design.wikipediaArticle;

                for (const [index, wikipediaArticle] of wikipediaArticles.entries()) {
                    const linkElement = document.createElement('a');
                    linkElement.href = `https://en.wikipedia.org/wiki/${wikipediaArticle.replaceAll(' ', '_')}`;
                    linkElement.target = '_blank';
                    linkElement.textContent = wikipediaArticle.replace('#', ' § ');

                    linkContainer.append(linkElement);
                    if (index !== wikipediaArticles.length - 1) linkContainer.append(', ');
                }

                return linkContainer;
            },
        },
    ];

    for (const item of designInformation) {
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

    const coinDesignImage = document.createElement('img');
    coinDesignImage.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${denomination.id}/designs/${design.id}.png`;
    coinDesignImage.alt = design.name;
    coinDesignImage.classList.add('popup-image');

    informationGrid.append(informationGridCell, coinDesignImage);

    outputDiv.append(informationGrid);

    loadPopupImages();
}

/**
 * Gets the year range for a given coin design.
 * @param design The coin design to get the year range for.
 */
export function getCoinYears(design: CoinDesign<FilteredCoin>): string {
    if (design.years) return design.years;

    const startYear = design.coins[0].year;
    const endYear = design.active ? 'date' : design.coins.at(-1)!.year;

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

loadCoinsInfo(); // eslint-disable-line unicorn/prefer-top-level-await

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

window.addEventListener('popstate', () => {
    const searchParameters = new URLSearchParams(window.location.search);
    const denominationSearch = searchParameters.get('denomination');
    const designSearch = searchParameters.get('design');

    const foundDenomination = denominationSearch ? coinsInfo.find((denomination) => denomination.id === denominationSearch) : null;
    const foundDesign = foundDenomination && designSearch ? foundDenomination.designs.find((design) => design.id === designSearch) : null;

    if (foundDenomination && foundDesign) loadCoinDesignInfo(foundDenomination, foundDesign);
    else if (foundDenomination) loadCoinDenominationInfo(foundDenomination);
    else loadCoinsInfo();
});
