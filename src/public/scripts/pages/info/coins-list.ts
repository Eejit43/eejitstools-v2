import { Coin, CoinType, ParsedCoinType, ParsedCoinVariant } from '../../../data/coins-data.js';
import { showAlert, showResult } from '../../functions.js';

const passwordInput = document.querySelector('#login-password') as HTMLInputElement;
const loginButton = document.querySelector('#login-button') as HTMLButtonElement;
const coinsList = document.querySelector('#coins-list') as HTMLDivElement;
const changeHistory = document.querySelector('#change-history') as HTMLUListElement;
const exportDataButton = document.querySelector('#export-data') as HTMLButtonElement;

for (const type of ['input', 'paste'])
    passwordInput.addEventListener(type, () => {
        passwordInput.value = passwordInput.value.replaceAll(/\D/g, '');

        if (passwordInput.value.length > 4) passwordInput.value = passwordInput.value.slice(0, 4);
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
        showResult(loginButton, 'success', false);

        loadCoinsList();

        exportDataButton.disabled = false;
    } else {
        showAlert('Incorrect password!', 'error');
        showResult(loginButton, 'error', false);
        loginButton.disabled = true;
        setTimeout(() => (loginButton.disabled = false), 1000);
    }
});

const mintMarks: Record<string, string> = {
    P: 'Philadelphia (Pennsylvania)',
    D: 'Denver (Colorado)',
    S: 'San Francisco (California)',
    W: 'West Point (New York)',
    CC: 'Carson City (Nevada)',
    C: 'Charlotte (North Carolina)',
};

type PartialNullable<T> = { [K in keyof T]?: T[K] | null };

interface CoinVariantById {
    name: string;
    id: string;
    note?: string;
    years?: string;
    active?: true;
    coins: Map<string, PartialNullable<Coin>>;
}

let coinsData: Record<string, { name: string; id: string; coins: Record<string, CoinVariantById> }>;

/**
 * Load the coins list.
 */
