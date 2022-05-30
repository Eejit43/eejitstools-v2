// Modified from https://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript

const { appVersion, userAgent } = navigator;
let { appName } = navigator;
let fullVersion = parseFloat(appVersion).toString();
let majorVersion = parseInt(appVersion, 10);
let nameOffset, versionOffset, ix;

if ((versionOffset = userAgent.indexOf('Opera')) !== -1) {
    appName = 'Opera';
    fullVersion = userAgent.substring(versionOffset + 6);
    if ((versionOffset = userAgent.indexOf('Version')) !== -1) fullVersion = userAgent.substring(versionOffset + 8);
} else if ((versionOffset = userAgent.indexOf('MSIE')) !== -1) {
    appName = 'Microsoft Internet Explorer';
    fullVersion = userAgent.substring(versionOffset + 5);
} else if ((versionOffset = userAgent.indexOf('Chrome')) !== -1) {
    appName = 'Chrome';
    fullVersion = userAgent.substring(versionOffset + 7);
} else if ((versionOffset = userAgent.indexOf('Safari')) !== -1) {
    appName = 'Safari';
    fullVersion = userAgent.substring(versionOffset + 7);
    if ((versionOffset = userAgent.indexOf('Version')) !== -1) fullVersion = userAgent.substring(versionOffset + 8);
} else if ((versionOffset = userAgent.indexOf('Firefox')) !== -1) {
    appName = 'Firefox';
    fullVersion = userAgent.substring(versionOffset + 8);
} else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) < (versionOffset = userAgent.lastIndexOf('/'))) {
    appName = userAgent.substring(nameOffset, versionOffset);
    fullVersion = userAgent.substring(versionOffset + 1);
    if (appName.toLowerCase() === appName.toUpperCase()) appName = navigator.appName; // eslint-disable-line prefer-destructuring
}

if ((ix = fullVersion.indexOf(';')) !== -1) fullVersion = fullVersion.substring(0, ix);
if ((ix = fullVersion.indexOf(' ')) !== -1) fullVersion = fullVersion.substring(0, ix);

majorVersion = parseInt('' + fullVersion, 10);
if (isNaN(majorVersion)) {
    fullVersion = '' + parseFloat(appVersion);
    majorVersion = parseInt(appVersion, 10);
}

let OSName = 'Unknown OS';
if (appVersion.indexOf('Win') !== -1) OSName = 'Windows';
if (appVersion.indexOf('Mac') !== -1) OSName = 'MacOS';
if (appVersion.indexOf('X11') !== -1) OSName = 'UNIX';
if (appVersion.indexOf('Linux') !== -1) OSName = 'Linux';

const result = [
    `Operating System: ${OSName}`, //
    `Platform: ${navigator.platform}`,
    `Language: ${navigator.language}`,
    `Online: ${navigator.onLine}`,
    `Cookies Enabled: ${navigator.cookieEnabled}`,
    `Browser: ${appName}`,
    `Browser Version: ${fullVersion}`,
    `Main Browser Version: ${majorVersion}`,
    `navigator.appName: ${navigator.appName}`,
    `navigator.userAgent: ${navigator.userAgent}`,
];

document.getElementById('browser-info').innerHTML = result.join('<br />');
