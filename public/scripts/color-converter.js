// Some formulas modified from https://css-tricks.com/converting-color-spaces-in-javascript/

const hexInput = document.getElementById('hex-input');
const hexDisplay = document.getElementById('hex-display');
const hexRgb = document.getElementById('hex-rgb');
const hexRgbCopy = document.getElementById('hex-rgb-copy');
const hexHsl = document.getElementById('hex-hsl');
const hexHslCopy = document.getElementById('hex-hsl-copy');
const rgbInput = document.getElementById('rgb-input');
const rgbDisplay = document.getElementById('rgb-display');
const rgbHex = document.getElementById('rgb-hex');
const rgbHexCopy = document.getElementById('rgb-hex-copy');
const rgbHsl = document.getElementById('rgb-hsl');
const rgbHslCopy = document.getElementById('rgb-hsl-copy');
const hslInput = document.getElementById('hsl-input');
const hslDisplay = document.getElementById('hsl-display');
const hslHex = document.getElementById('hsl-hex');
const hslHexCopy = document.getElementById('hsl-hex-copy');
const hslRgb = document.getElementById('hsl-rgb');
const hslRgbCopy = document.getElementById('hsl-rgb-copy');

/* Add event listeners */
hexInput.addEventListener('input', hex);
hexRgbCopy.addEventListener('click', () => {
    copyValue(hexRgbCopy, hexRgb);
});
hexHslCopy.addEventListener('click', () => {
    copyValue(hexHslCopy, hexHsl);
});
rgbInput.addEventListener('input', rgb);
rgbHexCopy.addEventListener('click', () => {
    copyValue(rgbHexCopy, rgbHex);
});
rgbHslCopy.addEventListener('click', () => {
    copyValue(rgbHslCopy, rgbHsl);
});
hslInput.addEventListener('input', hsl);
hslHexCopy.addEventListener('click', () => {
    copyValue(hslHexCopy, hslHex);
});
hslRgbCopy.addEventListener('click', () => {
    copyValue(hslRgbCopy, hslRgb);
});

