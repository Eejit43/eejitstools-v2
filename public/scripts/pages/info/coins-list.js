import { showAlert, showResult } from '/scripts/functions.js';

const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const coinsList = document.getElementById('coins-list');
const changeHistory = document.getElementById('change-history');

['input', 'paste'].forEach((type) => {
    loginPassword.addEventListener(type, () => {
        loginPassword.value = loginPassword.value.replace(/[^0-9]/g, '');

        if (loginPassword.value.length > 4) loginPassword.value = loginPassword.value.slice(0, 4);
    });
});

loginPassword.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && loginPassword.value.length > 0) loginButton.click();
});

loginButton.addEventListener('click', async () => {
    const { success } = await (await fetch(`/coins-login?password=${loginPassword.value}`)).json();

    if (success) {
        loginPassword.dataset.input = loginPassword.value;
        loginPassword.value = '';
        loginPassword.disabled = true;
        loginButton.disabled = true;
        showAlert('Logged in!', 'success');
        showResult('login', 'success', null, null, false);

        loadCoinsList();
    } else {
        showAlert('Incorrect password!', 'error');
        showResult('login', 'error', null, null, false);
        loginButton.disabled = true;
        setTimeout(() => (loginButton.disabled = false), 1000);
    }
});

const mintMarks = {
    P: 'Philadelphia (Pennsylvania)',
    D: 'Denver (Colorado)',
    S: 'San Francisco (California)',
    W: 'West Point (New York)',
    CC: 'Carson City (Nevada)',
    C: 'Charlotte (North Carolina)'
};

/**
 * Load the coins list
 */