async function loadCoinsList() {
    const unindexedCoinsData = (await (await fetch(`/coins-list?password=${passwordInput.dataset.input!}`)).json()) as ParsedCoinType[];

    coinsData = Object.fromEntries(
        unindexedCoinsData.map((coinType) => [
            coinType.id,
            {
                ...coinType,
                coins: Object.fromEntries(coinType.coins.map((coinVariant) => [coinVariant.id, { ...coinVariant, coins: new Map(coinVariant.coins.map((coin) => [coin.id.toString(), coin])) }])),
            },
        ]),
    );

    coinsList.innerHTML = '';
    coinsList.classList.add('obtained-hidden');

    const buttonsDiv = document.createElement('div');
    buttonsDiv.id = 'toggle-buttons';

    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload';
    reloadButton.dataset.iconAfter = '\uF2F9';
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

        timeTooltip.append(timeIcon);

        historyEntry.append(timeTooltip);

        changeHistory.append(historyEntry);
    });

    const showAllVariantsButton = document.createElement('button');
    showAllVariantsButton.textContent = 'Show all variants';
    showAllVariantsButton.dataset.expanded = 'false';
    showAllVariantsButton.addEventListener('click', () => {
        if (showAllVariantsButton.dataset.expanded === 'true') {
            showAllVariantsButton.dataset.expanded = 'false';
            showAllVariantsButton.textContent = 'Show all variants';
            for (const button of document.querySelectorAll('.coin-type-expand') as NodeListOf<HTMLButtonElement>) if (button.dataset.expanded === 'true') button.click();
        } else {
            showAllVariantsButton.dataset.expanded = 'true';
            showAllVariantsButton.textContent = 'Hide all variants';
            for (const button of document.querySelectorAll('.coin-type-expand') as NodeListOf<HTMLButtonElement>) if (button.dataset.expanded === 'false') button.click();
        }
    });

    const toggleMissingCoinsButton = document.createElement('button');
    toggleMissingCoinsButton.id = 'toggle-missing-coins';
    toggleMissingCoinsButton.dataset.shown = 'true';
    toggleMissingCoinsButton.addEventListener('click', () => {
        if (toggleMissingCoinsButton.dataset.shown === 'true') {
            toggleMissingCoinsButton.dataset.shown = 'false';
            coinsList.classList.add('missing-hidden');

            toggleMissingCoinsButton.innerHTML = '';
            toggleMissingCoinsButton.append('Show ', missingText, ' coins');
        } else {
            toggleMissingCoinsButton.dataset.shown = 'true';
            coinsList.classList.remove('missing-hidden');

            toggleMissingCoinsButton.innerHTML = '';
            toggleMissingCoinsButton.append('Hide ', missingText, ' coins');
        }
    });

    const missingText = document.createElement('span');
    missingText.id = 'missing-text';
    missingText.textContent = 'missing';

    toggleMissingCoinsButton.append('Hide ', missingText, ' coins');

    const toggleObtainedCoinsButton = document.createElement('button');
    toggleObtainedCoinsButton.id = 'toggle-obtained-coins';
    toggleObtainedCoinsButton.dataset.shown = 'false';
    toggleObtainedCoinsButton.addEventListener('click', () => {
        if (toggleObtainedCoinsButton.dataset.shown === 'true') {
            toggleObtainedCoinsButton.dataset.shown = 'false';
            coinsList.classList.add('obtained-hidden');

            toggleObtainedCoinsButton.innerHTML = '';
            toggleObtainedCoinsButton.append('Show ', obtainedText, ' coins');
        } else {
            toggleObtainedCoinsButton.dataset.shown = 'true';
            coinsList.classList.remove('obtained-hidden');

            toggleObtainedCoinsButton.innerHTML = '';
            toggleObtainedCoinsButton.append('Hide ', obtainedText, ' coins');
        }
    });

    const obtainedText = document.createElement('span');
    obtainedText.id = 'obtained-text';
    obtainedText.textContent = 'obtained';

    toggleObtainedCoinsButton.append('Show ', obtainedText, ' coins');

    const toggleNeedsUpgradeCoinsButton = document.createElement('button');
    toggleNeedsUpgradeCoinsButton.id = 'toggle-needs-upgrade-coins';
    toggleNeedsUpgradeCoinsButton.dataset.shown = 'true';
    toggleNeedsUpgradeCoinsButton.addEventListener('click', () => {
        if (toggleNeedsUpgradeCoinsButton.dataset.shown === 'true') {
            toggleNeedsUpgradeCoinsButton.dataset.shown = 'false';
            coinsList.classList.add('upgrade-hidden');

            toggleNeedsUpgradeCoinsButton.innerHTML = '';
            toggleNeedsUpgradeCoinsButton.append('Show coins ', needingUpgradeText);
        } else {
            toggleNeedsUpgradeCoinsButton.dataset.shown = 'true';
            coinsList.classList.remove('upgrade-hidden');

            toggleNeedsUpgradeCoinsButton.innerHTML = '';
            toggleNeedsUpgradeCoinsButton.append('Hide coins ', needingUpgradeText);
        }
    });

    const needingUpgradeText = document.createElement('span');
    needingUpgradeText.id = 'needing-upgrade-text';
    needingUpgradeText.textContent = 'needing upgrade';

    toggleNeedsUpgradeCoinsButton.append('Hide coins ', needingUpgradeText);

    buttonsDiv.append(reloadButton);
    buttonsDiv.append(showAllVariantsButton);
    buttonsDiv.append(document.createTextNode(' | '));
    buttonsDiv.append(toggleMissingCoinsButton);
    buttonsDiv.append(toggleObtainedCoinsButton);
    buttonsDiv.append(toggleNeedsUpgradeCoinsButton);

    coinsList.append(buttonsDiv);

    document.addEventListener('keydown', (event) => {
        if (!event.altKey) return;
        if (
            document.activeElement &&
            (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || (document.activeElement as HTMLElement).contentEditable === 'true')
        )
            return;

        switch (event.code) {
            case 'KeyR': {
                reloadButton.click();
                break;
            }
            case 'KeyA': {
                showAllVariantsButton.click();
                break;
            }
            case 'KeyM': {
                toggleMissingCoinsButton.click();
                break;
            }
            case 'KeyO': {
                toggleObtainedCoinsButton.click();
                break;
            }
            case 'KeyU': {
                toggleNeedsUpgradeCoinsButton.click();
                break;
            }
        }
    });

    for (const coinType of unindexedCoinsData) {
        const coinTypeDiv = document.createElement('div');
        coinTypeDiv.classList.add('coin-type');
        coinTypeDiv.textContent = coinType.name;

        const coinTypeImg = document.createElement('img');
        coinTypeImg.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${
            coinType.coins.at(-1)?.id ? `${coinType.id}/${coinType.coins.at(-1)?.id}` : 'default'
        }.png`;
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
                for (const variant of coinTypeDiv.querySelectorAll('.coin-variant')) variant.classList.add('hidden');
            } else {
                coinTypeButton.dataset.expanded = 'true';
                coinTypeButton.textContent = 'Hide variants';
                for (const variant of coinTypeDiv.querySelectorAll('.coin-variant')) variant.classList.remove('hidden');
            }
        });

        coinTypeDiv.prepend(coinTypeImg);
        coinTypeDiv.append(coinTypeButton);

        for (const coinVariant of coinType.coins) {
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

                coinVariantDiv.append(coinVariantNote);
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

            for (const header of ['Year', 'Mint Mark', 'Mintage', 'Specification/Notes', 'Obtained', 'Needs Upgrade']) {
                const infoHeader = document.createElement('th');
                infoHeader.textContent = header;
                coinVariantTableHeadRow.append(infoHeader);
            }

            coinVariantTableHead.append(coinVariantTableHeadRow);
            coinVariantTable.append(coinVariantTableHead);

            const coinVariantTableBody = document.createElement('tbody');

            for (const coin of coinVariant.coins) {
                const row = generateCoinRow(coinType, coinVariant, coin);

                coinVariantTableBody.append(row);
            }

            const newRowMessage = document.createElement('tr');
            newRowMessage.classList.add('new-row-message');

            const newRowMessageCell = document.createElement('td');
            newRowMessageCell.colSpan = 6;
            newRowMessageCell.textContent = 'Add new row';
            newRowMessageCell.addEventListener('click', async () => {
                if (newRowMessage.dataset.disabled === 'true') return;

                const coinVariantCoins = [...coinsData[coinType.id].coins[coinVariant.id].coins.values()];

                const year = coinVariantCoins.at(-1)?.year ? (Number.parseInt(coinVariantCoins.at(-1)!.year!) + 1).toString() : new Date().getFullYear().toString();
                const id = Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000).toString();

                const row = generateCoinRow(coinType, coinVariant, { year, id, obtained: false });
                newRowMessage.before(row);

                coinsData[coinType.id].coins[coinVariant.id].coins.set(id.toString(), { year, id, obtained: false });

                loadVariantTotals(coinType.id, coinVariant.id);

                addCoinChangeEntry({ year }, coinVariant.name, undefined, undefined, 'was created!');

                await addCoin(coinType.id, coinVariant.id, year, id);
            });

            const plusIcon = document.createElement('i');
            plusIcon.classList.add('fa-solid', 'fa-plus');

            newRowMessageCell.prepend(plusIcon);

            newRowMessage.append(newRowMessageCell);
            coinVariantTableBody.append(newRowMessage);

            coinVariantTable.append(coinVariantTableBody);

            coinVariantDiv.prepend(coinVariantImg);
            coinVariantDiv.append(coinVariantButton);
            coinVariantDiv.append(coinVariantTable);

            coinTypeDiv.append(coinVariantDiv);
        }

        coinsList.append(coinTypeDiv);
    }

    for (const coinType of unindexedCoinsData) for (const coinVariant of coinType.coins) loadVariantTotals(coinType.id, coinVariant.id);

    loadPopupImages();

    // Strip newlines and formatting from contenteditable element interactions
    for (const element of document.querySelectorAll('#coins-list [contenteditable]') as NodeListOf<HTMLElement>) {
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') event.preventDefault();
        });

        element.addEventListener('paste', (event) => {
            event.preventDefault();

            const text = event.clipboardData!.getData('text/plain').replaceAll(/\r?\n|\r/g, '');

            const range = document.getSelection()!.getRangeAt(0);
            range.deleteContents();

            const textNode = document.createTextNode(text);
            range.insertNode(textNode);
            range.selectNodeContents(textNode);
            range.collapse(false);

            const selection = window.getSelection()!;
            selection.removeAllRanges();
            selection.addRange(range);
        });
    }
}

/**
 * Generates a coin row for a given coin.
 * @param coinType The coin type to generate the coin row for.
 * @param coinVariant The coin variant to generate the coin row for.
 * @param coin The coin to generate the coin row for.
 */
function generateCoinRow(coinType: ParsedCoinType, coinVariant: ParsedCoinVariant, coin: Coin) {
    const row = document.createElement('tr');
    row.dataset.id = coin.id.toString();
    row.dataset.obtained = (coin.obtained ?? false).toString();
    row.dataset.upgrade = (coin.upgrade ?? false).toString();

    const year = document.createElement('td');

    const yearEditor = document.createElement('span');
    yearEditor.textContent = coin.year;
    yearEditor.contentEditable = 'true';
    yearEditor.addEventListener('blur', async () => {
        const newValue = yearEditor.textContent! || 'UNKNOWN';
        if (newValue === coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.year) return;

        addCoinChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!, coinVariant.name, 'year', { year: newValue });

        coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.year = newValue;

        loadVariantTotals(coinType.id, coinVariant.id);

        await updateCoinData(coinType.id, coinVariant.id, coin.id, { year: newValue });
    });
    year.append(yearEditor);

    if (coin.image) {
        const image = document.createElement('sup');
        image.classList.add('coin-image-icon', 'fa-solid', 'fa-image');
        image.dataset.image = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.id}/${coin.image}.png`;
        image.dataset.name = `${coinVariant.name} - ${coin.year}${coin.mintMark ? `  (${coin.mintMark})` : ''}${coin.specification ? ` (${coin.specification})` : ''}`;
        year.append(image);
    }

    row.append(year);

    const mintMark = document.createElement('td');
    const tooltip = document.createElement('span');
    tooltip.classList.add('tooltip-bottom');
    tooltip.dataset.tooltip = coin.mintMark ? (coin.mintMark in mintMarks ? `Minted in ${mintMarks[coin.mintMark]}` : 'Unknown') : `Likely minted in ${mintMarks.P}`;
    tooltip.textContent = coin.mintMark ?? 'None';
    tooltip.contentEditable = 'true';
    tooltip.addEventListener('focus', () => {
        delete tooltip.dataset.tooltip;
        tooltip.classList.remove('tooltip-bottom');
    });
    tooltip.addEventListener('blur', async () => {
        if (!tooltip.textContent) tooltip.textContent = 'None';
        tooltip.dataset.tooltip =
            tooltip.textContent.toLowerCase() === 'none'
                ? `Likely minted in ${mintMarks.P}`
                : tooltip.textContent.toUpperCase() in mintMarks
                ? `Minted in ${mintMarks[tooltip.textContent]}`
                : 'Unknown';
        tooltip.textContent = tooltip.textContent.toLowerCase() === 'none' ? 'None' : tooltip.textContent.toUpperCase();
        tooltip.classList.add('tooltip-bottom');

        const newValue = tooltip.textContent && tooltip.textContent !== 'None' ? tooltip.textContent : null;

        if (tooltip.textContent === (coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.mintMark ?? 'None')) return;

        addCoinChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!, coinVariant.name, 'mint mark', { mintMark: tooltip.textContent });

        coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.mintMark = newValue;

        await updateCoinData(coinType.id, coinVariant.id, coin.id, { mintMark: newValue });
    });
    mintMark.append(tooltip);
    row.append(mintMark);

    const mintage = document.createElement('td');
    mintage.contentEditable = 'true';
    mintage.textContent = coin.mintage ? formatMintage(coin.mintage) : '???';
    if (coin.mintageForAllVarieties) mintage.classList.add('mintage-for-all-varieties');
    mintage.addEventListener('focus', () => {
        mintage.textContent = coin.mintage?.toString() ?? '';
        if (coin.mintageForAllVarieties) mintage.textContent += ' (all)';
        mintage.classList.remove('mintage-for-all-varieties');
    });
    mintage.addEventListener('blur', async () => {
        const mintageNumber = mintage.textContent ? Number.parseInt(mintage.textContent.replaceAll(',', '').replace(/ (all)$/, '')) : null;
        let mintageForAllVarieties: boolean | null | undefined = mintage.textContent?.endsWith(' (all)');
        if (!mintageForAllVarieties) mintageForAllVarieties = null;

        mintage.textContent = mintageNumber ? formatMintage(mintageNumber) : '???';
        if (mintageForAllVarieties) mintage.classList.add('mintage-for-all-varieties');

        if ((mintageNumber ?? '') !== (coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.mintage ?? '')) {
            addCoinChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!, coinVariant.name, 'mintage', { mintage: mintageNumber });

            coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.mintage = mintageNumber;

            await updateCoinData(coinType.id, coinVariant.id, coin.id, { mintage: mintageNumber });
        }

        if (mintageForAllVarieties !== (coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.mintageForAllVarieties ?? null)) {
            addCoinChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!, coinVariant.name, 'mintage "for all varieties"', {
                mintageForAllVarieties: mintageForAllVarieties ?? false,
            });

            coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.mintageForAllVarieties = mintageForAllVarieties;

            await updateCoinData(coinType.id, coinVariant.id, coin.id, { mintageForAllVarieties });
        }
    });

    row.append(mintage);

    const specification = document.createElement('td');
    if (!coin.comparison) {
        specification.contentEditable = 'true';
        specification.textContent = coin.specification ?? '';
        specification.addEventListener('blur', async () => {
            if (specification.textContent === (coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.specification ?? '')) return;

            addCoinChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!, coinVariant.name, 'specification', { specification: specification.textContent });

            coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.specification = specification.textContent! || null;

            await updateCoinData(coinType.id, coinVariant.id, coin.id, { specification: specification.textContent! || null });
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
                if (specificationEditor.textContent === (coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.specification ?? '')) return;

                addCoinChangeEntry(coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!, coinVariant.name, 'specification', { specification: specificationEditor.textContent! });

                coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.specification = specificationEditor.textContent! || null;

                await updateCoinData(coinType.id, coinVariant.id, coin.id, { specification: specificationEditor.textContent! || null });
            });
            specification.append(specificationEditor);
            specification.append(document.createTextNode(' '));
            comparison.textContent = `(${comparison.textContent})`;
            specification.append(comparison);
        } else specification.append(comparison);
    }
    row.append(specification);

    const obtained = document.createElement('td');
    const obtainedCheck = document.createElement('input');
    obtainedCheck.type = 'checkbox';
    obtainedCheck.checked = coin.obtained ?? false;
    obtainedCheck.addEventListener('change', async () => {
        row.dataset.obtained = obtainedCheck.checked.toString();

        addCoinChangeEntry(
            coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!,
            coinVariant.name,
            'obtained',
            { obtained: obtainedCheck.checked },
            `was marked as ${obtainedCheck.checked ? 'obtained' : 'not obtained'}`,
        );

        coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.obtained = obtainedCheck.checked || null;

        loadVariantTotals(coinType.id, coinVariant.id);

        await updateCoinData(coinType.id, coinVariant.id, coin.id, { obtained: obtainedCheck.checked || null });

        if (!obtainedCheck.checked && needsUpgradeCheck.checked) needsUpgradeCheck.click();
    });
    obtained.append(obtainedCheck);
    row.append(obtained);

    const needsUpgrade = document.createElement('td');
    const needsUpgradeCheck = document.createElement('input');
    needsUpgradeCheck.type = 'checkbox';
    needsUpgradeCheck.checked = coin.upgrade ?? false;
    needsUpgradeCheck.addEventListener('change', async () => {
        row.dataset.upgrade = needsUpgradeCheck.checked.toString();

        addCoinChangeEntry(
            coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!,
            coinVariant.name,
            'upgrade',
            { upgrade: needsUpgradeCheck.checked },
            `was marked as ${needsUpgradeCheck.checked ? 'needing an upgrade' : 'not needing an upgrade'}`,
        );

        coinsData[coinType.id].coins[coinVariant.id].coins.get(coin.id)!.upgrade = needsUpgradeCheck.checked || null;

        loadVariantTotals(coinType.id, coinVariant.id);

        await updateCoinData(coinType.id, coinVariant.id, coin.id, { upgrade: needsUpgradeCheck.checked || null });

        if (needsUpgradeCheck.checked && !obtainedCheck.checked) obtainedCheck.click();
    });
    needsUpgrade.append(needsUpgradeCheck);
    row.append(needsUpgrade);

    return row;
}

