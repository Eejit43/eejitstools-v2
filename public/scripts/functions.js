import toastify from 'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.2/toastify-es.js';
import twemoji from 'https://twemoji.maxcdn.com/v/latest/twemoji.esm.js';

/**
 * Update emojis on the loaded content
 */
export function twemojiUpdate() {
    twemoji.parse(document.body, { folder: 'svg', ext: '.svg' });
}

/**
 * Displays a popup alert
 * @param {string} text The string to display
 * @param {string} color 'success', 'error', or color
 */
export function showAlert(text, color) {
    color = color.toLowerCase();
    if (color === 'success') color = '#009c3f';
    if (color === 'error') color = '#ff5555';
    toastify({ text: text || 'No text specified!', duration: 2000, position: 'center', style: { background: '#333', boxShadow: 'none', minWidth: '150px', textAlign: 'center', fontFamily: '"Source Sans Pro", sans-serif', fontWeight: '600', fontSize: '17px', color: color || '#009c3f', padding: '16px 30px' } }).showToast();
}

/**
 * Updates the icon of the specified element
 * @param {string} id The prefix of the element ID to update
 * @param {string} [type] The type of icon to show ('success' or 'error')
 * @param {string} [color] The color of the icon to show
 * @param {string} [icon] The icon of the icon to show
 */
export function showResult(id, type, color = '#009c3f', icon = 'check') {
    const oldElement = document.getElementById(id + '-runResult');
    const newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    if (type === 'success') {
        color = '#009c3f';
        icon = 'check';
    } else if (type === 'error') {
        color = '#ff5555';
        icon = 'xmark';
    }
    newElement.style.color = color;
    newElement.className = 'fa-solid fa-' + icon;
    setTimeout(() => {
        newElement.style.color = '';
        newElement.className = '';
    }, 2000);
}

/**
 * Removes the icon of the specified element
 * @param {string} id The prefix of the element ID to update
 */
export function resetResult(id) {
    const element = document.getElementById(id + '-runResult');
    element.style.color = '';
    element.className = '';
}

/**
 * Updates the arrow icon of the specified element
 * @param {HTMLElement} element The element to update
 * @param {string} [type] The type of icon to show ('success', 'error', or 'reset')
 * @param {string} [arrowType='right'] The direction of the arrow (defaults to 'right')
 */
export function updateArrow(element, type, arrowType = 'right') {
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
    element.style.color = color;
    element.className = 'fa-solid fa-' + icon;
}

/**
 * Copy an element's value
 * @param {HTMLElement} element The element to update
 * @param {HTMLElement} copyElement The element of the value to be copied
 */
export function copyValue(element, copyElement) {
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
 * @param {HTMLElement} element The element to update
 * @param {string} text The text to copy
 */
export function copyText(element, text) {
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
 * @returns {string} Formatted string
 */
export function escapeHTML(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

/**
 * Converts a string to HTML
 * @param {string} string String to convert
 * @returns {Document} HTML
 */
export function stringToHTML(string) {
    return new DOMParser().parseFromString(string, 'text/html');
}

/**
 * Whether or not the provided keyword(s) are included in the input
 * @param {string[]} keywords The keyword(s) to check
 * @param {string} string The text to check the keywords against
 * @returns {boolean}
 */
export function matchesKeywords(keywords, string) {
    for (let i = 0; i < keywords.length; i++) if (keywords[i].includes(string)) return true;
    return false;
}
