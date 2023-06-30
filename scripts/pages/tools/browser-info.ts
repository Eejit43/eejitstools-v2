// Modified from https://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript

const { appVersion, userAgent } = navigator;
let { appName: browser } = navigator;
let fullVersion = parseFloat(appVersion).toString();
let majorVersion = parseInt(appVersion);
let nameOffset, versionOffset, ix;

if ((versionOffset = userAgent.indexOf('Opera')) !== -1) {
    browser = 'Opera';
    fullVersion = userAgent.substring(versionOffset + 6);
    if ((versionOffset = userAgent.indexOf('Version')) !== -1) fullVersion = userAgent.substring(versionOffset + 8);
} else if ((versionOffset = userAgent.indexOf('MSIE')) !== -1) {
    browser = 'Microsoft Internet Explorer';
    fullVersion = userAgent.substring(versionOffset + 5);
} else if ((versionOffset = userAgent.indexOf('Chrome')) !== -1) {
    browser = 'Chrome';
    fullVersion = userAgent.substring(versionOffset + 7);
} else if ((versionOffset = userAgent.indexOf('Safari')) !== -1) {
    browser = 'Safari';
    fullVersion = userAgent.substring(versionOffset + 7);
    if ((versionOffset = userAgent.indexOf('Version')) !== -1) fullVersion = userAgent.substring(versionOffset + 8);
} else if ((versionOffset = userAgent.indexOf('Firefox')) !== -1) {
    browser = 'Firefox';
    fullVersion = userAgent.substring(versionOffset + 8);
} else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) < (versionOffset = userAgent.lastIndexOf('/'))) {
    browser = userAgent.substring(nameOffset, versionOffset);
    fullVersion = userAgent.substring(versionOffset + 1);
    if (browser.toLowerCase() === browser.toUpperCase()) browser = navigator.appName;
}

if ((ix = fullVersion.indexOf(';')) !== -1) fullVersion = fullVersion.substring(0, ix);
if ((ix = fullVersion.indexOf(' ')) !== -1) fullVersion = fullVersion.substring(0, ix);

majorVersion = parseInt(fullVersion);
if (isNaN(majorVersion)) {
    fullVersion = parseFloat(appVersion).toString();
    majorVersion = parseInt(appVersion);
}

let operatingSystem = 'Unknown OS';
if (appVersion.indexOf('Win') !== -1) operatingSystem = 'Windows';
if (appVersion.indexOf('Mac') !== -1) operatingSystem = 'MacOS';
if (appVersion.indexOf('X11') !== -1) operatingSystem = 'UNIX';
if (appVersion.indexOf('Linux') !== -1) operatingSystem = 'Linux';

const result = [
    `Operating System: ${operatingSystem}`, //
    `Platform: ${navigator.platform}`,
    `Language: ${navigator.language}`,
    `Online: ${navigator.onLine}`,
    `Cookies Enabled: ${navigator.cookieEnabled}`,
    `Browser: ${browser}`,
    `Browser Version: ${fullVersion}`,
    `Main Browser Version: ${majorVersion}`,
    `navigator.userAgent: ${navigator.userAgent}`
];

(document.getElementById('browser-info') as HTMLElement).innerHTML = result.join('<br />');
