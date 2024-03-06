import { ForeignCollectionsList } from '../../../../route-handlers/foreign-collections-list.js';
import { showAlert, showResult } from '../../functions.js';

const passwordInput = document.querySelector('#login-password') as HTMLInputElement;
const loginButton = document.querySelector('#login-button') as HTMLButtonElement;
const collectionsListMessage = document.querySelector('#collections-list-message') as HTMLDivElement;
const collectionsList = document.querySelector('#collections-list') as HTMLDivElement;
const newRowMessage = document.querySelector('#new-row-message') as HTMLTableRowElement;
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

        await loadCollectionList();

        exportDataButton.disabled = false;
    } else {
        showAlert('Incorrect password!', 'error');
        showResult(loginButton, 'error');
        loginButton.disabled = true;
        setTimeout(() => (loginButton.disabled = false), 1000);
    }
});

let collectionData: ForeignCollectionsList;

/**
 * Load the coins list.
 */
async function loadCollectionList() {
    collectionData = (await (await fetch(`/foreign-collections-list?password=${passwordInput.dataset.input!}`)).json()) as ForeignCollectionsList;

    collectionsListMessage.style.display = 'none';
    collectionsList.style.display = 'block';

    reloadTableData();

    newRowMessage.addEventListener('click', async () => {
        let id: string;
        do id = Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000).toString();
        while (collectionData.some((country) => country.id === id));

        const result = (await (
            await fetch('/foreign-collections-list-add-country', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Unknown Country', data: { coins: false, banknotes: false, stamps: false }, password: passwordInput.dataset.input }),
            })
        ).json()) as { error?: string; data: ForeignCollectionsList };

        if (result.error) showAlert(result.error, 'error');
        else {
            showAlert('Successfully added a new country row!', 'success');

            collectionData = result.data;

            reloadTableData();
        }
    });
}

/**
 * Reloads the table's data from the stored variable.
 */
function reloadTableData() {
    const tableBody = collectionsList.querySelector('tbody') as HTMLTableSectionElement;

    while (tableBody.children.length > 1) tableBody.children[0].remove();

    for (const country of collectionData) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = country.name;
        nameCell.contentEditable = 'true';
        nameCell.addEventListener('blur', async () => {
            const result = (await (
                await fetch('/foreign-collections-list-edit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: country.id, name: nameCell.textContent, data: country.data, password: passwordInput.dataset.input }),
                })
            ).json()) as { error?: string; data: ForeignCollectionsList };

            if (result.error) showAlert(result.error, 'error');
            else {
                showAlert('Successfully edited the country name!', 'success');

                collectionData = result.data;

                reloadTableData();
            }
        });
        row.append(nameCell);

        for (const type of ['coins', 'banknotes', 'stamps'] as const) {
            const obtained = country.data[type];

            const cell = document.createElement('td');
            row.append(cell);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = obtained;
            checkbox.addEventListener('change', async () => {
                let sortedData = { ...country.data, [type]: checkbox.checked };
                sortedData = { coins: sortedData.coins, banknotes: sortedData.banknotes, stamps: sortedData.stamps };

                const result = (await (
                    await fetch('/foreign-collections-list-edit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: country.id, name: country.name, data: sortedData, password: passwordInput.dataset.input }),
                    })
                ).json()) as { error?: string; data: ForeignCollectionsList };

                if (result.error) showAlert(result.error, 'error');
                else {
                    showAlert(`Successfully updated the country's "${type}" obtained status!`, 'success');

                    collectionData = result.data;

                    reloadTableData();
                }
            });
            cell.append(checkbox);
        }

        newRowMessage.before(row);
    }
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

        await loadCollectionList();

        exportDataButton.disabled = false;
    } else {
        showAlert('Incorrect password!', 'error');
        showResult(loginButton, 'error');
    }
}

// Add functionality to data exporter
exportDataButton.addEventListener('click', async () => {
    const coinsData = (await (await fetch(`/foreign-collections-list?password=${passwordInput.dataset.input!}`)).json()) as ForeignCollectionsList & { error?: string };

    if (coinsData.error) return showAlert(coinsData.error, 'error');

    const file = new Blob([JSON.stringify(coinsData)], { type: 'application/json' });
    const anchor = document.createElement('a');
    const url = URL.createObjectURL(file);
    anchor.href = url;
    anchor.download = `foreign-collection-list data (${new Date().toLocaleString()}).json`;
    anchor.click();

    setTimeout(() => URL.revokeObjectURL(url), 0);
});
