// @ts-expect-error (URL import, types added below)
import toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify-es.js';
// @ts-expect-error (URL import, types added below)
import twemoji from 'https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.esm.js';

interface Twemoji {
    parse: (element: HTMLElement, options: { base: string; folder: string; ext: string }) => void;
}

declare function toastify(options: { text: string; duration: number; position: string; style: Record<string, string> }): {
    showToast: () => void;
};

/**
 * Update emojis on the loaded content.
 */
export function twemojiUpdate() {
    (twemoji as Twemoji).parse(document.body, {
        base: 'https://raw.githubusercontent.com/jdecked/twemoji/main/assets/',
        folder: 'svg',
        ext: '.svg',
    });
}

/**
 * Displays a popup alert.
 * @param text The string to display.
 * @param type The alert type.
 * @param duration The duration for the popup to show (in milliseconds).
 */
export function showAlert(text: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) {
    toastify({
        text: text || 'No text specified!',
        duration: duration ?? 2000,
        position: 'center',
        style: {
            background: '#333',
            borderRadius: '5px',
            boxShadow: 'none',
            color: `var(--${type}-color-300)`,
            fontFamily: 'var(--font-family)',
            fontSize: '17px',
            fontWeight: '600',
            minWidth: '150px',
            padding: '16px 30px',
            textAlign: 'center',
        },
    }).showToast();
}

/**
 * Updates the icon of the specified element.
 * @param element The element to update.
 * @param type The type of icon to show.
 * @param remove Whether to the remove the icon after 2 seconds (defaults to `true`).
 */
export function showResult(element: HTMLElement, type: 'success' | 'error' | 'warning', remove = true) {
    const className = `button-result-${type}`;

    element.classList.add(className);

    if (remove)
        setTimeout(() => {
            element.classList.remove(className);
        }, 2000);
}

/**
 * Updates the arrow icon of the specified element.
 * @param element The element to update.
 * @param type The type of icon to show.
 * @param arrowType The direction of the arrow (defaults to `right`).
 */
export function updateArrow(
    element: HTMLElement,
    type: 'success' | 'error' | 'warning' | 'info' | 'reset',
    arrowType: 'up' | 'down' | 'right' | 'left' = 'right',
) {
    element.style.color = `var(--${type === 'reset' ? 'neutral' : type}-color-300)`;
    element.className = `fa-solid fa-arrow-${arrowType}`;
}

/**
 * Copy an element's value.
 * @param element The element to update.
 * @param copyElement The element of the value to be copied.
 */
export function copyValue(element: HTMLButtonElement, copyElement: HTMLInputElement | HTMLTextAreaElement) {
    void navigator.clipboard.writeText(copyElement.value);

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
    void navigator.clipboard.writeText(text);

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
    return input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
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
export function addAnimation(element: HTMLElement, animation: string) {
    return new Promise((resolve) => {
        element.classList.add(animation);

        element.addEventListener(
            'animationend',
            (event) => {
                event.stopPropagation();
                element.classList.remove(animation);
                resolve('Animation ended');
            },
            { once: true },
        );
    });
}

/**
 * Converts a string to title case.
 * @param string The string to convert.
 */
export function titleCase(string: string) {
    return string
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Shuffles the order of items in an array.
 * @param array The array to shuffle.
 */
export function shuffleArray(array: unknown[]) {
    for (let index = array.length - 1; index > 0; index--) {
        const randomNumber = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomNumber]] = [array[randomNumber], array[index]];
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
    const byteNumbers = Array.from({ length: byteCharacters.length }) as number[]; // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion
    for (let index = 0; index < byteCharacters.length; index++) byteNumbers[index] = byteCharacters.codePointAt(index)!;

    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: mimeType + ';base64' });
    return URL.createObjectURL(file);
}

const errorMessages: Record<number, string> = {
    [GeolocationPositionError.PERMISSION_DENIED]: 'Permission to fetch location data denied! Allow this then reload.',
    [GeolocationPositionError.POSITION_UNAVAILABLE]: 'Location information is unavailable. Try again later.',
    [GeolocationPositionError.TIMEOUT]: 'The request to get your location timed out. Try again later.',
};

/**
 * Requests and handles geolocation from the user's browser.
 * @param callback The function to call with the resulting position.
 * @param errorElement The element to update with any error during geolocation request.
 */
export function requestGeolocation(callback: (position: GeolocationPosition) => unknown, errorElement: HTMLElement) {
    navigator.geolocation.getCurrentPosition(callback, (error) => {
        const errorSpan = document.createElement('span');
        errorSpan.classList.add('error');
        errorSpan.textContent = errorMessages[error.code] ?? 'Unable to fetch location data!';

        errorElement.innerHTML = '';
        errorElement.append(errorSpan);
    });
}

/**
 * Adds modal functionality to all images with the "popup-image" class.
 */
export function loadPopupImages() {
    const modal = document.querySelector<HTMLDivElement>('#modal')!;
    const images = document.querySelectorAll<HTMLImageElement>('img.popup-image');
    const modalImage = document.querySelector<HTMLImageElement>('#modal-image')!;
    const modalCaption = document.querySelector<HTMLDivElement>('#modal-caption')!;
    const closeButton = document.querySelector<HTMLSpanElement>('#close-modal')!;

    for (const image of images)
        image.addEventListener('click', () => {
            modal.style.display = 'block';
            if (modalImage.src !== image.src) modalImage.src = image.src;
            if (modalCaption.textContent !== image.alt) modalCaption.textContent = image.alt;
        });

    for (const element of [closeButton, modal]) element.addEventListener('click', () => (modal.style.display = 'none'));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') modal.style.display = 'none';
    });
}
