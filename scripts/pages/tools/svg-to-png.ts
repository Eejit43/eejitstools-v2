import { showAlert, stringToHtml } from '../../functions.js';

const svgInput = document.getElementById('svg-input') as HTMLTextAreaElement;
const loadSvgButton = document.getElementById('load-svg') as HTMLButtonElement;
const clearButton = document.getElementById('clear') as HTMLButtonElement;
const svgPreview = document.getElementById('svg-preview') as HTMLDivElement;
const width = document.getElementById('width-input') as HTMLInputElement;
const height = document.getElementById('height-input') as HTMLInputElement;
const savePngButton = document.getElementById('save-png') as HTMLButtonElement;
const canvas = document.getElementById('png-canvas') as HTMLCanvasElement;

const context = canvas.getContext('2d') as CanvasRenderingContext2D;

let svg: SVGSVGElement;
loadSvgButton.addEventListener('click', () => {
    const loadedSvg = stringToHtml(svgInput.value).querySelector('svg');
    if (!loadedSvg) return showAlert('No SVG found in input!', 'error');
    svgPreview.innerHTML = loadedSvg.outerHTML;
    svg = svgPreview.querySelector('svg') as SVGSVGElement;
    width.value = svg.getBoundingClientRect().width.toString();
    height.value = svg.getBoundingClientRect().height.toString();
    if (svg.width.baseVal.value >= 200) svg.removeAttribute('width');
    if (svg.height.baseVal.value >= 200) svg.removeAttribute('height');
});

savePngButton.addEventListener('click', () => {
    const preWidth = svg.getAttribute('width');
    const preHeight = svg.getAttribute('height');
    const parsedWidth = width.value ? parseInt(width.value) : 100;
    const parsedHeight = height.value ? parseInt(height.value) : 100;
    if (parsedWidth >= 10000 || parsedWidth <= 0 || parsedHeight >= 10000 || parsedHeight <= 0) return showAlert('Height and width must be between 0 and 10,000 (exclusive)', 'error');
    canvas.width = parsedWidth;
    canvas.height = parsedHeight;
    svg.setAttribute('width', parsedWidth.toString());
    svg.setAttribute('height', parsedHeight.toString());
    const data = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    image.src = url;
    image.addEventListener('load', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
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

clearButton.addEventListener('click', () => {
    svgInput.value = '';
    svgPreview.textContent = '';
    width.value = '';
    height.value = '';
    context.clearRect(0, 0, canvas.width, canvas.height);
    showAlert('Cleared!', 'success');
});
