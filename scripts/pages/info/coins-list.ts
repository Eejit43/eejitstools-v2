import { Coin, CoinType, ParsedCoinType } from '../../../data/coins-data.js';
import { showAlert, showResult } from '../../functions.js';

const passwordInput = document.getElementById('login-password') as HTMLInputElement;
const loginButton = document.getElementById('login-button') as HTMLButtonElement;
const coinsList = document.getElementById('coins-list') as HTMLDivElement;
const changeHistory = document.getElementById('change-history') as HTMLUListElement;
const exportDataButton = document.getElementById('export-data') as HTMLButtonElement;

['input', 'paste'].forEach((type) => {
    passwordInput.addEventListener(type, () => {
        passwordInput.value = passwordInput.value.replace(/[^0-9]/g, '');

        if (passwordInput.value.length > 4) passwordInput.value = passwordInput.value.slice(0, 4);
    });
});

passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && passwordInput.value.length > 0) loginButton.click();
});

loginButton.addEventListener('click', async () => {
    const { success } = (await (await fetch(`/coins-login?password=${passwordInput.value}`)).json()) as { success: boolean };

    if (success) {
        passwordInput.dataset.input = passwordInput.value;
        passwordInput.value = '';
        passwordInput.disabled = true;
        loginButton.disabled = true;
        showAlert('Logged in!', 'success');
        showResult('login', 'success', undefined, undefined, false);

        loadCoinsList();

        exportDataButton.disabled = false;
    } else {
        showAlert('Incorrect password!', 'error');
        showResult('login', 'error', undefined, undefined, false);
        loginButton.disabled = true;
        setTimeout(() => (loginButton.disabled = false), 1000);
    }
});

const mintMarks: { [abbreviation: string]: string } = {
    P: 'Philadelphia (Pennsylvania)',
    D: 'Denver (Colorado)',
    S: 'San Francisco (California)',
    W: 'West Point (New York)',
    CC: 'Carson City (Nevada)',
    C: 'Charlotte (North Carolina)'
};

interface CoinVariantById {
    name: string;
    id: string;
    note?: string;
    years?: string;
    active?: true;
    coins: { [id: string]: PartialNullable<Coin> };
}

let coinsData: { [id: string]: { name: string; id: string; coins: { [id: string]: CoinVariantById } } };

/**
 * Load the coins list.
 */
