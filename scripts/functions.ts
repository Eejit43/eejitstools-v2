// @ts-ignore (URL import, types added below)
import toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify-es.js';
// @ts-ignore (URL import, types added below)
import twemoji from 'https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.esm.js';

interface Twemoji {
    parse: (element: HTMLElement, options: { base: string; folder: string; ext: string }) => void;
}

/**
 * Update emojis on the loaded content
 */
export function twemojiUpdate() {
    (twemoji as Twemoji).parse(document.body, { base: 'https://raw.githubusercontent.com/jdecked/twemoji/main/assets/', folder: 'svg', ext: '.svg' });
}

declare function toastify(options: {
    text: string;
    duration: number;
    position: string;
    style: {
        [key: string]: string;
    };
}): {
    showToast: () => void;
};

/**
 * Displays a popup alert
 * @param {string} text The string to display
 * @param {'success'|'error'|string} color 'success', 'error', or color
 * @param {number} [duration] The duration of the popup in milliseconds
 */
export function showAlert(text: string, color: 'success' | 'error' | string, duration?: number) {
    color = color.toLowerCase();
    if (color === 'success') color = '#009c3f';
    if (color === 'error') color = '#ff5555';
    toastify({
        text: text || 'No text specified!',
        duration: duration || 2000,
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
 * Updates the icon of the specified element
 * @param {string} id The prefix of the element ID to update
 * @param {'success'|'error'} [type] The type of icon to show ('success' or 'error')
 * @param {string} [color='#009c3f'] The color of the icon to show
 * @param {string} [icon='check'] The icon of the icon to show
 * @param {boolean} [remove=true] Whether or not to the remove the icon after 2 seconds (default: true)
 */
export function showResult(id: string, type: 'success' | 'error' | null, color = '#009c3f', icon = 'check', remove = true) {
    const oldElement = document.getElementById(id + '-result') as HTMLElement;
    const newElement = oldElement.cloneNode(true) as HTMLElement;
    (oldElement.parentNode as ParentNode).replaceChild(newElement, oldElement);
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
 * Removes the icon of the specified element
 * @param {string} id The prefix of the element ID to update
 */
export function resetResult(id: string) {
    const element = document.getElementById(id + '-result') as HTMLElement;
    element.style.color = '';
    element.className = '';
}

/**
 * Updates the arrow icon of the specified element
 * @param {HTMLElement} element The element to update
 * @param {'success'|'error'|'reset'} [type] The type of icon to show ('success', 'error', or 'reset')
 * @param {string} [arrowType='right'] The direction of the arrow (defaults to 'right')
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
    element.style.color = color as string;
    element.className = 'fa-solid fa-' + (icon as string);
}

/**
 * Copy an element's value
 * @param {HTMLButtonElement} element The element to update
 * @param {HTMLInputElement|HTMLTextAreaElement} copyElement The element of the value to be copied
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
 * Copy a string
 * @param {HTMLButtonElement} element The element to update
 * @param {string} text The text to copy
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
 * Escapes HTML syntax in a string
 * @param {string} input String to be modified
 */
export function escapeHtml(input: string) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/**
 * Converts a string to HTML
 * @param {string} string String to convert
 */
export function stringToHtml(string: string) {
    return new DOMParser().parseFromString(string, 'text/html');
}

/**
 * Updates an element's innerHTML to the provided string if it isn't the same as the provided string
 * @param {HTMLElement} element the element to update
 * @param {string} string the content to update the element with
 */
export function updateInnerHtml(element: HTMLElement, string: string) {
    if (element.innerHTML !== string) element.innerHTML = string;
}

/**
 * Adds an animation class to an element, and removes it upon completion
 * @param {string} element selectors for element
 * @param {string} animation the animation to add
 */
export const addAnimation = (element: string, animation: string) =>
    new Promise((resolve) => {
        const node = document.querySelector(element) as HTMLElement;

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
 * Converts a string to title case
 * @param {string} string the string to convert
 */
export function titleCase(string: string) {
    return string
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(' ');
}