async function loadCoinsList() {
    /**
     * @type {import('../../../data/coins-data.js').CoinType[]}
     */
    const coins = await (await fetch(`/coins-list?password=${loginPassword.dataset.input}`)).json();

    coinsList.innerHTML = '';

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
    showAllVariantsButton.dataset.expanded = false;
    showAllVariantsButton.addEventListener('click', () => {
        if (showAllVariantsButton.dataset.expanded === 'true') {
            showAllVariantsButton.dataset.expanded = false;
            showAllVariantsButton.textContent = 'Show all variants';
            document.querySelectorAll('.coin-type-expand').forEach((button) => {
                if (button.dataset.expanded === 'true') button.click();
            });
        } else {
            showAllVariantsButton.dataset.expanded = true;
            showAllVariantsButton.textContent = 'Hide all variants';
            document.querySelectorAll('.coin-type-expand').forEach((button) => {
                if (button.dataset.expanded === 'false') button.click();
            });
        }
    });

    const toggleMissingCoinsButton = document.createElement('button');
    toggleMissingCoinsButton.id = 'toggle-missing-coins';
    toggleMissingCoinsButton.textContent = 'Hide missing coins';
    toggleMissingCoinsButton.dataset.shown = true;
    toggleMissingCoinsButton.addEventListener('click', () => {
        if (toggleMissingCoinsButton.dataset.shown === 'true') {
            toggleMissingCoinsButton.dataset.shown = false;
            toggleMissingCoinsButton.textContent = 'Show missing coins';
            document.querySelectorAll('table.coin-variant-table tbody tr').forEach(updateRowVisibility);
        } else {
            toggleMissingCoinsButton.dataset.shown = true;
            toggleMissingCoinsButton.textContent = 'Hide missing coins';
            document.querySelectorAll('table.coin-variant-table tbody tr').forEach(updateRowVisibility);
        }
        updateNoCoinsMessage();
    });

    const toggleObtainedCoinsButton = document.createElement('button');
    toggleObtainedCoinsButton.id = 'toggle-obtained-coins';
    toggleObtainedCoinsButton.textContent = 'Show obtained coins';
    toggleObtainedCoinsButton.dataset.shown = false;
    toggleObtainedCoinsButton.addEventListener('click', () => {
        if (toggleObtainedCoinsButton.dataset.shown === 'true') {
            toggleObtainedCoinsButton.dataset.shown = false;
            toggleObtainedCoinsButton.textContent = 'Show obtained coins';
            document.querySelectorAll('table.coin-variant-table tbody tr').forEach(updateRowVisibility);
        } else {
            toggleObtainedCoinsButton.dataset.shown = true;
            toggleObtainedCoinsButton.textContent = 'Hide obtained coins';
            document.querySelectorAll('table.coin-variant-table tbody tr').forEach(updateRowVisibility);
        }
        updateNoCoinsMessage();
    });

    const toggleNeedsUpgradeCoinsButton = document.createElement('button');
    toggleNeedsUpgradeCoinsButton.id = 'toggle-needs-upgrade-coins';
    toggleNeedsUpgradeCoinsButton.textContent = 'Hide coins needing upgrade';
    toggleNeedsUpgradeCoinsButton.dataset.shown = true;
    toggleNeedsUpgradeCoinsButton.addEventListener('click', () => {
        if (toggleNeedsUpgradeCoinsButton.dataset.shown === 'true') {
            toggleNeedsUpgradeCoinsButton.dataset.shown = false;
            toggleNeedsUpgradeCoinsButton.textContent = 'Show coins needing upgrade';
            document.querySelectorAll('table.coin-variant-table tbody tr').forEach(updateRowVisibility);
        } else {
            toggleNeedsUpgradeCoinsButton.dataset.shown = true;
            toggleNeedsUpgradeCoinsButton.textContent = 'Hide coins needing upgrade';
            document.querySelectorAll('table.coin-variant-table tbody tr').forEach(updateRowVisibility);
        }
        updateNoCoinsMessage();
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
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.contentEditable === 'true') return;

        if (event.code === 'KeyR') reloadButton.click();
        else if (event.code === 'KeyA') showAllVariantsButton.click();
        else if (event.code === 'KeyM') toggleMissingCoinsButton.click();
        else if (event.code === 'KeyO') toggleObtainedCoinsButton.click();
        else if (event.code === 'KeyU') toggleNeedsUpgradeCoinsButton.click();
    });

    coins.forEach((coinType) => {
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
        coinTypeButton.dataset.expanded = false;
        coinTypeButton.addEventListener('click', () => {
            if (coinTypeButton.dataset.expanded === 'true') {
                coinTypeButton.dataset.expanded = false;
                coinTypeButton.textContent = 'Show variants';
                coinTypeDiv.querySelectorAll('.coin-variant').forEach((variant) => variant.classList.add('hidden'));
            } else {
                coinTypeButton.dataset.expanded = true;
                coinTypeButton.textContent = 'Hide variants';
                coinTypeDiv.querySelectorAll('.coin-variant').forEach((variant) => variant.classList.remove('hidden'));
            }
        });

        coinTypeDiv.prepend(coinTypeImg);
        coinTypeDiv.appendChild(coinTypeButton);

        coinType.coins.forEach((coinVariant) => {
            const obtainedCoins = coinVariant.coins.filter((coin) => coin.obtained).length;
            const upgradeCoins = coinVariant.coins.filter((coin) => coin.upgrade).length;
            const totalCoins = coinVariant.coins.length;

            const amountTooltip = document.createElement('span');
            amountTooltip.dataset.tooltip = `${Math.ceil((obtainedCoins / totalCoins) * 10000) / 100}% completed, ${totalCoins - obtainedCoins} missing`;
            amountTooltip.textContent = `${obtainedCoins}/${totalCoins}`;

            const coinVariantDiv = document.createElement('div');
            coinVariantDiv.classList.add('coin-variant', 'hidden');
            coinVariantDiv.innerHTML = `${coinVariant.name} (${getCoinYears(coinVariant)}) (${amountTooltip.outerHTML}${upgradeCoins > 0 ? `, ${upgradeCoins} needing upgrade` : ''})`;

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
            coinVariantButton.dataset.expanded = false;
            coinVariantButton.addEventListener('click', () => {
                if (coinVariantButton.dataset.expanded === 'true') {
                    coinVariantButton.dataset.expanded = false;
                    coinVariantButton.textContent = 'Show coin table';
                    coinVariantTable.classList.add('hidden');
                } else {
                    coinVariantButton.dataset.expanded = true;
                    coinVariantButton.textContent = 'Hide coin table';
                    coinVariantTable.classList.remove('hidden');
                }
                updateNoCoinsMessage(coinVariantTable);
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
                row.dataset.obtained = coin.obtained ?? false;
                row.dataset.upgrade = coin.upgrade ?? false;
                if (coin.obtained && !coin.upgrade) row.classList.add('hidden');

                const year = document.createElement('td');
                year.dataset.value = coin.year;

                const yearEditor = document.createElement('span');
                yearEditor.textContent = coin.year;
                yearEditor.contentEditable = true;
                yearEditor.addEventListener('blur', async () => {
                    const newValue = yearEditor.textContent || 'UNKNOWN';
                    if (newValue === year.dataset.value) return;

                    await updateCoinData(coinType.id, coinVariant.id, coin.id, { year: newValue });

                    addChangeEntry({ coin: coinVariant.name, year: newValue, mintMark: mintMark.dataset.value, specification: specification.dataset.value, type: 'year', oldValue: year.dataset.value, newValue });

                    year.dataset.value = newValue;
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
                mintMark.dataset.value = coin.mintMark ?? 'None';
                const tooltip = document.createElement('span');
                tooltip.classList.add('tooltip-bottom');
                tooltip.dataset.tooltip = coin.mintMark ? (coin.mintMark in mintMarks ? `Minted in ${mintMarks[coin.mintMark]}` : 'Unknown') : `Likely minted in ${mintMarks.P}`;
                tooltip.textContent = coin.mintMark || 'None';
                tooltip.contentEditable = true;
                tooltip.addEventListener('focus', () => {
                    tooltip.removeAttribute('data-tooltip');
                    tooltip.classList.remove('tooltip-bottom');
                });
                tooltip.addEventListener('blur', async () => {
                    if (!tooltip.textContent) tooltip.textContent = 'None';
                    tooltip.dataset.tooltip = tooltip.textContent.toLowerCase() !== 'none' ? (tooltip.textContent.toUpperCase() in mintMarks ? `Minted in ${mintMarks[tooltip.textContent]}` : 'Unknown') : `Likely minted in ${mintMarks.P}`;
                    tooltip.textContent = tooltip.textContent.toLowerCase() === 'none' ? 'None' : tooltip.textContent.toUpperCase();
                    tooltip.classList.add('tooltip-bottom');

                    if (tooltip.textContent === mintMark.dataset.value) return;

                    await updateCoinData(coinType.id, coinVariant.id, coin.id, { mintMark: tooltip.textContent && tooltip.textContent !== 'None' ? tooltip.textContent : null });

                    addChangeEntry({ coin: coinVariant.name, year: year.dataset.value, mintMark: tooltip.textContent, specification: specification.dataset.value, type: 'mint mark', oldValue: mintMark.dataset.value, newValue: tooltip.textContent });

                    mintMark.dataset.value = tooltip.textContent;
                });
                mintMark.appendChild(tooltip);
                row.appendChild(mintMark);

                const specification = document.createElement('td');
                specification.dataset.value = coin.specification ?? '';
                if (!coin.comparison) {
                    specification.contentEditable = true;
                    specification.textContent = coin.specification ?? '';
                    specification.addEventListener('blur', async () => {
                        if (specification.textContent === specification.dataset.value) return;

                        await updateCoinData(coinType.id, coinVariant.id, coin.id, { specification: specification.textContent || null });

                        addChangeEntry({ coin: coinVariant.name, year: year.dataset.value, mintMark: mintMark.dataset.value, specification: specification.textContent, type: 'specification', oldValue: specification.dataset.value, newValue: specification.textContent });

                        specification.dataset.value = specification.textContent;
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
                        specificationEditor.contentEditable = true;
                        specificationEditor.addEventListener('blur', async () => {
                            if (specificationEditor.textContent === specification.dataset.value) return;

                            await updateCoinData(coinType.id, coinVariant.id, coin.id, { specification: specificationEditor.textContent || null });

                            addChangeEntry({ coin: coinVariant.name, year: year.dataset.value, mintMark: mintMark.dataset.value, specification: specificationEditor.textContent, type: 'specification', oldValue: specification.dataset.value, newValue: specificationEditor.textContent });

                            specification.dataset.value = specificationEditor.textContent;
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
                    row.dataset.obtained = obtainedCheck.checked;
                    await updateCoinData(coinType.id, coinVariant.id, coin.id, { obtained: obtainedCheck.checked || null });
                    updateRowVisibility(row);

                    addChangeEntry({ coin: coinVariant.name, year: year.dataset.value, mintMark: mintMark.dataset.value, specification: specification.dataset.value, changeText: `was marked as ${obtainedCheck.checked ? 'obtained' : 'not obtained'}` });

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
                    row.dataset.upgrade = needsUpgradeCheck.checked;
                    await updateCoinData(coinType.id, coinVariant.id, coin.id, { upgrade: needsUpgradeCheck.checked || null });
                    updateRowVisibility(row);

                    addChangeEntry({ coin: coinVariant.name, year: year.dataset.value, mintMark: mintMark.dataset.value, specification: specification.dataset.value, changeText: `was marked as ${needsUpgradeCheck.checked ? 'needing an upgrade' : 'not needing an upgrade'}` });
                });
                needsUpgrade.appendChild(needsUpgradeCheck);
                row.appendChild(needsUpgrade);

                coinVariantTableBody.appendChild(row);
            });

            coinVariantTable.appendChild(coinVariantTableBody);

            coinVariantDiv.prepend(coinVariantImg);
            coinVariantDiv.appendChild(coinVariantButton);
            coinVariantDiv.appendChild(coinVariantTable);

            coinTypeDiv.appendChild(coinVariantDiv);
        });

        coinsList.appendChild(coinTypeDiv);
    });

    loadPopupImages();
}

/**
 * Gets the year range for a given coin variant.
 * @param {import('../../../data/coins-data.js').CoinVariant} variant The coin variant to get the year range for
 * @returns {string} The year range for the coin variant
 */
function getCoinYears(variant) {
    if (variant.years) return variant.years;

    const startYear = variant.coins[0].year;

    const endYear = variant.active ? 'date' : variant.coins[variant.coins.length - 1].year;

    return startYear === endYear ? startYear : `${startYear}–${endYear}`;
}

/**
 * Checks if no coins are shown, and displays a message if so
 * @param {HTMLElement} [table] the table to check, or all tables if not specified
 */
function updateNoCoinsMessage(table) {
    if (!table) {
        const tables = document.querySelectorAll('table.coin-variant-table');
        tables.forEach((table) => updateNoCoinsMessage(table));
        return;
    }
    if (![...table.querySelectorAll('tbody tr')].some((row) => !row.classList.contains('hidden'))) {
        table.querySelector('.coin-table-message')?.remove();

        const messageElement = document.createElement('tr');
        messageElement.classList.add('coin-table-message');

        const messageCell = document.createElement('td');
        messageCell.colSpan = 5;
        messageCell.textContent = 'No coins to show!';

        messageElement.appendChild(messageCell);
        table.querySelector('tbody').appendChild(messageElement);
    } else {
        table.querySelector('.coin-table-message')?.remove();
    }
}

/**
 * Updates the visibility of a row based on the current filter settings
 * @param {HTMLElement} row The row to update
 * @returns {void}
 */
function updateRowVisibility(row) {
    const obtained = row.dataset.obtained === 'true';
    const needsUpgrade = row.dataset.upgrade === 'true';

    if (!obtained && document.getElementById('toggle-missing-coins').dataset.shown === 'false') row.classList.add('hidden');
    else if (needsUpgrade && document.getElementById('toggle-needs-upgrade-coins').dataset.shown === 'false') row.classList.add('hidden');
    else if (obtained && document.getElementById('toggle-obtained-coins').dataset.shown === 'false') row.classList.add('hidden');
    else row.classList.remove('hidden');

    updateNoCoinsMessage(row.closest('table'));
}

/**
 * Updates the coin data in the database
 * @param {string} coinTypeId The type of the coin data to update
 * @param {string} coinVariantId The variant of the coin data to update
 * @param {string} coinId The ID of the coin data to update
 * @param {object} data The data to update
 */
async function updateCoinData(coinTypeId, coinVariantId, coinId, data) {
    const editableElements = document.querySelectorAll('[contenteditable]');
    const checkboxes = document.querySelectorAll('td > input[type="checkbox"]');
    editableElements.forEach((element) => (element.contentEditable = 'false'));
    checkboxes.forEach((checkbox) => {
        if (checkbox.disabled) checkbox.dataset.disabled = true;
        checkbox.disabled = true;
    });
    const result = await fetch('/coins-list-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coinTypeId, coinVariantId, coinId, data, password: loginPassword.dataset.input })
    });
    if (result.error) showAlert(result.error, 'error');
    else showAlert('Coin data updated successfully!', 'success');

    editableElements.forEach((element) => (element.contentEditable = 'true'));
    checkboxes.forEach((checkbox) => {
        if (checkbox.dataset.disabled !== 'true') checkbox.disabled = false;
        checkbox.removeAttribute('data-disabled');
    });
}

/**
 * @typedef {object} ChangeEntry
 * @property {string} coin The coin that was changed
 * @property {string} year The year of the coin that was changed
 * @property {string} mintMark The mint mark of the coin that was changed
 * @property {string} specification The specification of the coin that was changed
 * @property {string} [type] The value that was changed (not required if `changeText` is provided)
 * @property {string} [oldValue] The old value before the change (not required if `changeText` is provided)
 * @property {string} [newValue] The new value after the change (not required if `changeText` is provided)
 * @property {string} [changeText] The text to display for the change (if `oldValue` and `newValue` are not provided)
 */

/**
 * Adds a given entry to the changes log
 * @param {ChangeEntry} entry The entry to add
 */
function addChangeEntry({ coin, year, mintMark, specification, type, oldValue, newValue, changeText }) {
    if (changeHistory.querySelectorAll('li').length === 0) changeHistory.innerHTML = '';

    const entry = document.createElement('li');
    entry.textContent = `${year} ${mintMark || '(No mint mark)'} ${coin}${specification ? ` (${specification})` : ''}${changeText ? ` ${changeText}` : `'s ${type} was changed from "${oldValue}" to "${newValue}"`}`;

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
    const { success } = await (await fetch(`/coins-login?password=${password}`)).json();

    if (success) {
        loginPassword.dataset.input = password;
        loginPassword.disabled = true;
        loginButton.disabled = true;
        showAlert('Logged in!', 'success');
        showResult('login', 'success', null, null, false);

        loadCoinsList();
    } else {
        showAlert('Incorrect password!', 'error');
        showResult('login', 'error', null, null, false);
    }
}

/**
 * Adds modal functionality to all images with the "popup-image" class
 */
function loadPopupImages() {
    const modal = document.getElementById('modal');
    const images = document.querySelectorAll('img.popup-image');
    const imageTextButtons = document.querySelectorAll('sup.coin-image-icon');
    const coinTypeComparisonButtons = document.querySelectorAll('span.coin-type-comparison');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeButton = document.getElementById('close-modal');

    for (const image of images)
        image.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== image.src) modalImage.src = image.src;
            if (modalCaption.textContent !== image.alt) modalCaption.textContent = image.alt;
        });

    for (const imageTextButton of imageTextButtons)
        imageTextButton.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== imageTextButton.dataset.image) modalImage.src = imageTextButton.dataset.image;
            if (modalCaption.textContent !== imageTextButton.dataset.name) modalCaption.textContent = imageTextButton.dataset.name;
        });

    for (const coinTypeComparisonButton of coinTypeComparisonButtons)
        coinTypeComparisonButton.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== coinTypeComparisonButton.dataset.image) modalImage.src = coinTypeComparisonButton.dataset.image;
            if (modalCaption.textContent !== coinTypeComparisonButton.dataset.name) modalCaption.textContent = coinTypeComparisonButton.dataset.name;
        });

    [closeButton, modal].forEach((element) => {
        element.addEventListener('click', () => (modal.style.display = 'none'));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') modal.style.display = 'none';
    });
}