async function loadCoinsList() {
    const unindexedCoinsData = (await (await fetch(`/coins-list?password=${passwordInput.dataset.input as string}`)).json()) as ParsedCoinType[];

    coinsData = Object.fromEntries(unindexedCoinsData.map((coinType) => [coinType.id, { ...coinType, coins: Object.fromEntries(coinType.coins.map((coinVariant) => [coinVariant.id, { ...coinVariant, coins: Object.fromEntries(coinVariant.coins.map((coin) => [coin.id, coin])) }])) }]));

    coinsList.innerHTML = '';
    coinsList.classList.add('obtained-hidden');

    const buttonsDiv = document.createElement('div');
    buttonsDiv.id = 'toggle-buttons';

    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload';
    reloadButton.addEventListener('click', async () => {
        await loadCoinsList();
        showAlert('Reloaded!', 'success');

        if (changeHistory.querySelectorAll('li').length === 0) changeHistory.innerHTML = '';

        const historyEntry = document.createElement('li');
        historyEntry.textContent = 'Reloaded coins list from database';

        const timeTooltip = document.createElement('span');
        timeTooltip.classList.add('time-tooltip');
        timeTooltip.dataset.tooltip = new Date().toLocaleString();

        const timeIcon = document.createElement('i');
        timeIcon.classList.add('fa-solid', 'fa-clock');

        timeTooltip.appendChild(timeIcon);

        historyEntry.appendChild(timeTooltip);

        changeHistory.appendChild(historyEntry);
    });

    const showAllVariantsButton = document.createElement('button');
    showAllVariantsButton.textContent = 'Show all variants';
    showAllVariantsButton.dataset.expanded = 'false';
    showAllVariantsButton.addEventListener('click', () => {
        if (showAllVariantsButton.dataset.expanded === 'true') {
            showAllVariantsButton.dataset.expanded = 'false';
            showAllVariantsButton.textContent = 'Show all variants';
            (document.querySelectorAll('.coin-type-expand') as NodeListOf<HTMLButtonElement>).forEach((button) => {
                if (button.dataset.expanded === 'true') button.click();
            });
        } else {
            showAllVariantsButton.dataset.expanded = 'true';
            showAllVariantsButton.textContent = 'Hide all variants';
            (document.querySelectorAll('.coin-type-expand') as NodeListOf<HTMLButtonElement>).forEach((button) => {
                if (button.dataset.expanded === 'false') button.click();
            });
        }
    });

    const toggleMissingCoinsButton = document.createElement('button');
    toggleMissingCoinsButton.id = 'toggle-missing-coins';
    toggleMissingCoinsButton.textContent = 'Hide missing coins';
    toggleMissingCoinsButton.dataset.shown = 'true';
    toggleMissingCoinsButton.addEventListener('click', () => {
        if (toggleMissingCoinsButton.dataset.shown === 'true') {
            toggleMissingCoinsButton.dataset.shown = 'false';
            toggleMissingCoinsButton.textContent = 'Show missing coins';
            coinsList.classList.add('missing-hidden');
        } else {
            toggleMissingCoinsButton.dataset.shown = 'true';
            toggleMissingCoinsButton.textContent = 'Hide missing coins';
            coinsList.classList.remove('missing-hidden');
        }
    });

    const toggleObtainedCoinsButton = document.createElement('button');
    toggleObtainedCoinsButton.id = 'toggle-obtained-coins';
    toggleObtainedCoinsButton.textContent = 'Show obtained coins';
    toggleObtainedCoinsButton.dataset.shown = 'false';
    toggleObtainedCoinsButton.addEventListener('click', () => {
        if (toggleObtainedCoinsButton.dataset.shown === 'true') {
            toggleObtainedCoinsButton.dataset.shown = 'false';
            toggleObtainedCoinsButton.textContent = 'Show obtained coins';
            coinsList.classList.add('obtained-hidden');
        } else {
            toggleObtainedCoinsButton.dataset.shown = 'true';
            toggleObtainedCoinsButton.textContent = 'Hide obtained coins';
            coinsList.classList.remove('obtained-hidden');
        }
    });

    const toggleNeedsUpgradeCoinsButton = document.createElement('button');
    toggleNeedsUpgradeCoinsButton.id = 'toggle-needs-upgrade-coins';
    toggleNeedsUpgradeCoinsButton.textContent = 'Hide coins needing upgrade';
    toggleNeedsUpgradeCoinsButton.dataset.shown = 'true';
    toggleNeedsUpgradeCoinsButton.addEventListener('click', () => {
        if (toggleNeedsUpgradeCoinsButton.dataset.shown === 'true') {
            toggleNeedsUpgradeCoinsButton.dataset.shown = 'false';
            toggleNeedsUpgradeCoinsButton.textContent = 'Show coins needing upgrade';
            coinsList.classList.add('upgrade-hidden');
        } else {
            toggleNeedsUpgradeCoinsButton.dataset.shown = 'true';
            toggleNeedsUpgradeCoinsButton.textContent = 'Hide coins needing upgrade';
            coinsList.classList.remove('upgrade-hidden');
        }
    });

    buttonsDiv.appendChild(reloadButton);
    buttonsDiv.appendChild(showAllVariantsButton);
    buttonsDiv.appendChild(document.createTextNode(' | '));
    buttonsDiv.appendChild(toggleMissingCoinsButton);
    buttonsDiv.appendChild(toggleObtainedCoinsButton);
    buttonsDiv.appendChild(toggleNeedsUpgradeCoinsButton);

    coinsList.appendChild(buttonsDiv);

    document.addEventListener('keydown', (event) => {
        if (!event.altKey) return;
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || (document.activeElement as HTMLElement).contentEditable === 'true')) return;

        if (event.code === 'KeyR') reloadButton.click();
        else if (event.code === 'KeyA') showAllVariantsButton.click();
        else if (event.code === 'KeyM') toggleMissingCoinsButton.click();
        else if (event.code === 'KeyO') toggleObtainedCoinsButton.click();
        else if (event.code === 'KeyU') toggleNeedsUpgradeCoinsButton.click();
    });

    unindexedCoinsData.forEach((coinType) => {
        const coinTypeDiv = document.createElement('div');
        coinTypeDiv.classList.add('coin-type');
        coinTypeDiv.textContent = coinType.name;

        const coinTypeImg = document.createElement('img');
        coinTypeImg.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.coins[coinType.coins.length - 1]?.id ? `${coinType.id}/${coinType.coins[coinType.coins.length - 1]?.id}` : 'default'}.png`;
        coinTypeImg.classList.add('coin-type-image', 'popup-image');
        coinTypeImg.alt = coinType.name;

        const coinTypeButton = document.createElement('button');
        coinTypeButton.classList.add('coin-type-expand');
        coinTypeButton.textContent = 'Show variants';
        coinTypeButton.dataset.expanded = 'false';
        coinTypeButton.addEventListener('click', () => {
            if (coinTypeButton.dataset.expanded === 'true') {
                coinTypeButton.dataset.expanded = 'false';
                coinTypeButton.textContent = 'Show variants';
                coinTypeDiv.querySelectorAll('.coin-variant').forEach((variant) => variant.classList.add('hidden'));
            } else {
                coinTypeButton.dataset.expanded = 'true';
                coinTypeButton.textContent = 'Hide variants';
                coinTypeDiv.querySelectorAll('.coin-variant').forEach((variant) => variant.classList.remove('hidden'));
            }
        });

        coinTypeDiv.prepend(coinTypeImg);
        coinTypeDiv.appendChild(coinTypeButton);

        coinType.coins.forEach((coinVariant) => {
            const amountTooltip = document.createElement('span');
            amountTooltip.id = `${coinVariant.id}-amount-tooltip`;

            const coinVariantDiv = document.createElement('div');
            coinVariantDiv.classList.add('coin-variant', 'hidden');

            const coinVariantYears = document.createElement('span');
            coinVariantYears.id = `${coinVariant.id}-years`;

            const needsUpgradeTotal = document.createElement('span');
            needsUpgradeTotal.id = `${coinVariant.id}-needs-upgrade`;

            coinVariantDiv.innerHTML = `${coinVariant.name} (${coinVariantYears.outerHTML}) (${amountTooltip.outerHTML}${needsUpgradeTotal.outerHTML})`;

            if (coinVariant.note) {
                const coinVariantNote = document.createElement('span');
                coinVariantNote.classList.add('coin-variant-note', 'tooltip-right');
                coinVariantNote.textContent = '*';
                coinVariantNote.dataset.tooltip = coinVariant.note;

                coinVariantDiv.appendChild(coinVariantNote);
            }

            const coinVariantImg = document.createElement('img');
            coinVariantImg.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinVariant.id ? `${coinType.id}/${coinVariant.id}` : 'default'}.png`;
            coinVariantImg.classList.add('coin-variant-image', 'popup-image');
            coinVariantImg.alt = coinVariant.name;

            const coinVariantButton = document.createElement('button');
            coinVariantButton.classList.add('coin-variant-expand');
            coinVariantButton.textContent = 'Show coin table';
            coinVariantButton.dataset.expanded = 'false';
            coinVariantButton.addEventListener('click', () => {
                if (coinVariantButton.dataset.expanded === 'true') {
                    coinVariantButton.dataset.expanded = 'false';
                    coinVariantButton.textContent = 'Show coin table';
                    coinVariantTable.classList.add('hidden');
                } else {
                    coinVariantButton.dataset.expanded = 'true';
                    coinVariantButton.textContent = 'Hide coin table';
                    coinVariantTable.classList.remove('hidden');
                }
            });

            const coinVariantTable = document.createElement('table');
            coinVariantTable.classList.add('info-table', 'coin-variant-table', 'hidden');

            const coinVariantTableHead = document.createElement('thead');
            const coinVariantTableHeadRow = document.createElement('tr');

            ['Year', 'Mint Mark', 'Specification/Notes', 'Obtained', 'Needs Upgrade'].forEach((header) => {
                const infoHeader = document.createElement('th');
                infoHeader.textContent = header;
                coinVariantTableHeadRow.appendChild(infoHeader);
            });

            coinVariantTableHead.appendChild(coinVariantTableHeadRow);
            coinVariantTable.appendChild(coinVariantTableHead);

            const coinVariantTableBody = document.createElement('tbody');

            coinVariant.coins.forEach((coin) => {
                const row = document.createElement('tr');
                row.dataset.id = coin.id;
                row.dataset.obtained = (coin.obtained ?? false).toString();
                row.dataset.upgrade = (coin.upgrade ?? false).toString();

                const year = document.createElement('td');

                const yearEditor = document.createElement('span');
                yearEditor.textContent = coin.year;
                yearEditor.contentEditable = 'true';
                yearEditor.addEventListener('blur', async () => {
                    const newValue = yearEditor.textContent || 'UNKNOWN';
                    if (newValue === coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].year) return;

                    addChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins[coin.id], coinVariant.name, 'year', { year: newValue });

                    coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].year = newValue;

                    await updateCoinData(coinType.id, coinVariant.id, coin.id, { year: newValue });
                });
                year.appendChild(yearEditor);

                if (coin.image) {
                    const image = document.createElement('sup');
                    image.classList.add('coin-image-icon', 'fa-solid', 'fa-image');
                    image.dataset.image = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.id}/${coin.image}.png`;
                    image.dataset.name = `${coinVariant.name} - ${coin.year}${coin.mintMark ? `  (${coin.mintMark})` : ''}${coin.specification ? ` (${coin.specification})` : ''}`;
                    year.appendChild(image);
                }

                row.appendChild(year);

                const mintMark = document.createElement('td');
                const tooltip = document.createElement('span');
                tooltip.classList.add('tooltip-bottom');
                tooltip.dataset.tooltip = coin.mintMark ? (coin.mintMark in mintMarks ? `Minted in ${mintMarks[coin.mintMark]}` : 'Unknown') : `Likely minted in ${mintMarks.P}`;
                tooltip.textContent = coin.mintMark || 'None';
                tooltip.contentEditable = 'true';
                tooltip.addEventListener('focus', () => {
                    tooltip.removeAttribute('data-tooltip');
                    tooltip.classList.remove('tooltip-bottom');
                });
                tooltip.addEventListener('blur', async () => {
                    if (!tooltip.textContent) tooltip.textContent = 'None';
                    tooltip.dataset.tooltip = tooltip.textContent.toLowerCase() !== 'none' ? (tooltip.textContent.toUpperCase() in mintMarks ? `Minted in ${mintMarks[tooltip.textContent]}` : 'Unknown') : `Likely minted in ${mintMarks.P}`;
                    tooltip.textContent = tooltip.textContent.toLowerCase() === 'none' ? 'None' : tooltip.textContent.toUpperCase();
                    tooltip.classList.add('tooltip-bottom');

                    const newValue = tooltip.textContent && tooltip.textContent !== 'None' ? tooltip.textContent : null;

                    if (tooltip.textContent === (coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].mintMark || 'None')) return;

                    addChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins[coin.id], coinVariant.name, 'mint mark', { mintMark: tooltip.textContent });

                    coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].mintMark = newValue;

                    await updateCoinData(coinType.id, coinVariant.id, coin.id, { mintMark: newValue });
                });
                mintMark.appendChild(tooltip);
                row.appendChild(mintMark);

                const specification = document.createElement('td');
                if (!coin.comparison) {
                    specification.contentEditable = 'true';
                    specification.textContent = coin.specification ?? '';
                    specification.addEventListener('blur', async () => {
                        if (specification.textContent === (coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].specification || '')) return;

                        addChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins[coin.id], coinVariant.name, 'specification', { specification: specification.textContent });

                        coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].specification = specification.textContent || null;

                        await updateCoinData(coinType.id, coinVariant.id, coin.id, { specification: specification.textContent || null });
                    });
                }
                if (coin.comparison) {
                    const comparison = document.createElement('span');
                    comparison.classList.add('coin-type-comparison');
                    comparison.textContent = 'View type comparison';
                    comparison.dataset.image = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.id}/${coin.comparison}.png`;
                    comparison.dataset.name = `Type Comparison: ${coinVariant.name} - ${coin.year}${coin.mintMark ? `  (${coin.mintMark})` : ''}${coin.specification ? ` (${coin.specification})` : ''}`;

                    if (coin.specification) {
                        const specificationEditor = document.createElement('span');
                        specificationEditor.textContent = coin.specification;
                        specificationEditor.contentEditable = 'true';
                        specificationEditor.addEventListener('blur', async () => {
                            if (specificationEditor.textContent === (coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].specification || '')) return;

                            addChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins[coin.id], coinVariant.name, 'specification', { specification: specificationEditor.textContent as string });

                            coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].specification = specificationEditor.textContent || null;

                            await updateCoinData(coinType.id, coinVariant.id, coin.id, { specification: specificationEditor.textContent || null });
                        });
                        specification.appendChild(specificationEditor);
                        specification.appendChild(document.createTextNode(' '));
                        comparison.textContent = `(${comparison.textContent})`;
                        specification.appendChild(comparison);
                    } else specification.appendChild(comparison);
                }
                row.appendChild(specification);

                const obtained = document.createElement('td');
                const obtainedCheck = document.createElement('input');
                obtainedCheck.type = 'checkbox';
                obtainedCheck.checked = coin.obtained ?? false;
                obtainedCheck.addEventListener('change', async () => {
                    row.dataset.obtained = obtainedCheck.checked.toString();

                    addChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins[coin.id], coinVariant.name, 'obtained', { obtained: obtainedCheck.checked }, `was marked as ${obtainedCheck.checked ? 'obtained' : 'not obtained'}`);

                    coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].obtained = obtainedCheck.checked || null;

                    loadVariantTotals(coinType.id, coinVariant.id);

                    await updateCoinData(coinType.id, coinVariant.id, coin.id, { obtained: obtainedCheck.checked || null });

                    if (needsUpgradeCheck.checked) needsUpgradeCheck.click();

                    needsUpgradeCheck.disabled = !obtainedCheck.checked;
                });
                obtained.appendChild(obtainedCheck);
                row.appendChild(obtained);

                const needsUpgrade = document.createElement('td');
                const needsUpgradeCheck = document.createElement('input');
                needsUpgradeCheck.type = 'checkbox';
                needsUpgradeCheck.checked = coin.upgrade ?? false;
                needsUpgradeCheck.disabled = !coin.obtained;
                needsUpgradeCheck.addEventListener('change', async () => {
                    row.dataset.upgrade = needsUpgradeCheck.checked.toString();

                    addChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins[coin.id], coinVariant.name, 'upgrade', { upgrade: needsUpgradeCheck.checked }, `was marked as ${needsUpgradeCheck.checked ? 'needing an upgrade' : 'not needing an upgrade'}`);

                    coinsData[coinType.id].coins[coinVariant.id].coins[coin.id].upgrade = needsUpgradeCheck.checked || null;

                    loadVariantTotals(coinType.id, coinVariant.id);

                    await updateCoinData(coinType.id, coinVariant.id, coin.id, { upgrade: needsUpgradeCheck.checked || null });
                });
                needsUpgrade.appendChild(needsUpgradeCheck);
                row.appendChild(needsUpgrade);

                coinVariantTableBody.appendChild(row);
            });

            const newRowMessage = document.createElement('tr');
            newRowMessage.classList.add('new-row-message');

            const newRowMessageCell = document.createElement('td');
            newRowMessageCell.colSpan = 5;
            newRowMessageCell.textContent = 'Add new row';

            const plusIcon = document.createElement('i');
            plusIcon.classList.add('fa-solid', 'fa-plus');

            newRowMessageCell.prepend(plusIcon);

            newRowMessage.appendChild(newRowMessageCell);
            coinVariantTableBody.appendChild(newRowMessage);

            coinVariantTable.appendChild(coinVariantTableBody);

            coinVariantDiv.prepend(coinVariantImg);
            coinVariantDiv.appendChild(coinVariantButton);
            coinVariantDiv.appendChild(coinVariantTable);

            coinTypeDiv.appendChild(coinVariantDiv);
        });

        coinsList.appendChild(coinTypeDiv);
    });

    unindexedCoinsData.forEach((coinType) => coinType.coins.forEach((coinVariant) => loadVariantTotals(coinType.id, coinVariant.id)));

    loadPopupImages();
}

