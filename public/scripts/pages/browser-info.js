// Modified from https://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript

const navigatorVersion = navigator.appVersion;
const navigatorAgent = navigator.userAgent;
let browserName = navigator.appName;
let fullVersion = parseFloat(navigatorVersion).toString();
let majorVersion = parseInt(navigatorVersion, 10);
let nameOffset, versionOffset, ix;

if ((versionOffset = navigatorAgent.indexOf('Opera')) !== -1) {
    browserName = 'Opera';
    fullVersion = navigatorAgent.substring(versionOffset + 6);
    if ((versionOffset = navigatorAgent.indexOf('Version')) !== -1) fullVersion = navigatorAgent.substring(versionOffset + 8);
} else if ((versionOffset = navigatorAgent.indexOf('MSIE')) !== -1) {
    browserName = 'Microsoft Internet Explorer';
    fullVersion = navigatorAgent.substring(versionOffset + 5);
} else if ((versionOffset = navigatorAgent.indexOf('Chrome')) !== -1) {
    browserName = 'Chrome';
    fullVersion = navigatorAgent.substring(versionOffset + 7);
} else if ((versionOffset = navigatorAgent.indexOf('Safari')) !== -1) {
    browserName = 'Safari';
    fullVersion = navigatorAgent.substring(versionOffset + 7);
    if ((versionOffset = navigatorAgent.indexOf('Version')) !== -1) fullVersion = navigatorAgent.substring(versionOffset + 8);
} else if ((versionOffset = navigatorAgent.indexOf('Firefox')) !== -1) {
    browserName = 'Firefox';
    fullVersion = navigatorAgent.substring(versionOffset + 8);
} else if ((nameOffset = navigatorAgent.lastIndexOf(' ') + 1) < (versionOffset = navigatorAgent.lastIndexOf('/'))) {
    browserName = navigatorAgent.substring(nameOffset, versionOffset);
    fullVersion = navigatorAgent.substring(versionOffset + 1);
    if (browserName.toLowerCase() === browserName.toUpperCase()) {
        browserName = navigator.appName;
    }
}

if ((ix = fullVersion.indexOf(';')) !== -1) fullVersion = fullVersion.substring(0, ix);
if ((ix = fullVersion.indexOf(' ')) !== -1) fullVersion = fullVersion.substring(0, ix);

majorVersion = parseInt('' + fullVersion, 10);
if (isNaN(majorVersion)) {
    fullVersion = '' + parseFloat(navigatorVersion);
    majorVersion = parseInt(navigatorVersion, 10);
}

let OSName = 'Unknown OS';
if (navigatorVersion.indexOf('Win') !== -1) OSName = 'Windows';
if (navigatorVersion.indexOf('Mac') !== -1) OSName = 'MacOS';
if (navigatorVersion.indexOf('X11') !== -1) OSName = 'UNIX';
if (navigatorVersion.indexOf('Linux') !== -1) OSName = 'Linux';

const result = [
    `Operating System: ${OSName}`, //
    `Platform: ${navigator.platform}`,
    `Language: ${navigator.language}`,
    `Online: ${navigator.onLine}`,
    `Cookies Enabled: ${navigator.cookieEnabled}`,
    `Browser: ${browserName}`,
    `Browser Version: ${fullVersion}`,
    `Main Browser Version: ${majorVersion}`,
    `navigator.appName: ${navigator.appName}`,
    `navigator.userAgent: ${navigator.userAgent}`,
];

document.getElementById('browser-info').innerHTML = result.join('<br />');
