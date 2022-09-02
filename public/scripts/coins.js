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
    }
});

const mintMarks = {
    P: 'Philadelphia (PA)',
    D: 'Denver (CO)',
    S: 'San Francisco (CA)',
    W: 'West Point (NY)',
    CC: 'Carson City (NV)',
    C: 'Charlotte (NC)'
};

/**
 * Load the coins list
 */
async function loadCoinsList() {
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
    showAllVariantsButton.classList.add('show-all-button');
    showAllVariantsButton.dataset.expanded = false;
    showAllVariantsButton.addEventListener('click', () => {
        if (showAllVariantsButton.dataset.expanded === 'true') {
            if (showAllCoinsButton.dataset.expanded === 'true') showAllCoinsButton.click();
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

    const showAllCoinsButton = document.createElement('button');
    showAllCoinsButton.textContent = 'Show all coin tables';
    showAllCoinsButton.classList.add('show-all-button');
    showAllCoinsButton.dataset.expanded = false;
    showAllCoinsButton.addEventListener('click', () => {
        if (showAllCoinsButton.dataset.expanded === 'true') {
            if (showAllVariantsButton.dataset.expanded === 'true') showAllVariantsButton.click();
            showAllCoinsButton.dataset.expanded = false;
            showAllCoinsButton.textContent = 'Show all coin tables';
            document.querySelectorAll('.coin-variant-expand').forEach((button) => {
                if (button.dataset.expanded === 'true') button.click();
            });
        } else {
            if (showAllVariantsButton.dataset.expanded === 'false') showAllVariantsButton.click();
            showAllCoinsButton.dataset.expanded = true;
            showAllCoinsButton.textContent = 'Hide all coin tables';
            document.querySelectorAll('.coin-variant-expand').forEach((button) => {
                if (button.dataset.expanded === 'false') button.click();
            });
        }
    });

    coinsList.appendChild(reloadButton);
    coinsList.appendChild(showAllVariantsButton);
    coinsList.appendChild(showAllCoinsButton);

    coins.forEach((coinType) => {
        const coinTypeDiv = document.createElement('div');
        coinTypeDiv.classList.add('coin-type');
        coinTypeDiv.textContent = coinType.name;

        const coinTypeImg = document.createElement('img');
        coinTypeImg.src = `/files/coins/${coinType.coins[coinType.coins.length - 1]?.image || 'default.png'}`;
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
            const coinVariantDiv = document.createElement('div');
            coinVariantDiv.classList.add('coin-variant', 'hidden');
            coinVariantDiv.textContent = `${coinVariant.name} (${coinVariant.years})`;

            const coinVariantImg = document.createElement('img');
            coinVariantImg.src = `/files/coins/${coinVariant.image || 'default.png'}`;
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

            const showNeedsUpgradeCoinsButton = document.createElement('button');
            showNeedsUpgradeCoinsButton.textContent = 'Hide coins needing upgrade';
            showNeedsUpgradeCoinsButton.dataset.shown = true;
            showNeedsUpgradeCoinsButton.addEventListener('click', () => {
                if (showNeedsUpgradeCoinsButton.dataset.shown === 'true') {
                    showNeedsUpgradeCoinsButton.dataset.shown = false;
                    showNeedsUpgradeCoinsButton.textContent = 'Show coins needing upgrade';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.upgrade === 'true') coin.classList.add('hidden');
                    });
                } else {
                    showNeedsUpgradeCoinsButton.dataset.shown = true;
                    showNeedsUpgradeCoinsButton.textContent = 'Hide coins needing upgrade';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.upgrade === 'true') coin.classList.remove('hidden');
                    });
                }
            });

            const showObtainedCoinsButton = document.createElement('button');
            showObtainedCoinsButton.textContent = 'Show obtained coins';
            showObtainedCoinsButton.dataset.shown = false;
            showObtainedCoinsButton.addEventListener('click', () => {
                if (showObtainedCoinsButton.dataset.shown === 'true') {
                    showObtainedCoinsButton.dataset.shown = false;
                    showObtainedCoinsButton.textContent = 'Show obtained coins';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.obtained === 'true' && coin.dataset.upgrade !== 'true') coin.classList.add('hidden');
                    });
                } else {
                    showObtainedCoinsButton.dataset.shown = true;
                    showObtainedCoinsButton.textContent = 'Hide obtained coins';
                    coinVariantTable.querySelectorAll('tbody tr').forEach((coin) => {
                        if (coin.dataset.obtained === 'true' && coin.dataset.upgrade !== 'true') coin.classList.remove('hidden');
                    });
                }
            });

            const coinVariantTable = document.createElement('table');
            coinVariantTable.classList.add('info-table', 'coin-variant-table', 'hidden');

            const coinVariantTableHead = document.createElement('thead');
            const coinVariantTableHeadRow = document.createElement('tr');

            ['Year', 'Mint Mark', 'Note', 'Obtained', 'Needs Upgrade'].forEach((header) => {
                const infoHeader = document.createElement('th');
                infoHeader.textContent = header;
                coinVariantTableHeadRow.appendChild(infoHeader);
            });

            coinVariantTableHead.appendChild(coinVariantTableHeadRow);
            coinVariantTable.appendChild(coinVariantTableHead);

            const coinVariantTableBody = document.createElement('tbody');

            coinVariant.coins.forEach((coin) => {
                const row = document.createElement('tr');
                if (coin.obtained) row.dataset.obtained = true;
                if (coin.upgrade) row.dataset.upgrade = true;
                if (coin.obtained && !coin.upgrade) row.classList.add('hidden');

                const year = document.createElement('td');
                year.textContent = coin.year;
                row.appendChild(year);

                const mintMark = document.createElement('td');
                const tooltip = document.createElement('span');
                tooltip.classList.add('tooltip-bottom');
                tooltip.dataset.tooltip = mintMarks[coin.mintMark] || 'Likely Philadelphia (PA)';
                tooltip.textContent = coin.mintMark || 'None';
                mintMark.appendChild(tooltip);
                row.appendChild(mintMark);

                const note = document.createElement('td');
                note.textContent = coin.note || '';
                row.appendChild(note);

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
            coinVariantDiv.appendChild(showNeedsUpgradeCoinsButton);
            coinVariantDiv.appendChild(showObtainedCoinsButton);
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
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeButton = document.getElementById('close-modal');

    for (const image of images)
        image.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImage.src = image.src;
            modalCaption.innerHTML = image.alt;
        });

    [closeButton, modal].forEach((element) => {
        element.addEventListener('click', () => (modal.style.display = 'none'));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') modal.style.display = 'none';
    });
}