/**
 * Loads the coin variant totals for a given variant.
 * @param type The type to load the totals for.
 * @param variant The variant to load the totals for.
 */
function loadVariantTotals(type: string, variant: string) {
    const variantData = coinsData[type].coins[variant];

    const obtainedCoins = Object.values(variantData.coins).filter((coin) => coin.obtained).length;
    const needsUpgradeCoins = Object.values(variantData.coins).filter((coin) => coin.upgrade).length;
    const totalCoins = Object.values(variantData.coins).length;

    const amountTooltip = document.getElementById(`${variant}-amount-tooltip`) as HTMLSpanElement;
    const yearSpan = document.getElementById(`${variant}-years`) as HTMLSpanElement;
    const upgradeSpan = document.getElementById(`${variant}-needs-upgrade`) as HTMLSpanElement;

    amountTooltip.dataset.tooltip = `${Math.ceil((obtainedCoins / totalCoins) * 10000) / 100}% completed, ${totalCoins - obtainedCoins} missing`;
    amountTooltip.textContent = `${obtainedCoins}/${totalCoins}`;

    yearSpan.textContent = getCoinYears(variantData);

    upgradeSpan.textContent = needsUpgradeCoins > 0 ? `, ${needsUpgradeCoins} needing upgrade` : '';
}

