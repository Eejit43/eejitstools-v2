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
 * @param {'success'|'error'} color 'success', 'error', or color
 * @param {number} duration The duration of the popup in milliseconds
 */
export function showAlert(text, color, duration) {
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
export function showResult(id, type, color = '#009c3f', icon = 'check', remove = true) {
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
export function resetResult(id) {
    const element = document.getElementById(id + '-runResult');
    element.style.color = '';
    element.className = '';
}

/**
 * Updates the arrow icon of the specified element
 * @param {HTMLElement} element The element to update
 * @param {'success'|'error'|'reset'} [type] The type of icon to show ('success', 'error', or 'reset')
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
 * Updates an elements innerHTML to the provided string if it isn't the same as the provided string
 * @param {HTMLElement} element the element to update
 * @param {string} string the content to update the element with
 */
export function updateInnerHTML(element, string) {
    if (element.innerHTML !== string) element.innerHTML = string;
}

/**
 * Adds an animation class to an element, and removes it upon completion
 * @param {string} element selectors for element
 * @param {string} animation the animation to add
 * @returns {Promise<void>}
 */
export const addAnimation = (element, animation) =>
    new Promise((resolve) => {
        const node = document.querySelector(element);

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
 * @returns {string} the string in title case
 */
export function titleCase(string) {
    return string
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(' ');
}
