import type { UAParserInstance } from 'ua-parser-js';

declare global {
    interface Window {
        UAParser: UAParserInstance; // eslint-disable-line @typescript-eslint/naming-convention
    }
}

const browserInfo = document.querySelector('#browser-info') as HTMLDivElement;

const parser = new window.UAParser();

const result = parser.getResult();

const output = [
    { icon: 'window', name: 'Browser', value: `${result.browser.name ?? 'Unknown'} ${result.browser.version ?? ''}` },
    { icon: 'microchip', name: 'CPU', value: `${result.cpu.architecture ?? 'Unknown'}` },
    { icon: 'desktop', name: 'Device', value: `${result.device.vendor ?? ''} ${result.device.model ?? 'Unknown'}` },
    { icon: 'gears', name: 'Engine', value: `${result.engine.name ?? 'Unknown'} ${result.engine.version ?? ''}` },
    { icon: 'computer', name: 'OS', value: `${result.os.name ?? 'Unknown'} ${result.os.version ?? ''}` },
    { icon: 'display-code', name: 'User Agent', value: result.ua }
];

browserInfo.textContent = '';

for (const item of output) {
    const row = document.createElement('div');

    const icon = document.createElement('i');
    icon.className = `fa-regular fa-${item.icon}`;

    const name = document.createElement('span');
    name.textContent = item.name;

    const value = document.createElement('span');
    value.style.color = 'gray';
    value.textContent = item.value.trim();

    row.append(icon);
    row.append(document.createTextNode(' '));
    row.append(name);
    row.append(document.createTextNode(': '));
    row.append(value);

    browserInfo.append(row);
}