/**
 * Gets the year range for a given coin variant.
 * @param variant The coin variant to get the year range for.
 */
function getCoinYears(variant: CoinVariantById): string {
    if (variant.years) return variant.years;

    const coinValues = Object.values(variant.coins);

    const startYear = coinValues[0].year as string;

    const endYear = variant.active ? 'date' : (coinValues[coinValues.length - 1].year as string);

    return startYear === endYear ? startYear : `${startYear}–${endYear}`;
}

type PartialNullable<T> = { [K in keyof T]?: T[K] | null };

/**
 * Updates the coin data in the database.
 * @param coinTypeId The type of the coin data to update.
 * @param coinVariantId The variant of the coin data to update.
 * @param coinId The ID of the coin data to update.
 * @param data The data to update.
 */
async function updateCoinData(coinTypeId: string, coinVariantId: string, coinId: string, data: PartialNullable<Coin>) {
    const editableElements = document.querySelectorAll('[contenteditable]') as NodeListOf<HTMLElement>;
    const checkboxes = document.querySelectorAll('td > input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    editableElements.forEach((element) => (element.contentEditable = 'false'));
    checkboxes.forEach((checkbox) => {
        if (checkbox.disabled) checkbox.dataset.disabled = 'true';
        checkbox.disabled = true;
    });
    const result = (await fetch('/coins-list-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coinTypeId, coinVariantId, coinId, data, password: passwordInput.dataset.input })
    })) as { error?: string };
    if (result.error) showAlert(result.error, 'error');
    else showAlert('Coin data updated successfully!', 'success');

    editableElements.forEach((element) => (element.contentEditable = 'true'));
    checkboxes.forEach((checkbox) => {
        if (checkbox.dataset.disabled !== 'true') checkbox.disabled = false;
        checkbox.removeAttribute('data-disabled');
    });
}

