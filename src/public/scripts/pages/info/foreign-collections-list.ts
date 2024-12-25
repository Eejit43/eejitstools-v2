import type { ForeignCollectionsList } from '../../../../route-handlers/foreign-collections-list.js';
import { showAlert, showResult } from '../../functions.js';

const passwordInput = document.querySelector<HTMLInputElement>('#login-password')!;
const loginButton = document.querySelector<HTMLButtonElement>('#login-button')!;
const collectionsListMessage = document.querySelector<HTMLDivElement>('#collections-list-message')!;
const collectionsList = document.querySelector<HTMLDivElement>('#collections-list')!;
const collectionsListTableBody = collectionsList.querySelector<HTMLTableSectionElement>('tbody')!;
const newRowMessage = document.querySelector<HTMLTableRowElement>('#new-row-message')!;
const exportDataButton = document.querySelector<HTMLButtonElement>('#export-data')!;

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
    collectionData = (await (
        await fetch(`/foreign-collections-list?password=${passwordInput.dataset.input!}`)
    ).json()) as ForeignCollectionsList;

    collectionsListMessage.style.display = 'none';
    collectionsList.style.display = 'block';

    reloadTableData();

    newRowMessage.addEventListener('click', async () => {
        if (newRowMessage.dataset.disabled === 'true') return;

        disableElements();

        let id: string;
        do id = Math.floor(Math.random() * 9_000_000_000 + 1_000_000_000).toString();
        while (collectionData.some((entry) => entry.id === id));

        const result = (await (
            await fetch('/foreign-collections-list-add-entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Unknown Entry',
                    type: 'Unknown Type',
                    data: { coins: false, banknotes: false, stamps: false },
                    password: passwordInput.dataset.input,
                }),
            })
        ).json()) as { error?: string; data: ForeignCollectionsList };

        if (result.error) {
            showAlert(result.error, 'error');
            reloadTableData();
        } else {
            showAlert('Successfully added a new entry row!', 'success');

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

    for (const entry of collectionData) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.contentEditable = 'plaintext-only';

        if (entry.name.includes(', ')) {
            const textAfter = entry.name.slice(entry.name.indexOf(', ') + 2);
            nameCell.textContent = textAfter + ' ' + entry.name.slice(0, entry.name.indexOf(','));
        } else nameCell.textContent = entry.name;

        nameCell.addEventListener('focus', () => (nameCell.textContent = entry.name));

        nameCell.addEventListener('blur', async () => {
            disableElements();

            const result = (await (
                await fetch('/foreign-collections-list-edit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: entry.id,
                        name: nameCell.textContent,
                        type: entry.type,
                        data: entry.data,
                        password: passwordInput.dataset.input,
                    }),
                })
            ).json()) as { error?: string; data: ForeignCollectionsList };

            if (result.error) {
                showAlert(result.error, 'error');
                reloadTableData();
            } else {
                showAlert('Successfully edited the entry name!', 'success');

                collectionData = result.data;

                reloadTableData();
            }

            newRowMessage.dataset.disabled = 'false';
        });

        row.append(nameCell);

        const typeCell = document.createElement('td');
        typeCell.contentEditable = 'plaintext-only';
        typeCell.textContent = entry.type;

        typeCell.addEventListener('blur', async () => {
            disableElements();

            const result = (await (
                await fetch('/foreign-collections-list-edit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: entry.id,
                        name: entry.name,
                        type: typeCell.textContent,
                        data: entry.data,
                        password: passwordInput.dataset.input,
                    }),
                })
            ).json()) as { error?: string; data: ForeignCollectionsList };

            if (result.error) {
                showAlert(result.error, 'error');
                reloadTableData();
            } else {
                showAlert('Successfully edited the entry type!', 'success');

                collectionData = result.data;

                reloadTableData();
            }

            newRowMessage.dataset.disabled = 'false';
        });

        row.append(typeCell);

        for (const element of [nameCell, typeCell]) {
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

        for (const type of ['coins', 'banknotes', 'stamps'] as const) {
            const obtained = entry.data[type];

            const cell = document.createElement('td');
            cell.dataset.obtained = typeof obtained === 'boolean' ? obtained.toString() : 'na';
            row.append(cell);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = !!obtained;

            if (obtained === null) checkbox.indeterminate = true;

            checkbox.addEventListener('click', async () => {
                disableElements();

                let obtained;
                if (cell.dataset.obtained === 'na') {
                    obtained = false;
                    cell.dataset.obtained = 'false';
                } else {
                    obtained = cell.dataset.obtained === 'false' ? true : null;
                    cell.dataset.obtained = obtained ? 'true' : 'na';
                }

                let sortedData = { ...entry.data, [type]: obtained };
                sortedData = { coins: sortedData.coins, banknotes: sortedData.banknotes, stamps: sortedData.stamps };

                const result = (await (
                    await fetch('/foreign-collections-list-edit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: entry.id,
                            name: entry.name,
                            type: entry.type,
                            data: sortedData,
                            password: passwordInput.dataset.input,
                        }),
                    })
                ).json()) as { error?: string; data: ForeignCollectionsList };

                if (result.error) {
                    showAlert(result.error, 'error');
                    reloadTableData();
                } else {
                    showAlert(`Successfully updated the entry's "${type}" obtained status!`, 'success');

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

/**
 * Disables all elements in the table.
 */
function disableElements() {
    for (const element of collectionsListTableBody.querySelectorAll('[contenteditable]'))
        (element as HTMLElement).contentEditable = 'false';
    for (const input of collectionsListTableBody.querySelectorAll('input')) input.disabled = true;
    newRowMessage.dataset.disabled = 'true';
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
    const coinsData = (await (
        await fetch(`/foreign-collections-list?password=${passwordInput.dataset.input!}`)
    ).json()) as ForeignCollectionsList & { error?: string };

    if (coinsData.error) {
        showAlert(coinsData.error, 'error');
        return;
    }

    const file = new Blob([JSON.stringify(coinsData)], { type: 'application/json' });
    const anchor = document.createElement('a');
    const url = URL.createObjectURL(file);
    anchor.href = url;
    anchor.download = `foreign-collection-list data (${new Date().toLocaleString()}).json`;
    anchor.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 0);
});