function hex() {
    let hex = hexInput.value;
    if (hex.match(/^#([\da-f]{3}){1,2}$/i)) {
        hex = hex.substring(1);
        hexDisplay.style.backgroundColor = '#' + hex;
        hexDisplay.innerHTML = '';
        // To RBG
        let r = 0,
            g = 0,
            b = 0;
        if (hex.length === 3) {
            r = '0x' + hex[0] + hex[0];
            g = '0x' + hex[1] + hex[1];
            b = '0x' + hex[2] + hex[2];
        } else if (hex.length === 6) {
            r = '0x' + hex[0] + hex[1];
            g = '0x' + hex[2] + hex[3];
            b = '0x' + hex[4] + hex[5];
        }
        hexRgb.value = 'rgb(' + +r + ',' + +g + ',' + +b + ')';

        hexRgbCopy.disabled = false;
        // To HSL
        r = 0;
        g = 0;
        b = 0;
        if (hex.length === 3) {
            r = '0x' + hex[0] + hex[0];
            g = '0x' + hex[1] + hex[1];
            b = '0x' + hex[2] + hex[2];
        } else if (hex.length === 6) {
            r = '0x' + hex[0] + hex[1];
            g = '0x' + hex[2] + hex[3];
            b = '0x' + hex[4] + hex[5];
        }
        r /= 255;
        g /= 255;
        b /= 255;
        let cMin = Math.min(r, g, b),
            cMax = Math.max(r, g, b),
            delta = cMax - cMin,
            h = 0,
            s = 0,
            l = 0;

        if (delta === 0) h = 0;
        else if (cMax === r) h = ((g - b) / delta) % 6;
        else if (cMax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0) h += 360;

        l = (cMax + cMin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        hexHsl.value = 'hsl(' + h + ',' + s + '%,' + l + '%)';

        hexHslCopy.disabled = false;
    } else if (hex.match(/^([\da-f]{3}){1,2}$/i)) {
        hexDisplay.style.backgroundColor = '#' + hex;
        hexDisplay.innerHTML = '';
        // To RBG
        let r = 0,
            g = 0,
            b = 0;
        if (hex.length === 3) {
            r = '0x' + hex[0] + hex[0];
            g = '0x' + hex[1] + hex[1];
            b = '0x' + hex[2] + hex[2];
        } else if (hex.length === 6) {
            r = '0x' + hex[0] + hex[1];
            g = '0x' + hex[2] + hex[3];
            b = '0x' + hex[4] + hex[5];
        }
        hexRgb.value = 'rgb(' + +r + ',' + +g + ',' + +b + ')';

        hexRgbCopy.disabled = false;
        // To HSL
        r = 0;
        g = 0;
        b = 0;
        if (hex.length === 3) {
            r = '0x' + hex[0] + hex[0];
            g = '0x' + hex[1] + hex[1];
            b = '0x' + hex[2] + hex[2];
        } else if (hex.length === 6) {
            r = '0x' + hex[0] + hex[1];
            g = '0x' + hex[2] + hex[3];
            b = '0x' + hex[4] + hex[5];
        }
        r /= 255;
        g /= 255;
        b /= 255;
        let cMin = Math.min(r, g, b),
            cMax = Math.max(r, g, b),
            delta = cMax - cMin,
            h = 0,
            s = 0,
            l = 0;

        if (delta === 0) h = 0;
        else if (cMax === r) h = ((g - b) / delta) % 6;
        else if (cMax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0) h += 360;

        l = (cMax + cMin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        hexHsl.value = 'hsl(' + h + ',' + s + '%,' + l + '%)';

        hexHslCopy.disabled = false;
    } else {
        hexDisplay.innerHTML = hex === '' ? '' : '<i class="fa-solid fa-xmark" style="color: #bf4042; font-size: 24px"></i>';
        hexDisplay.style.backgroundColor = '';
        hexRgb.value = '';
        hexRgbCopy.disabled = true;
        hexHsl.value = '';
        hexHslCopy.disabled = true;
    }
}

function rgb() {
    let rgb = rgbInput.value;
    if (rgb.match(/^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i)) {
        rgbDisplay.style.backgroundColor = rgb;
        rgbDisplay.innerHTML = '';
        // To Hex
        let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
        rgb = rgb.substr(4).split(')')[0].split(sep);

        let r = (+rgb[0]).toString(16),
            g = (+rgb[1]).toString(16),
            b = (+rgb[2]).toString(16);

        if (r.length === 1) r = '0' + r;
        if (g.length === 1) g = '0' + g;
        if (b.length === 1) b = '0' + b;

        rgbHex.value = '#' + r + g + b;

        rgbHexCopy.disabled = false;
        // To HSL
        rgb = rgbInput.value;
        sep = rgb.indexOf(',') > -1 ? ',' : ' ';
        rgb = rgb.substr(4).split(')')[0].split(sep);

        for (let R in rgb) {
            let r = rgb[R];
            if (r.indexOf('%') > -1) rgb[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
        }

        // Make r, g, and b fractions of 1
        r = rgb[0] / 255;
        g = rgb[1] / 255;
        b = rgb[2] / 255;
        let cMin = Math.min(r, g, b),
            cMax = Math.max(r, g, b),
            delta = cMax - cMin,
            h = 0,
            s = 0,
            l = 0;
        if (delta === 0) h = 0;
        else if (cMax === r) h = ((g - b) / delta) % 6;
        else if (cMax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0) h += 360;
        l = (cMax + cMin) / 2;

        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        rgbHsl.value = 'hsl(' + h + ',' + s + '%,' + l + '%)';

        rgbHslCopy.disabled = false;
    } else {
        rgbDisplay.innerHTML = rgb === '' ? '' : '<i class="fa-solid fa-xmark" style="color: #bf4042; font-size: 24px"></i>';
        rgbDisplay.style.backgroundColor = '';
        rgbHex.value = '';
        rgbHexCopy.disabled = true;
        rgbHsl.value = '';
        rgbHslCopy.disabled = true;
    }
}

function hsl() {
    let hsl = hslInput.value;
    if (hsl.match(/^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i)) {
        hslDisplay.style.backgroundColor = hsl;
        hslDisplay.innerHTML = '';
        // To Hex
        let sep = hsl.indexOf(',') > -1 ? ',' : ' ';
        hsl = hsl.substr(4).split(')')[0].split(sep);

        let h = hsl[0],
            s = hsl[1].substr(0, hsl[1].length - 1) / 100,
            l = hsl[2].substr(0, hsl[2].length - 1) / 100;

        // Strip label and convert to degrees (if necessary)
        if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
        else if (h.indexOf('rad') > -1) h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
        else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
        if (h >= 360) h %= 360;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);

        // Prepend 0s, if necessary
        if (r.length === 1) r = '0' + r;
        if (g.length === 1) g = '0' + g;
        if (b.length === 1) b = '0' + b;

        hslHex.value = '#' + r + g + b;

        hslHexCopy.disabled = false;
        // To RGB
        hsl = hslInput.value;
        sep = hsl.indexOf(',') > -1 ? ',' : ' ';
        hsl = hsl.substr(4).split(')')[0].split(sep);

        h = hsl[0];
        s = hsl[1].substr(0, hsl[1].length - 1) / 100;
        l = hsl[2].substr(0, hsl[2].length - 1) / 100;

        c = (1 - Math.abs(2 * l - 1)) * s;
        x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        m = l - c / 2;
        r = 0;
        g = 0;
        b = 0;

        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        hslRgb.value = 'rgb(' + r + ',' + g + ',' + b + ')';

        hslRgbCopy.disabled = false;
    } else {
        hslDisplay.innerHTML = hsl === '' ? '' : '<i class="fa-solid fa-xmark" style="color: #bf4042; font-size: 24px"></i>';
        hslDisplay.style.backgroundColor = '';
        hslHex.value = '';
        hslHexCopy.disabled = true;
        hslRgb.value = '';
        hslRgbCopy.disabled = true;
    }
}