/**
 * Loads the coin variant totals for a given variant.
 * @param type The type to load the totals for.
 * @param variant The variant to load the totals for.
 */
function loadVariantTotals(type: string, variant: string) {
    const variantData = coinsData[type].coins[variant];

    const obtainedCoins = [...variantData.coins.values()].filter((coin) => coin.obtained).length;
    const needsUpgradeCoins = [...variantData.coins.values()].filter((coin) => coin.upgrade).length;
    const totalCoins = [...variantData.coins.values()].length;

    const amountTooltip = document.querySelector(`#${variant}-amount-tooltip`) as HTMLSpanElement;
    const yearSpan = document.querySelector(`#${variant}-years`) as HTMLSpanElement;
    const upgradeSpan = document.querySelector(`#${variant}-needs-upgrade`) as HTMLSpanElement;

    amountTooltip.dataset.tooltip = `${Math.ceil((obtainedCoins / totalCoins) * 10_000) / 100}% completed, ${totalCoins - obtainedCoins} missing`;
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

    const coinValues = [...variant.coins];

    const startYear = coinValues.at(0)![1].year!;

    const endYear = variant.active ? 'date' : coinValues.at(-1)![1].year!;

    return startYear === endYear ? startYear : `${startYear}–${endYear}`;
}

/**
 * Formats a mintage number to a cleaner representation (number rounded to 2 decimal places).
 * @param mintage The mintage number to format.
 */
