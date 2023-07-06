import { showAlert, stringToHtml } from '../../functions.js';

const svgInput = document.getElementById('svg-input');
const svgPreview = document.getElementById('svg-preview');
const width = document.getElementById('width-input');
const height = document.getElementById('height-input');
const canvas = document.getElementById('png-canvas');

let svg;
document.getElementById('load-svg').addEventListener('click', () => {
    const loadedSvg = stringToHtml(svgInput.value).querySelector('svg');
    if (!loadedSvg) return showAlert('No SVG found in input!', 'error');
    svgPreview.innerHTML = loadedSvg.outerHTML;
    svg = svgPreview.querySelector('svg');
    width.value = svg.getBoundingClientRect().width;
    height.value = svg.getBoundingClientRect().height;
    if (svg.width.baseVal.value >= 200) svg.removeAttribute('width');
    if (svg.height.baseVal.value >= 200) svg.removeAttribute('height');
});

document.getElementById('save-png').addEventListener('click', () => {
    const preWidth = svg.getAttribute('width');
    const preHeight = svg.getAttribute('height');
    if ((width.value || 100) >= 10000 || (width.value || 100) <= 0 || (height.value || 100) >= 10000 || (height.value || 100) <= 0) return showAlert('Height and width must be between 0 and 10,000 (exclusive)', 'error');
    canvas.width = width.value || 100;
    canvas.height = height.value || 100;
    svg.setAttribute('width', width.value || 100);
    svg.setAttribute('height', height.value || 100);
    const data = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    image.src = url;
    image.addEventListener('load', () => {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        const uri = canvas.toDataURL('image/png').replace('image/png', 'octet/stream');
        const anchor = document.createElement('a');
        document.body.appendChild(anchor);
        anchor.style.display = 'none';
        anchor.href = uri;
        anchor.download = (svg.id || svg.getAttribute('name') || svg.getAttribute('aria-label') || 'untitled') + '.png';
        anchor.click();
        URL.revokeObjectURL(uri);
        document.body.removeChild(anchor);
    });
    if (svg.width.baseVal.value >= 200) svg.removeAttribute('width');
    if (svg.height.baseVal.value >= 200) svg.removeAttribute('height');
    if (preWidth) svg.setAttribute('width', preWidth);
    if (preHeight) svg.setAttribute('height', preHeight);
});

document.getElementById('clear').addEventListener('click', () => {
    svgInput.value = '';
    svgPreview.textContent = '';
    width.value = '';
    height.value = '';
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    showAlert('Cleared!', 'success');
});
