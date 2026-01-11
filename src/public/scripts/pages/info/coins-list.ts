import type { Coin, CoinDenomination, CoinDesign } from '@route-handlers/coins-list.js';
import { loadPopupImages, showAlert, showResult } from '@scripts/functions.js';

const passwordInput = document.querySelector<HTMLInputElement>('#login-password')!;
const loginButton = document.querySelector<HTMLButtonElement>('#login-button')!;
const coinsList = document.querySelector<HTMLDivElement>('#coins-list')!;
const changeHistory = document.querySelector<HTMLUListElement>('#change-history')!;
const exportDataButton = document.querySelector<HTMLButtonElement>('#export-data')!;
const generateNeededListButton = document.querySelector<HTMLButtonElement>('#generate-needed-list')!;
const generateSimplifiedNeededListButton = document.querySelector<HTMLButtonElement>('#generate-simplified-needed-list')!;
const neededListModal = document.querySelector<HTMLDivElement>('#needed-list-modal')!;
const closeNeededListModalButton = document.querySelector<HTMLSpanElement>('#close-needed-list-modal')!;
const neededListModalContent = document.querySelector<HTMLDivElement>('#needed-list-modal-content')!;

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

        await loadCoinsList();

        exportDataButton.disabled = false;
        generateNeededListButton.disabled = false;
        generateSimplifiedNeededListButton.disabled = false;
    } else {
        showAlert('Incorrect password!', 'error');
        showResult(loginButton, 'error');
        loginButton.disabled = true;
        setTimeout(() => (loginButton.disabled = false), 1000);
    }
});

const mintMarks: Record<string, string> = {
    P: 'Philadelphia (Pennsylvania)',
    D: 'Denver (Colorado)',
    S: 'San Francisco (California)',
    O: 'New Orleans (Louisiana)',
    W: 'West Point (New York)',
    CC: 'Carson City (Nevada)',
    C: 'Charlotte (North Carolina)',
};

type PartialNullable<T> = { [K in keyof T]?: T[K] | null };

interface CoinDesignById {
    name: string;
    id: string;
    note?: string;
    years?: string;
    active?: true;
    coins: Map<string, PartialNullable<Coin>>;
}

let coinsData: Record<string, { name: string; id: string; designs: Record<string, CoinDesignById> }>;

/**
 * Load the coins list.
 */