function formatMintage(mintage: number) {
    if (mintage >= 1_000_000_000) return `${Math.round((mintage / 1_000_000_000 + Number.EPSILON) * 100) / 100} billion`;
    if (mintage >= 1_000_000) return `${Math.round((mintage / 1_000_000 + Number.EPSILON) * 100) / 100} million`;
    if (mintage >= 1000) return `${Math.round((mintage / 1000 + Number.EPSILON) * 100) / 100} thousand`;
    return mintage.toString();
}

/**
 * Updates the coin data in the database.
 * @param coinTypeId The type of the coin data to update.
 * @param coinVariantId The variant of the coin data to update.
 * @param coinId The ID of the coin data to update.
 * @param data The data to update.
 */
async function updateCoinData(coinTypeId: string, coinVariantId: string, coinId: string, data: PartialNullable<Coin>) {
    const result = (await fetch('/coins-list-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coinTypeId, coinVariantId, coinId, data, password: passwordInput.dataset.input }),
    })) as { error?: string };

    if (result.error) showAlert(result.error, 'error');
    else showAlert('Coin data updated successfully!', 'success');
}

/**
 * Adds a new coin to a coin variant in the database.
 * @param coinTypeId The coin type to add the coin to.
 * @param coinVariantId The coin variant to add the coin to.
 * @param coinYear The year of the coin to add.
 * @param coinId The id of the coin to add.
 */
