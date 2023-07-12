// @ts-ignore (URL import, types added below)
import toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify-es.js';
// @ts-ignore (URL import, types added below)
import twemoji from 'https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.esm.js';

interface Twemoji {
    parse: (element: HTMLElement, options: { base: string; folder: string; ext: string }) => void;
}

/**
 * Update emojis on the loaded content.
 */
export function twemojiUpdate() {
    (twemoji as Twemoji).parse(document.body, { base: 'https://raw.githubusercontent.com/jdecked/twemoji/main/assets/', folder: 'svg', ext: '.svg' });
}

declare function toastify(options: { text: string; duration: number; position: string; style: Record<string, string> }): {
    showToast: () => void;
};

/**
 * Displays a popup alert.
 * @param text The string to display.
 * @param color The color value (or `'success'` or `'error'`).
 * @param duration The duration of the popup in milliseconds.
 */
export function showAlert(text: string, color: string, duration?: number) {
    color = color.toLowerCase();
    if (color === 'success') color = '#009c3f';
    else if (color === 'error') color = '#ff5555';
    toastify({
        text: text || 'No text specified!',
        duration: duration ?? 2000,
        position: 'center',
        style: {
            background: '#333',
            borderRadius: '5px',
            boxShadow: 'none',
            color: color || '#009c3f',
            fontFamily: '"Source Sans Pro", sans-serif',
            fontSize: '17px',
            fontWeight: '600',
            minWidth: '150px',
            padding: '16px 30px',
            textAlign: 'center'
        }
    }).showToast();
}

/**
 * Updates the icon of the specified element.
 * @param id The prefix of the element ID to update.
 * @param type The type of icon to show.
 * @param color The color of the icon to show.
 * @param icon The icon of the icon to show.
 * @param remove Whether to the remove the icon after 2 seconds (defaults to `true`).
 */
export function showResult(id: string, type: 'success' | 'error' | null, color = '#009c3f', icon = 'check', remove = true) {
    const oldElement = document.getElementById(id + '-result')!;
    const newElement = oldElement.cloneNode(true) as HTMLElement;
    oldElement.parentNode!.replaceChild(newElement, oldElement);
    if (type === 'success') {
        color = '#009c3f';
        icon = 'check';
    } else if (type === 'error') {
        color = '#ff5555';
        icon = 'xmark';
    }
    newElement.style.color = color;
    newElement.className = 'fa-solid fa-' + icon;
    if (remove)
        setTimeout(() => {
            newElement.style.color = '';
            newElement.className = '';
        }, 2000);
}

/**
 * Removes the icon of the specified element.
 * @param id The prefix of the element ID to update.
 */
export function resetResult(id: string) {
    const element = document.getElementById(id + '-result')!;
    element.style.color = '';
    element.className = '';
}

/**
 * Updates the arrow icon of the specified element.
 * @param element The element to update.
 * @param type The type of icon to show.
 * @param arrowType The direction of the arrow (defaults to `right`).
 */
export function updateArrow(element: HTMLElement, type: 'success' | 'error' | 'reset', arrowType = 'right') {
    let color, icon;
    if (type === 'success') {
        color = '#009c3f';
        icon = `arrow-${arrowType}`;
    } else if (type === 'error') {
        color = '#ff5555';
        icon = 'xmark';
    } else if (type === 'reset') {
        color = 'dimgray';
        icon = `arrow-${arrowType}`;
    }
    element.style.color = color!;
    element.className = 'fa-solid fa-' + icon!;
}

/**
 * Copy an element's value.
 * @param element The element to update.
 * @param copyElement The element of the value to be copied.
 */
export function copyValue(element: HTMLButtonElement, copyElement: HTMLInputElement | HTMLTextAreaElement) {
    navigator.clipboard.writeText(copyElement.value);

    const content = element.textContent;

    element.disabled = true;
    element.textContent = 'Copied!';
    showAlert('Copied!', 'success');

    setTimeout(() => {
        element.disabled = false;
        element.textContent = content;
    }, 2000);
}

/**
 * Copy a string.
 * @param element The element to update.
 * @param text The text to copy.
 */
export function copyText(element: HTMLButtonElement, text: string) {
    navigator.clipboard.writeText(text);

    const content = element.textContent;

    element.disabled = true;
    element.textContent = 'Copied!';
    showAlert('Copied!', 'success');

    setTimeout(() => {
        element.disabled = false;
        element.textContent = content;
    }, 2000);
}

/**
 * Escapes HTML syntax in a string.
 * @param input String to be modified.
 */
export function escapeHtml(input: string) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/**
 * Converts a string to HTML.
 * @param string String to convert.
 */
export function stringToHtml(string: string) {
    return new DOMParser().parseFromString(string, 'text/html');
}

/**
 * Updates an element's innerHTML to the provided string if it isn't the same as the provided string.
 * @param element The element to update.
 * @param string The content to update the element with.
 */
export function updateInnerHtml(element: HTMLElement, string: string) {
    if (element.innerHTML !== string) element.innerHTML = string;
}

/**
 * Adds an animation class to an element, and removes it upon completion.
 * @param element Selectors for element.
 * @param animation The animation to add.
 */
export const addAnimation = (element: string, animation: string) =>
    new Promise((resolve) => {
        const node = document.querySelector(element)!;

        node.classList.add(animation);

        node.addEventListener(
            'animationend',
            (event) => {
                event.stopPropagation();
                node.classList.remove(animation);
                resolve('Animation ended');
            },
            { once: true }
        );
    });

/**
 * Converts a string to title case.
 * @param string The string to convert.
 */
export function titleCase(string: string) {
    return string
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(' ');
}

/**
 * Shuffles the order of items in an array.
 * @param array The array to shuffle.
 */
export function shuffleArray(array: unknown[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Creates a base64 object URL.
 * @param data The base64 to create an object URL for.
 * @param mimeType The mimeType of the given base64.
 * @see https://stackoverflow.com/questions/52092093
 */
export function createBase64ObjectUrl(data: string, mimeType: string) {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);

    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: mimeType + ';base64' });
    return URL.createObjectURL(file);
}