async function loadCoinsList() {
    const unindexedCoinsData = (await (await fetch(`/coins-list?password=${passwordInput.dataset.input!}`)).json()) as CoinDenomination<
        CoinDesign<Coin>
    >[];

    coinsData = Object.fromEntries(
        unindexedCoinsData.map((denomination) => [
            denomination.id,
            {
                ...denomination,
                designs: Object.fromEntries(
                    denomination.designs.map((design) => [
                        design.id,
                        { ...design, coins: new Map(design.coins.map((coin) => [coin.id, coin])) },
                    ]),
                ),
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

    const showAllDesignsButton = document.createElement('button');
    showAllDesignsButton.textContent = 'Show all designs';
    showAllDesignsButton.dataset.expanded = 'false';
    showAllDesignsButton.addEventListener('click', () => {
        if (showAllDesignsButton.dataset.expanded === 'true') {
            showAllDesignsButton.dataset.expanded = 'false';
            showAllDesignsButton.textContent = 'Show all designs';
            for (const button of document.querySelectorAll<HTMLButtonElement>('.coin-denomination-expand'))
                if (button.dataset.expanded === 'true') button.click();
        } else {
            showAllDesignsButton.dataset.expanded = 'true';
            showAllDesignsButton.textContent = 'Hide all designs';
            for (const button of document.querySelectorAll<HTMLButtonElement>('.coin-denomination-expand'))
                if (button.dataset.expanded === 'false') button.click();
        }
    });

    const toggleUnobtainedSectionsButton = document.createElement('button');
    toggleUnobtainedSectionsButton.textContent = 'Show unobtained denominations/designs';
    toggleUnobtainedSectionsButton.dataset.shown = 'true';
    coinsList.classList.add('unobtained-sections-hidden');
    toggleUnobtainedSectionsButton.addEventListener('click', () => {
        if (toggleUnobtainedSectionsButton.dataset.shown === 'true') {
            toggleUnobtainedSectionsButton.dataset.shown = 'false';
            coinsList.classList.remove('unobtained-sections-hidden');

            toggleUnobtainedSectionsButton.textContent = 'Hide unobtained denominations/designs';
        } else {
            toggleUnobtainedSectionsButton.dataset.shown = 'true';
            coinsList.classList.add('unobtained-sections-hidden');

            toggleUnobtainedSectionsButton.textContent = 'Show unobtained denominations/designs';
        }
    });

    const toggleMissingCoinsButton = document.createElement('button');
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

    buttonsDiv.append(
        reloadButton,
        showAllDesignsButton,
        ' | ',
        toggleUnobtainedSectionsButton,
        ' | ',
        toggleMissingCoinsButton,
        toggleObtainedCoinsButton,
        toggleNeedsUpgradeCoinsButton,
    );

    coinsList.append(buttonsDiv);

    document.addEventListener('keydown', (event) => {
        if (!event.altKey) return;
        if (
            document.activeElement &&
            (document.activeElement.tagName === 'INPUT' ||
                document.activeElement.tagName === 'TEXTAREA' ||
                (document.activeElement as HTMLElement).contentEditable === 'plaintext-only')
        )
            return;

        switch (event.code) {
            case 'KeyR': {
                reloadButton.click();
                break;
            }
            case 'KeyA': {
                showAllDesignsButton.click();
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

    for (const denomination of unindexedCoinsData) {
        const coinDenominationDiv = document.createElement('div');
        coinDenominationDiv.classList.add('coin-denomination');
        if (denomination.designs.every((design) => design.coins.every((coin) => !coin.obtained)))
            coinDenominationDiv.dataset.noneObtained = 'true';
        coinDenominationDiv.textContent = denomination.name;

        const lastCoinDesign = denomination.designs.at(-1)!;

        const coinDenominationImage = document.createElement('img');
        coinDenominationImage.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${denomination.id}/designs/${lastCoinDesign.id}.png`;
        coinDenominationImage.classList.add('coin-denomination-image', 'popup-image');
        coinDenominationImage.alt = lastCoinDesign.name;

        const showDesignsButton = document.createElement('button');
        showDesignsButton.classList.add('coin-denomination-expand');
        showDesignsButton.textContent = 'Show designs';
        showDesignsButton.dataset.expanded = 'false';
        showDesignsButton.addEventListener('click', () => {
            if (showDesignsButton.dataset.expanded === 'true') {
                showDesignsButton.dataset.expanded = 'false';
                showDesignsButton.textContent = 'Show designs';
                for (const design of coinDenominationDiv.querySelectorAll('.coin-design')) design.classList.add('hidden');
            } else {
                showDesignsButton.dataset.expanded = 'true';
                showDesignsButton.textContent = 'Hide designs';
                for (const design of coinDenominationDiv.querySelectorAll('.coin-design')) design.classList.remove('hidden');
            }
        });

        coinDenominationDiv.prepend(coinDenominationImage);
        coinDenominationDiv.append(showDesignsButton);

        for (const design of denomination.designs) {
            const coinDesignDiv = document.createElement('div');
            coinDesignDiv.classList.add('coin-design', 'hidden');
            if (design.coins.every((coin) => !coin.obtained)) {
                coinDesignDiv.dataset.noneObtained = 'true';
                if (design.active || Number.parseInt(design.coins.at(-1)!.year) >= new Date().getFullYear() - 5)
                    coinDesignDiv.dataset.noneObtainedOverride = 'true';
            }

            const coinDesignLink = document.createElement('a');
            coinDesignLink.textContent = design.name;
            coinDesignLink.href = `/info/coins-info?denomination=${denomination.id}&design=${design.id}`;
            coinDesignLink.target = '_blank';

            const amountTooltip = document.createElement('span');
            amountTooltip.id = `${design.id}-${denomination.id}-amount-tooltip`;

            const coinDesignYears = document.createElement('span');
            coinDesignYears.id = `${design.id}-${denomination.id}-years`;

            const needsUpgradeTotal = document.createElement('span');
            needsUpgradeTotal.id = `${design.id}-${denomination.id}-needs-upgrade`;

            coinDesignDiv.append(coinDesignLink, ' (', coinDesignYears, ') (', amountTooltip, needsUpgradeTotal, ')');

            const note = design.note ?? (design.nifc ? 'NIFC (Not Intended For Circulation)' : null);

            if (note) {
                const coinDesignNote = document.createElement('span');
                coinDesignNote.classList.add('coin-design-note', 'tooltip-right');
                coinDesignNote.textContent = '*';
                coinDesignNote.dataset.tooltip = note;

                coinDesignDiv.append(coinDesignNote);
            }

            const coinDesignImage = document.createElement('img');
            coinDesignImage.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${denomination.id}/designs/${design.id}.png`;
            coinDesignImage.loading = 'lazy';
            coinDesignImage.classList.add('coin-design-image', 'popup-image');
            coinDesignImage.alt = design.name;

            const showCoinTableButton = document.createElement('button');
            showCoinTableButton.classList.add('coin-design-expand');
            showCoinTableButton.textContent = 'Show coin table';
            showCoinTableButton.dataset.expanded = 'false';
            showCoinTableButton.addEventListener('click', () => {
                if (showCoinTableButton.dataset.expanded === 'true') {
                    showCoinTableButton.dataset.expanded = 'false';
                    showCoinTableButton.textContent = 'Show coin table';
                    coinTable.classList.add('hidden');
                } else {
                    showCoinTableButton.dataset.expanded = 'true';
                    showCoinTableButton.textContent = 'Hide coin table';
                    coinTable.classList.remove('hidden');
                }
            });

            const coinTable = document.createElement('table');
            coinTable.classList.add('info-table', 'coin-table', 'hidden');

            const tableHeader = document.createElement('thead');
            const tableHeaderRow = document.createElement('tr');

            for (const header of ['Year', 'Mint Mark', 'Mintage', 'Specification/Notes', 'Obtained', 'Needs Upgrade']) {
                const columnHeader = document.createElement('th');
                columnHeader.textContent = header;
                tableHeaderRow.append(columnHeader);
            }

            tableHeader.append(tableHeaderRow);
            coinTable.append(tableHeader);

            const tableBody = document.createElement('tbody');

            for (const coin of design.coins) {
                const row = generateCoinRow(denomination, design, coin);

                tableBody.append(row);
            }

            const newRowMessage = document.createElement('tr');
            newRowMessage.classList.add('new-row-message');

            const newRowMessageCell = document.createElement('td');
            newRowMessageCell.colSpan = 6;
            newRowMessageCell.textContent = 'Add new row';
            newRowMessageCell.addEventListener('click', async () => {
                if (newRowMessage.dataset.disabled === 'true') return;

                const coinDesignCoins = [...coinsData[denomination.id].designs[design.id].coins.values()];

                const year = coinDesignCoins.at(-1)?.year
                    ? (Number.parseInt(coinDesignCoins.at(-1)!.year!) + 1).toString()
                    : new Date().getFullYear().toString();

                let id: string;
                do id = Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000).toString();
                while (design.coins.some((coin) => coin.id === id));

                const row = generateCoinRow(denomination, design, { year, id, obtained: false });
                newRowMessage.before(row);

                coinsData[denomination.id].designs[design.id].coins.set(id, { year, id, obtained: false });

                loadDesignTotals(denomination.id, design.id);

                addCoinChangeEntry({ year }, design.name, undefined, undefined, 'was created');

                await addCoin(denomination.id, design.id, year, id);
            });

            const plusIcon = document.createElement('i');
            plusIcon.classList.add('fa-solid', 'fa-plus');

            newRowMessageCell.prepend(plusIcon);

            newRowMessage.append(newRowMessageCell);
            tableBody.append(newRowMessage);

            coinTable.append(tableBody);

            coinDesignDiv.prepend(coinDesignImage);
            coinDesignDiv.append(showCoinTableButton);
            coinDesignDiv.append(coinTable);

            coinDenominationDiv.append(coinDesignDiv);
        }

        coinsList.append(coinDenominationDiv);
    }

    for (const denomination of unindexedCoinsData) for (const design of denomination.designs) loadDesignTotals(denomination.id, design.id);

    loadPopupImages();
}

const modal = document.querySelector<HTMLDivElement>('#modal')!;
const modalImage = document.querySelector<HTMLImageElement>('#modal-image')!;
const modalCaption = document.querySelector<HTMLDivElement>('#modal-caption')!;

/**
 * Generates a coin row for a given coin.
 * @param denomination The coin denomination to generate the coin row for.
 * @param design The coin design to generate the coin row for.
 * @param coin The coin to generate the coin row for.
 */
function generateCoinRow(denomination: CoinDenomination<CoinDesign<Coin>>, design: CoinDesign<Coin>, coin: Coin) {
    const row = document.createElement('tr');
    row.dataset.id = coin.id;
    row.dataset.obtained = coin.obtained.toString();
    row.dataset.upgrade = (coin.upgrade ?? false).toString();

    const yearCell = document.createElement('td');

    const yearEditor = document.createElement('span');
    yearEditor.textContent = coin.year;
    yearEditor.contentEditable = 'plaintext-only';
    yearEditor.addEventListener('blur', async () => {
        const newValue = yearEditor.textContent || 'UNKNOWN';
        if (newValue === coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.year) return;

        addCoinChangeEntry(coinsData[denomination.id].designs[design.id].coins.get(coin.id)!, design.name, 'year', { year: newValue });

        coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.year = newValue;

        loadDesignTotals(denomination.id, design.id);

        await updateCoinData(denomination.id, design.id, coin.id, { year: newValue });
    });
    yearCell.append(yearEditor);

    if (coin.image) {
        const coinImage = document.createElement('sup');
        coinImage.classList.add('coin-image-icon', 'fa-solid', 'fa-image');
        coinImage.dataset.image = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${denomination.id}/images/${design.id}/${coin.image}`;
        coinImage.dataset.name = `${design.name} - ${coin.year}${coin.mintMark ? `  (${coin.mintMark})` : ''}${coin.specification ? ` (${coin.specification})` : ''}`;
        coinImage.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== coinImage.dataset.image) modalImage.src = coinImage.dataset.image!;
            if (modalCaption.textContent !== coinImage.dataset.name) modalCaption.textContent = coinImage.dataset.name!;
        });

        yearCell.append(coinImage);
    }

    row.append(yearCell);

    const mintMarkCell = document.createElement('td');
    const tooltipSpan = document.createElement('span');
    tooltipSpan.classList.add('tooltip-bottom');
    tooltipSpan.dataset.tooltip = coin.mintMark
        ? coin.mintMark in mintMarks
            ? `Minted in ${mintMarks[coin.mintMark]}`
            : 'Unknown'
        : `Likely minted in ${mintMarks.P}`;
    tooltipSpan.textContent = coin.mintMark ?? 'None';
    tooltipSpan.contentEditable = 'plaintext-only';
    tooltipSpan.addEventListener('focus', () => {
        delete tooltipSpan.dataset.tooltip;
        tooltipSpan.classList.remove('tooltip-bottom');

        if (tooltipSpan.textContent.toLowerCase() === 'none') tooltipSpan.textContent = '';
    });
    tooltipSpan.addEventListener('blur', async () => {
        tooltipSpan.textContent ||= 'None';
        tooltipSpan.dataset.tooltip =
            tooltipSpan.textContent.toLowerCase() === 'none'
                ? `Likely minted in ${mintMarks.P}`
                : tooltipSpan.textContent.toUpperCase() in mintMarks
                  ? `Minted in ${mintMarks[tooltipSpan.textContent.toUpperCase()]}`
                  : 'Unknown';
        tooltipSpan.textContent = tooltipSpan.textContent.toLowerCase() === 'none' ? 'None' : tooltipSpan.textContent.toUpperCase();
        tooltipSpan.classList.add('tooltip-bottom');

        const newValue = tooltipSpan.textContent && tooltipSpan.textContent !== 'None' ? tooltipSpan.textContent : null;

        if (tooltipSpan.textContent === (coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.mintMark ?? 'None')) return;

        addCoinChangeEntry(coinsData[denomination.id].designs[design.id].coins.get(coin.id)!, design.name, 'mint mark', {
            mintMark: tooltipSpan.textContent,
        });

        coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.mintMark = newValue;

        await updateCoinData(denomination.id, design.id, coin.id, { mintMark: newValue });
    });
    mintMarkCell.append(tooltipSpan);
    row.append(mintMarkCell);

    const mintageCell = document.createElement('td');
    mintageCell.contentEditable = 'plaintext-only';
    mintageCell.textContent = 'mintage' in coin ? formatMintage(coin.mintage!) : '???';
    if (coin.mintageForAllVarieties) mintageCell.classList.add('mintage-for-all-varieties');
    mintageCell.addEventListener('focus', () => {
        mintageCell.textContent = coin.mintage?.toString() ?? '';
        if (coin.mintageForAllVarieties) mintageCell.textContent += ' (all)';
        mintageCell.classList.remove('mintage-for-all-varieties');
    });
    mintageCell.addEventListener('blur', async () => {
        const mintageNumber = mintageCell.textContent
            ? Number.parseInt(mintageCell.textContent.replaceAll(',', '').replace(/ (all)$/, ''))
            : null;
        const mintageForAllVarieties = mintageCell.textContent.endsWith(' (all)') || null;

        mintageCell.textContent = mintageNumber === null ? '???' : formatMintage(mintageNumber);
        if (mintageForAllVarieties) mintageCell.classList.add('mintage-for-all-varieties');

        if ((mintageNumber ?? '') !== (coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.mintage ?? '')) {
            addCoinChangeEntry(coinsData[denomination.id].designs[design.id].coins.get(coin.id)!, design.name, 'mintage', {
                mintage: mintageNumber,
            });

            coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.mintage = mintageNumber;

            await updateCoinData(denomination.id, design.id, coin.id, { mintage: mintageNumber });
        }

        if (mintageForAllVarieties !== (coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.mintageForAllVarieties ?? null)) {
            addCoinChangeEntry(
                coinsData[denomination.id].designs[design.id].coins.get(coin.id)!,
                design.name,
                'mintage "for all varieties"',
                { mintageForAllVarieties },
            );

            coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.mintageForAllVarieties = mintageForAllVarieties;

            await updateCoinData(denomination.id, design.id, coin.id, { mintageForAllVarieties });
        }
    });

    row.append(mintageCell);

    const specificationCell = document.createElement('td');
    if (!coin.comparison) {
        specificationCell.contentEditable = 'plaintext-only';
        specificationCell.textContent = coin.specification ?? '';
        specificationCell.addEventListener('blur', async () => {
            if (specificationCell.textContent === (coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.specification ?? ''))
                return;

            addCoinChangeEntry(coinsData[denomination.id].designs[design.id].coins.get(coin.id)!, design.name, 'specification', {
                specification: specificationCell.textContent,
            });

            coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.specification = specificationCell.textContent || null;

            await updateCoinData(denomination.id, design.id, coin.id, { specification: specificationCell.textContent || null });
        });
    }
    if (coin.comparison) {
        const comparisonSpan = document.createElement('span');
        comparisonSpan.classList.add('coin-type-comparison');
        comparisonSpan.textContent = 'View type comparison';
        comparisonSpan.dataset.image = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${denomination.id}/comparisons/${design.id}/${coin.comparison}.jpg`;
        comparisonSpan.dataset.name = `Type comparison: ${design.name} - ${coin.year}${coin.mintMark ? `  (${coin.mintMark})` : ''}${coin.specification ? ` (${coin.specification})` : ''}`;
        comparisonSpan.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== comparisonSpan.dataset.image) modalImage.src = comparisonSpan.dataset.image!;
            if (modalCaption.textContent !== comparisonSpan.dataset.name) modalCaption.textContent = comparisonSpan.dataset.name!;
        });

        if (coin.specification) {
            const specificationEditor = document.createElement('span');
            specificationEditor.textContent = coin.specification;
            specificationEditor.contentEditable = 'plaintext-only';
            specificationEditor.addEventListener('blur', async () => {
                if (
                    specificationEditor.textContent ===
                    (coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.specification ?? '')
                )
                    return;

                addCoinChangeEntry(coinsData[denomination.id].designs[design.id].coins.get(coin.id)!, design.name, 'specification', {
                    specification: specificationEditor.textContent,
                });

                coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.specification = specificationEditor.textContent || null;

                await updateCoinData(denomination.id, design.id, coin.id, { specification: specificationEditor.textContent || null });
            });
            specificationCell.append(specificationEditor, ' ');
            comparisonSpan.textContent = `(${comparisonSpan.textContent})`;
            specificationCell.append(comparisonSpan);
        } else specificationCell.append(comparisonSpan);
    }
    row.append(specificationCell);

    const obtainedCell = document.createElement('td');
    const obtainedCheckbox = document.createElement('input');
    obtainedCheckbox.type = 'checkbox';
    obtainedCheckbox.checked = coin.obtained;
    obtainedCheckbox.addEventListener('change', async () => {
        row.dataset.obtained = obtainedCheckbox.checked.toString();

        addCoinChangeEntry(
            coinsData[denomination.id].designs[design.id].coins.get(coin.id)!,
            design.name,
            'obtained',
            { obtained: obtainedCheckbox.checked },
            `was marked as ${obtainedCheckbox.checked ? 'obtained' : 'not obtained'}`,
        );

        coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.obtained = obtainedCheckbox.checked || null;

        loadDesignTotals(denomination.id, design.id);

        await updateCoinData(denomination.id, design.id, coin.id, { obtained: obtainedCheckbox.checked || null });

        if (!obtainedCheckbox.checked && needsUpgradeCheckbox.checked) needsUpgradeCheckbox.click();
    });
    obtainedCell.append(obtainedCheckbox);
    row.append(obtainedCell);

    const needsUpgradeCell = document.createElement('td');
    const needsUpgradeCheckbox = document.createElement('input');
    needsUpgradeCheckbox.type = 'checkbox';
    needsUpgradeCheckbox.checked = coin.upgrade ?? false;
    needsUpgradeCheckbox.addEventListener('change', async () => {
        row.dataset.upgrade = needsUpgradeCheckbox.checked.toString();

        addCoinChangeEntry(
            coinsData[denomination.id].designs[design.id].coins.get(coin.id)!,
            design.name,
            'upgrade',
            { upgrade: needsUpgradeCheckbox.checked },
            `was marked as ${needsUpgradeCheckbox.checked ? 'needing an upgrade' : 'not needing an upgrade'}`,
        );

        coinsData[denomination.id].designs[design.id].coins.get(coin.id)!.upgrade = needsUpgradeCheckbox.checked || null;

        loadDesignTotals(denomination.id, design.id);

        await updateCoinData(denomination.id, design.id, coin.id, { upgrade: needsUpgradeCheckbox.checked || null });

        if (needsUpgradeCheckbox.checked && !obtainedCheckbox.checked) obtainedCheckbox.click();
    });
    needsUpgradeCell.append(needsUpgradeCheckbox);
    row.append(needsUpgradeCell);

    // Strip newlines and formatting from contenteditable element interactions
    for (const element of row.querySelectorAll<HTMLElement>('[contenteditable=plaintext-only]')) {
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') event.preventDefault();
        });

        element.addEventListener('paste', (event) => {
            event.preventDefault();

            const text = event.clipboardData!.getData('text/plain').replaceAll(/[\n\r]/g, ' ');

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

    return row;
}

/**
 * Loads the totals for a given coin design.
 * @param denomination The coin denomination to load the totals for.
 * @param design The coin design to load the totals for.
 */
function loadDesignTotals(denomination: string, design: string) {
    const designData = coinsData[denomination].designs[design];

    const obtainedCoins = [...designData.coins.values()].filter((coin) => coin.obtained).length;
    const needsUpgradeCoins = [...designData.coins.values()].filter((coin) => coin.upgrade).length;
    const totalCoins = [...designData.coins.values()].length;

    const amountTooltip = document.querySelector<HTMLSpanElement>(`#${design}-${denomination}-amount-tooltip`)!;
    const yearSpan = document.querySelector<HTMLSpanElement>(`#${design}-${denomination}-years`)!;
    const upgradeSpan = document.querySelector<HTMLSpanElement>(`#${design}-${denomination}-needs-upgrade`)!;

    amountTooltip.dataset.tooltip = `${Math.ceil((obtainedCoins / totalCoins) * 10_000) / 100}% completed, ${totalCoins - obtainedCoins} missing`;
    amountTooltip.textContent = `${obtainedCoins}/${totalCoins}`;

    yearSpan.textContent = getCoinYears(designData);

    upgradeSpan.textContent = needsUpgradeCoins > 0 ? `, ${needsUpgradeCoins} needing upgrade` : '';

    if (obtainedCoins === 0) {
        amountTooltip.parentElement!.dataset.noneObtained = 'true';

        const denominationData = coinsData[denomination];

        if (Object.values(denominationData.designs).every((design) => [...design.coins.values()].every((coin) => !coin.obtained)))
            amountTooltip.parentElement!.parentElement!.dataset.noneObtained = 'true';
        else delete amountTooltip.parentElement!.parentElement!.dataset.noneObtained;
    } else {
        delete amountTooltip.parentElement!.dataset.noneObtained;
        delete amountTooltip.parentElement!.parentElement!.dataset.noneObtained;
    }
}

/**
 * Gets the year range for a given coin design.
 * @param design The coin design to get the year range for.
 */
function getCoinYears(design: CoinDesignById): string {
    if (design.years) return design.years;

    const coinValues = [...design.coins];

    const startYear = coinValues.at(0)![1].year!;

    const endYear = design.active ? 'date' : coinValues.at(-1)![1].year!;

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
 * @param denominationId The coin denomination id of the coin data to update.
 * @param designId The coin design id of the coin data to update.
 * @param coinId The id of the coin data to update.
 * @param data The data to update.
 */
async function updateCoinData(denominationId: string, designId: string, coinId: string, data: PartialNullable<Coin>) {
    const result = (await (
        await fetch('/coins-list-edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ denominationId, designId, coinId, data, password: passwordInput.dataset.input }),
        })
    ).json()) as { error?: string };

    if (result.error) showAlert(result.error, 'error');
    else showAlert('Coin data updated successfully!', 'success');
}

/**
 * Adds a new coin to the database.
 * @param denominationId The coin denomination id to add the coin to.
 * @param designId The coin design id to add the coin to.
 * @param coinYear The year of the coin to add.
 * @param coinId The id of the coin to add.
 */
async function addCoin(denominationId: string, designId: string, coinYear: string, coinId: string) {
    const result = (await (
        await fetch('/coins-list-add-coin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ denominationId, designId, coinYear, coinId, password: passwordInput.dataset.input }),
        })
    ).json()) as { error?: string };

    if (result.error) showAlert(result.error, 'error');
    else showAlert('Successfully added a new coin row!', 'success');
}

/**
 * Adds a given coin update entry to the changes log.
 * @param coinData The coin data before the change.
 * @param designName The coin design id of the coin that was changed.
 * @param type The type of change that was made.
 * @param changes The changes that were made.
 * @param changeText The text to display for the change (if `changes` is not provided).
 */
function addCoinChangeEntry(
    coinData: PartialNullable<Coin>,
    designName: string,
    type?: string,
    changes?: PartialNullable<Coin>,
    changeText?: string,
) {
    const { year, mintMark, specification } = coinData as Coin;

    if (changeHistory.querySelectorAll('li').length === 0) changeHistory.innerHTML = '';

    const listEntry = document.createElement('li');
    listEntry.textContent = `${year}${mintMark ? ` ${mintMark}` : ''} ${designName}${specification ? ` (${specification})` : ''}${
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

    listEntry.append(timeTooltip);

    changeHistory.append(listEntry);
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
        generateNeededListButton.disabled = false;
        generateSimplifiedNeededListButton.disabled = false;
    } else {
        showAlert('Incorrect password!', 'error');
        showResult(loginButton, 'error');
    }
}

// Add functionality to data exporter
exportDataButton.addEventListener('click', async () => {
    const coinsData = (await (await fetch(`/coins-list?password=${passwordInput.dataset.input!}`)).json()) as CoinDenomination<
        CoinDesign<Coin>
    >[] & { error?: string };

    if (coinsData.error) {
        showAlert(coinsData.error, 'error');
        return;
    }

    const file = new Blob([JSON.stringify(coinsData)], { type: 'application/json' });
    const anchor = document.createElement('a');
    const url = URL.createObjectURL(file);
    anchor.href = url;
    anchor.download = `coins-list data (${new Date().toLocaleString()}).json`;
    anchor.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 0);
});

generateNeededListButton.addEventListener('click', () => handleGenerateNeededList(false));

generateSimplifiedNeededListButton.addEventListener('click', () => handleGenerateNeededList(true));

for (const element of [closeNeededListModalButton, neededListModal])
    element.addEventListener('click', () => (neededListModal.style.display = 'none'));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && neededListModal.style.display === 'block') neededListModal.style.display = 'none';
});

/**
 * Handles generating the needed coins list.
 * @param isSimplified Whether to generate a simplified list.
 */
async function handleGenerateNeededList(isSimplified: boolean) {
    const coinsData = (await (await fetch(`/coins-list?password=${passwordInput.dataset.input!}`)).json()) as CoinDenomination<
        CoinDesign<Coin>
    >[] & { error?: string };

    if (coinsData.error) {
        showAlert(coinsData.error, 'error');
        return;
    }

    const currentYear = new Date().getFullYear();

    neededListModal.style.display = 'block';

    neededListModalContent.textContent = coinsData
        .map((denomination) => {
            const headerDecoration = '='.repeat(denomination.name.length + 4);
            const header = `${headerDecoration}\n  ${denomination.name}\n${headerDecoration}`;

            const filteredDesigns = denomination.designs
                .map((design) => {
                    const obtainedCoins = design.coins.filter((coin) => coin.obtained);
                    if (obtainedCoins.length <= 10) return null;

                    const filteredCoins = design.coins.filter(
                        (coin) =>
                            (!coin.obtained || coin.upgrade) &&
                            Number.parseInt(coin.year) <= currentYear &&
                            (isSimplified ? (coin.mintage ? coin.mintage > 5_000_000 : true) : true),
                    );

                    if (filteredCoins.length === 0) return null;

                    if (isSimplified) filteredCoins.sort((a, b) => (b.mintage ?? 0) - (a.mintage ?? 0));

                    const mappedFilteredCoins = filteredCoins.map(
                        (coin) =>
                            ` - ${coin.year}${coin.mintMark ? ` ${coin.mintMark}` : ''}${coin.specification ? ` (${coin.specification})` : ''}${coin.mintage ? ` - ${formatMintage(coin.mintage)}` : ''}${coin.upgrade ? ' (UPGRADE ONLY)' : ''}`,
                    );

                    return `${design.name}\n${mappedFilteredCoins.join('\n')}`;
                })
                .filter(Boolean);

            if (filteredDesigns.length === 0) return null;

            return `${header}\n${filteredDesigns.join('\n\n')}`;
        })
        .filter(Boolean)
        .join('\n\n\n');
}