/**
 * Adds a given entry to the changes log.
 * @param coinData The coin data before the change.
 * @param variant The variant of the coin that was changed.
 * @param type The type of change that was made.
 * @param changes The changes that were made.
 * @param changeText The text to display for the change (if `changes` is not provided).
 */
function addChangeEntry(coinData: PartialNullable<Coin>, variant: string, type: string, changes?: PartialNullable<Coin>, changeText?: string) {
    const { year, mintMark, specification } = coinData as Coin;

    if (changeHistory.querySelectorAll('li').length === 0) changeHistory.innerHTML = '';

    const entry = document.createElement('li');
    entry.textContent = `${year}${mintMark ? ` ${mintMark}` : ''} ${variant}${specification ? ` (${specification})` : ''}${changeText ? ` ${changeText}` : coinData[Object.keys(changes as Coin)[0] as keyof Coin] ? `'s ${type} was changed from "${coinData[Object.keys(changes as Coin)[0] as keyof Coin] as string | boolean}" to "${Object.values(changes as Coin)[0] as string | boolean}"` : `'s ${type} was set to "${Object.values(changes as Coin)[0] as string | boolean}"`}`;

    const timeTooltip = document.createElement('span');
    timeTooltip.classList.add('time-tooltip');
    timeTooltip.dataset.tooltip = new Date().toLocaleString();

    const timeIcon = document.createElement('i');
    timeIcon.classList.add('fa-solid', 'fa-clock');

    timeTooltip.appendChild(timeIcon);

    entry.appendChild(timeTooltip);

    changeHistory.appendChild(entry);
}

