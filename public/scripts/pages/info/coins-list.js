import { showAlert, showResult } from '/scripts/functions.js';

const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const coinsList = document.getElementById('coins-list');

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
     * @type {import('../../../../coin-data.js').CoinType[]}
     */
    const coins = await (await fetch(`/coins-list?password=${loginPassword.dataset.input}`)).json();

    coinsList.innerHTML = '';

    const reloadButton = document.createElement('button');
    reloadButton.classList.add('reload-button');
    reloadButton.textContent = 'Reload';
    reloadButton.addEventListener('click', async () => {
        await loadCoinsList();
        showAlert('Reloaded!', 'success');
    });

    const showAllVariantsButton = document.createElement('button');
    showAllVariantsButton.textContent = 'Show all variants';
    showAllVariantsButton.classList.add('show-all-variants');
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

    coinsList.appendChild(reloadButton);
    coinsList.appendChild(showAllVariantsButton);

    coins.forEach((coinType) => {
        const coinTypeDiv = document.createElement('div');
        coinTypeDiv.classList.add('coin-type');
        coinTypeDiv.textContent = coinType.name;

        const coinTypeImg = document.createElement('img');
        coinTypeImg.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.id}/${coinType.coins[coinType.coins.length - 1]?.image || 'default'}.png`;
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
            coinVariantDiv.innerHTML = `${coinVariant.name} (${coinVariant.years}) (${amountTooltip.outerHTML}${upgradeCoins > 0 ? `, ${upgradeCoins} needing upgrade` : ''})`;

            if (coinVariant.note) {
                const coinVariantNote = document.createElement('span');
                coinVariantNote.classList.add('coin-variant-note', 'tooltip-right');
                coinVariantNote.textContent = '*';
                coinVariantNote.dataset.tooltip = coinVariant.note;

                coinVariantDiv.appendChild(coinVariantNote);
            }

            const coinVariantImg = document.createElement('img');
            coinVariantImg.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.id}/${coinVariant.image || 'default'}.png`;
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
            });

            const toggleMissingCoinsButton = document.createElement('button');
            toggleMissingCoinsButton.textContent = 'Hide missing coins';
            toggleMissingCoinsButton.dataset.shown = true;
            toggleMissingCoinsButton.addEventListener('click', () => {
                if (toggleMissingCoinsButton.dataset.shown === 'true') {
                    toggleMissingCoinsButton.dataset.shown = false;
                    toggleMissingCoinsButton.textContent = 'Show missing coins';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.obtained === 'false') coin.classList.add('hidden');
                    });
                } else {
                    toggleMissingCoinsButton.dataset.shown = true;
                    toggleMissingCoinsButton.textContent = 'Hide missing coins';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.obtained === 'false') coin.classList.remove('hidden');
                    });
                }
            });

            const toggleObtainedCoinsButton = document.createElement('button');
            toggleObtainedCoinsButton.textContent = 'Show obtained coins';
            toggleObtainedCoinsButton.dataset.shown = false;
            toggleObtainedCoinsButton.addEventListener('click', () => {
                if (toggleObtainedCoinsButton.dataset.shown === 'true') {
                    toggleObtainedCoinsButton.dataset.shown = false;
                    toggleObtainedCoinsButton.textContent = 'Show obtained coins';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.obtained === 'true' && coin.dataset.upgrade !== 'true') coin.classList.add('hidden');
                    });
                } else {
                    toggleObtainedCoinsButton.dataset.shown = true;
                    toggleObtainedCoinsButton.textContent = 'Hide obtained coins';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.obtained === 'true' && coin.dataset.upgrade !== 'true') coin.classList.remove('hidden');
                    });
                }
            });

            const toggleNeedsUpgradeCoinsButton = document.createElement('button');
            toggleNeedsUpgradeCoinsButton.textContent = 'Hide coins needing upgrade';
            toggleNeedsUpgradeCoinsButton.dataset.shown = true;
            toggleNeedsUpgradeCoinsButton.addEventListener('click', () => {
                if (toggleNeedsUpgradeCoinsButton.dataset.shown === 'true') {
                    toggleNeedsUpgradeCoinsButton.dataset.shown = false;
                    toggleNeedsUpgradeCoinsButton.textContent = 'Show coins needing upgrade';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.upgrade === 'true') coin.classList.add('hidden');
                    });
                } else {
                    toggleNeedsUpgradeCoinsButton.dataset.shown = true;
                    toggleNeedsUpgradeCoinsButton.textContent = 'Hide coins needing upgrade';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.upgrade === 'true') coin.classList.remove('hidden');
                    });
                }
            });

            const coinVariantTable = document.createElement('table');
            coinVariantTable.classList.add('info-table', 'coin-variant-table', 'hidden');

            const coinVariantTableHead = document.createElement('thead');
            const coinVariantTableHeadRow = document.createElement('tr');

            [
                { text: 'Year' }, //
                { text: 'Mint Mark' },
                { text: 'Specification/Notes' },
                { text: 'Obtained', elements: [toggleObtainedCoinsButton, toggleMissingCoinsButton] },
                { text: 'Needs Upgrade', elements: [toggleNeedsUpgradeCoinsButton] }
            ].forEach((header) => {
                const infoHeader = document.createElement('th');
                infoHeader.textContent = header.text;
                if (header.elements) header.elements.forEach((element) => infoHeader.appendChild(element));
                coinVariantTableHeadRow.appendChild(infoHeader);
            });

            coinVariantTableHead.appendChild(coinVariantTableHeadRow);
            coinVariantTable.appendChild(coinVariantTableHead);

            const coinVariantTableBody = document.createElement('tbody');

            coinVariant.coins.forEach((coin) => {
                const row = document.createElement('tr');
                row.dataset.obtained = coin.obtained ?? false;
                row.dataset.upgrade = coin.upgrade ?? false;
                if (coin.obtained && !coin.upgrade) row.classList.add('hidden');

                const year = document.createElement('td');
                year.textContent = coin.year;

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
                mintMark.appendChild(tooltip);
                row.appendChild(mintMark);

                const specification = document.createElement('td');
                if (coin.comparison) {
                    const comparison = document.createElement('span');
                    comparison.classList.add('coin-type-comparison');
                    comparison.textContent = 'View type comparison';
                    comparison.dataset.image = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/coins-list/${coinType.id}/${coin.comparison}.png`;
                    comparison.dataset.name = `Type Comparison: ${coinVariant.name} - ${coin.year}${coin.mintMark ? `  (${coin.mintMark})` : ''}${coin.specification ? ` (${coin.specification})` : ''}`;

                    if (coin.specification) {
                        specification.textContent = `${coin.specification} `;
                        comparison.textContent = `(${comparison.textContent})`;
                        specification.appendChild(comparison);
                    } else specification.appendChild(comparison);
                } else specification.textContent = coin.specification || '';
                row.appendChild(specification);

                const obtained = document.createElement('td');
                obtained.textContent = coin.obtained ? 'Yes' : 'No';
                row.appendChild(obtained);

                const needsUpgrade = document.createElement('td');
                needsUpgrade.textContent = coin.obtained ? (coin.upgrade ? 'Yes' : 'No') : 'N/A';
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