async function addCoin(coinTypeId: string, coinVariantId: string, coinYear: string, coinId: string) {
    const result = (await fetch('/coins-list-add-coin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coinTypeId, coinVariantId, coinYear, coinId, password: passwordInput.dataset.input }),
    })) as { error?: string };

    if (result.error) showAlert(result.error, 'error');
    else showAlert('Successfully added a new coin row!', 'success');
}

/**
 * Adds a given coin update entry to the changes log.
 * @param coinData The coin data before the change.
 * @param variant The variant of the coin that was changed.
 * @param type The type of change that was made.
 * @param changes The changes that were made.
 * @param changeText The text to display for the change (if `changes` is not provided).
 */
function addCoinChangeEntry(coinData: PartialNullable<Coin>, variant: string, type?: string, changes?: PartialNullable<Coin>, changeText?: string) {
    const { year, mintMark, specification } = coinData as Coin;

    if (changeHistory.querySelectorAll('li').length === 0) changeHistory.innerHTML = '';

    const entry = document.createElement('li');
    entry.textContent = `${year}${mintMark ? ` ${mintMark}` : ''} ${variant}${specification ? ` (${specification})` : ''}${
        changeText
            ? ` ${changeText}`
            : coinData[Object.keys(changes as Coin)[0] as keyof Coin]
            ? `'s ${type} was changed from "${coinData[Object.keys(changes as Coin)[0] as keyof Coin]!}" to "${Object.values(changes as Coin)[0] as string | boolean}"`
            : `'s ${type} was set to "${Object.values(changes as Coin)[0] as string | boolean}"`
    }`;

    const timeTooltip = document.createElement('span');
    timeTooltip.classList.add('time-tooltip');
    timeTooltip.dataset.tooltip = new Date().toLocaleString();

    const timeIcon = document.createElement('i');
    timeIcon.classList.add('fa-solid', 'fa-clock');

    timeTooltip.append(timeIcon);

    entry.append(timeTooltip);

    changeHistory.append(entry);
}

const parameters = new URLSearchParams(window.location.search);
const password = parameters.get('password');

if (password) {
    const { success } = (await (await fetch(`/coins-login?password=${password}`)).json()) as { success: boolean };

    if (success) {
        passwordInput.dataset.input = password;
        passwordInput.disabled = true;
        loginButton.disabled = true;
        showAlert('Logged in!', 'success');
        showResult(loginButton, 'success', false);

        await loadCoinsList();

        exportDataButton.disabled = false;
    } else {
        showAlert('Incorrect password!', 'error');
        showResult(loginButton, 'error', false);
    }
}

/**
 * Adds modal functionality to all images with the "popup-image" class.
 */
function loadPopupImages() {
    const modal = document.querySelector('#modal') as HTMLDivElement;
    const images = document.querySelectorAll('img.popup-image') as NodeListOf<HTMLImageElement>;
    const imageTextButtons = document.querySelectorAll('sup.coin-image-icon') as NodeListOf<HTMLElement>;
    const coinTypeComparisonButtons = document.querySelectorAll('span.coin-type-comparison') as NodeListOf<HTMLSpanElement>;
    const modalImage = document.querySelector('#modal-image') as HTMLImageElement;
    const modalCaption = document.querySelector('#modal-caption') as HTMLDivElement;
    const closeButton = document.querySelector('#close-modal') as HTMLSpanElement;

    for (const image of images)
        image.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== image.src) modalImage.src = image.src;
            if (modalCaption.textContent !== image.alt) modalCaption.textContent = image.alt;
        });

    for (const imageTextButton of imageTextButtons)
        imageTextButton.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== imageTextButton.dataset.image) modalImage.src = imageTextButton.dataset.image!;
            if (modalCaption.textContent !== imageTextButton.dataset.name) modalCaption.textContent = imageTextButton.dataset.name!;
        });

    for (const coinTypeComparisonButton of coinTypeComparisonButtons)
        coinTypeComparisonButton.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== coinTypeComparisonButton.dataset.image) modalImage.src = coinTypeComparisonButton.dataset.image!;
            if (modalCaption.textContent !== coinTypeComparisonButton.dataset.name) modalCaption.textContent = coinTypeComparisonButton.dataset.name!;
        });

    for (const element of [closeButton, modal]) element.addEventListener('click', () => (modal.style.display = 'none'));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') modal.style.display = 'none';
    });
}

exportDataButton.addEventListener('click', async () => {
    const coinsData = (await (await fetch(`/coins-list?password=${passwordInput.dataset.input!}`)).json()) as CoinType[] & { error?: string };

    if (coinsData.error) return showAlert(coinsData.error, 'error');

    const file = new Blob([JSON.stringify(coinsData)], { type: 'application/json' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = `coins-list data (${new Date().toLocaleString()}).json`;
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 0);
});