const params = new URLSearchParams(window.location.search);
const password = params.get('password');

if (password) {
    const { success } = (await (await fetch(`/coins-login?password=${password}`)).json()) as { success: boolean };

    if (success) {
        passwordInput.dataset.input = password;
        passwordInput.disabled = true;
        loginButton.disabled = true;
        showAlert('Logged in!', 'success');
        showResult('login', 'success', undefined, undefined, false);

        loadCoinsList();
    } else {
        showAlert('Incorrect password!', 'error');
        showResult('login', 'error', undefined, undefined, false);
    }
}

/**
 * Adds modal functionality to all images with the "popup-image" class.
 */
function loadPopupImages() {
    const modal = document.getElementById('modal') as HTMLDivElement;
    const images = document.querySelectorAll('img.popup-image') as NodeListOf<HTMLImageElement>;
    const imageTextButtons = document.querySelectorAll('sup.coin-image-icon') as NodeListOf<HTMLElement>;
    const coinTypeComparisonButtons = document.querySelectorAll('span.coin-type-comparison') as NodeListOf<HTMLSpanElement>;
    const modalImage = document.getElementById('modal-image') as HTMLImageElement;
    const modalCaption = document.getElementById('modal-caption') as HTMLDivElement;
    const closeButton = document.getElementById('close-modal') as HTMLSpanElement;

    for (const image of images)
        image.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== image.src) modalImage.src = image.src;
            if (modalCaption.textContent !== image.alt) modalCaption.textContent = image.alt;
        });

    for (const imageTextButton of imageTextButtons)
        imageTextButton.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== imageTextButton.dataset.image) modalImage.src = imageTextButton.dataset.image as string;
            if (modalCaption.textContent !== imageTextButton.dataset.name) modalCaption.textContent = imageTextButton.dataset.name as string;
        });

    for (const coinTypeComparisonButton of coinTypeComparisonButtons)
        coinTypeComparisonButton.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== coinTypeComparisonButton.dataset.image) modalImage.src = coinTypeComparisonButton.dataset.image as string;
            if (modalCaption.textContent !== coinTypeComparisonButton.dataset.name) modalCaption.textContent = coinTypeComparisonButton.dataset.name as string;
        });

    [closeButton, modal].forEach((element) => {
        element.addEventListener('click', () => (modal.style.display = 'none'));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') modal.style.display = 'none';
    });
}

exportDataButton.addEventListener('click', async () => {
    const coinsData = (await (await fetch(`/coins-list?password=${passwordInput.dataset.input as string}`)).json()) as CoinType[] & { error?: string };

    if (coinsData.error) return showAlert(coinsData.error, 'error');

    const file = new Blob([JSON.stringify(coinsData)], { type: 'application/json' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = 'coins-data.json';
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 0);
});
