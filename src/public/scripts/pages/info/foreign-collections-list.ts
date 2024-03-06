import { ForeignCollectionsList } from '../../../../route-handlers/foreign-collections-list.js';
import { showAlert, showResult } from '../../functions.js';

const passwordInput = document.querySelector('#login-password') as HTMLInputElement;
const loginButton = document.querySelector('#login-button') as HTMLButtonElement;
const collectionsListMessage = document.querySelector('#collections-list-message') as HTMLDivElement;
const collectionsList = document.querySelector('#collections-list') as HTMLDivElement;
const collectionsListTableBody = collectionsList.querySelector('tbody') as HTMLTableSectionElement;
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
        if (newRowMessage.dataset.disabled === 'true') return;

        for (const element of collectionsListTableBody.querySelectorAll('[contenteditable]')) (element as HTMLElement).contentEditable = 'false';
        for (const input of collectionsListTableBody.querySelectorAll('input')) input.disabled = true;
        newRowMessage.dataset.disabled = 'true';

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

        newRowMessage.dataset.disabled = 'false';
    });
}

/**
 * Reloads the table's data from the stored variable.
 */
function reloadTableData() {
    while (collectionsListTableBody.children.length > 1) collectionsListTableBody.children[0].remove();

    for (const country of collectionData) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.contentEditable = 'true';

        if (country.name.includes(', ')) {
            const textAfter = country.name.slice(country.name.indexOf(', ') + 2);
            nameCell.textContent = textAfter + ' ' + country.name.slice(0, country.name.indexOf(','));
        } else nameCell.textContent = country.name;

        nameCell.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') event.preventDefault();
        });

        nameCell.addEventListener('paste', (event) => {
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

        nameCell.addEventListener('focus', () => (nameCell.textContent = country.name));

        nameCell.addEventListener('blur', async () => {
            nameCell.contentEditable = 'false';
            for (const input of collectionsListTableBody.querySelectorAll('input')) input.disabled = true;
            newRowMessage.dataset.disabled = 'true';

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

            newRowMessage.dataset.disabled = 'false';
        });

        row.append(nameCell);

        for (const type of ['coins', 'banknotes', 'stamps'] as const) {
            const obtained = country.data[type];

            const cell = document.createElement('td');
            cell.dataset.obtained = typeof obtained === 'boolean' ? obtained.toString() : 'na';
            row.append(cell);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = !!obtained;

            if (obtained === null) checkbox.indeterminate = true;

            checkbox.addEventListener('click', async () => {
                nameCell.contentEditable = 'false';
                for (const input of collectionsListTableBody.querySelectorAll('input')) input.disabled = true;
                newRowMessage.dataset.disabled = 'true';

                let obtained;
                if (cell.dataset.obtained === 'na') {
                    obtained = false;
                    cell.dataset.obtained = 'false';
                } else {
                    obtained = cell.dataset.obtained === 'false' ? true : null;
                    cell.dataset.obtained = obtained ? 'true' : 'na';
                }

                let sortedData = { ...country.data, [type]: obtained };
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

                newRowMessage.dataset.disabled = 'false';
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
