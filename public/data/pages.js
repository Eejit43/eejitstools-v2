const imports = {
    odometerCss: '/styles/external/odometer.css',
    odometerJs: '/scripts/external/odometer.js',
    mathJs: 'https://unpkg.com/mathjs/lib/browser/math.js',
};

const alphabet = [
    { letter: 'A', codeWord: 'Alpha' },
    { letter: 'B', codeWord: 'Bravo' },
    { letter: 'C', codeWord: 'Charlie' },
    { letter: 'D', codeWord: 'Delta' },
    { letter: 'E', codeWord: 'Echo' },
    { letter: 'F', codeWord: 'Foxtrot' },
    { letter: 'G', codeWord: 'Golf' },
    { letter: 'H', codeWord: 'Hotel' },
    { letter: 'I', codeWord: 'India' },
    { letter: 'J', codeWord: 'Juliet' },
    { letter: 'K', codeWord: 'Kilo' },
    { letter: 'L', codeWord: 'Lima' },
    { letter: 'M', codeWord: 'Mike' },
    { letter: 'N', codeWord: 'November' },
    { letter: 'O', codeWord: 'Oscar' },
    { letter: 'P', codeWord: 'Papa' },
    { letter: 'Q', codeWord: 'Quebec' },
    { letter: 'R', codeWord: 'Romeo' },
    { letter: 'S', codeWord: 'Sierra' },
    { letter: 'T', codeWord: 'Tango' },
    { letter: 'U', codeWord: 'Uniform' },
    { letter: 'V', codeWord: 'Victor' },
    { letter: 'W', codeWord: 'Whiskey' },
    { letter: 'X', codeWord: 'X-Ray' },
    { letter: 'Y', codeWord: 'Yankee' },
    { letter: 'Z', codeWord: 'Zulu' },
];

const textAbbreviations = [
    { abbreviation: 'AF / ASF', meaning: 'as <spoiler>fuck</spoiler>, such as "I\'m bored af"' },
    { abbreviation: 'AFAIK / AFAICT', meaning: 'as far as I know / can tell' },
    { abbreviation: 'AFK', meaning: 'away from keyboard' },
    { abbreviation: 'ASAP', meaning: 'as soon as possible' },
    { abbreviation: 'ASL', meaning: 'age/sex (gender)/location (often a request) (could mean American Sign Language instead!)' },
    { abbreviation: 'BRB', meaning: 'be right back' },
    { abbreviation: 'BTW', meaning: 'by the way' },
    { abbreviation: 'CYA / SYA', meaning: 'see ya' },
    { abbreviation: 'DIY', meaning: 'do it yourself' },
    { abbreviation: 'DL', meaning: 'down-low (secret)' },
    { abbreviation: 'ETA', meaning: 'estimated time of arrival' },
    { abbreviation: 'FFS', meaning: "for <spoiler>fuck</spoiler>'s sake" },
    { abbreviation: 'FOMO', meaning: 'fear of missing out' },
    { abbreviation: 'FTLOG', meaning: 'for the love of god' },
    { abbreviation: 'FU', meaning: '<spoiler>fuck</spoiler> you' },
    { abbreviation: 'GLHF', meaning: 'good luck, have fun' },
    { abbreviation: 'GTG', meaning: 'got to go' },
    { abbreviation: 'HMU', meaning: 'hit me up' },
    { abbreviation: 'HW', meaning: 'homework' },
    { abbreviation: 'IDC / IDRC', meaning: "I don't (really) care" },
    { abbreviation: 'IDK / IDRK / IDEK', meaning: "I don't (really/even) know" },
    { abbreviation: 'IIRC', meaning: 'if I remember correctly' },
    { abbreviation: 'IKR', meaning: 'I know right' },
    { abbreviation: 'ILY', meaning: 'I love you' },
    { abbreviation: 'IMHO / IMO', meaning: 'in my honest/humble opinion' },
    { abbreviation: 'IRL', meaning: 'in real life' },
    { abbreviation: 'IYMI / ICYMI', meaning: 'In case/if you missed it' },
    { abbreviation: 'JIC', meaning: 'just in case' },
    { abbreviation: 'JK', meaning: 'just kidding' },
    { abbreviation: 'JSYK', meaning: 'just so you know' },
    { abbreviation: 'LGTM', meaning: 'looks good to me' },
    { abbreviation: 'LMAO', meaning: 'laughing my ass/arse off' },
    { abbreviation: 'LMK', meaning: 'let me know' },
    { abbreviation: 'LOL', meaning: 'laugh out loud' },
    { abbreviation: 'LSR', meaning: 'loser' },
    { abbreviation: 'NBCOY / NBCOU', meaning: 'not because of you' },
    { abbreviation: 'NMU', meaning: 'not much, you?' },
    { abbreviation: 'NP', meaning: 'no problem' },
    { abbreviation: 'NSFW', meaning: 'not safe for work, usually <spoiler>sexual</spoiler> or gross content' },
    { abbreviation: 'NVM / NM', meaning: 'nevermind <em>OR</em> not (very) much' },
    { abbreviation: 'NW', meaning: 'no worries' },
    { abbreviation: 'OC', meaning: 'original content' },
    { abbreviation: 'OG', meaning: 'original (original gangster)' },
    { abbreviation: 'OMFG', meaning: 'oh my <spoiler>fuck</spoiler>ing god' },
    { abbreviation: 'OMG', meaning: 'oh my god/goodness' },
    { abbreviation: 'OMW', meaning: 'on my way' },
    { abbreviation: 'PAFD', meaning: 'put a finger down (used on TikTok, similar to the "Never have I ever" game)' },
    { abbreviation: 'PLS / PLZ', meaning: 'please' },
    { abbreviation: 'PPL', meaning: 'people' },
    { abbreviation: 'QT', meaning: 'cutie' },
    { abbreviation: 'RL', meaning: 'real life' },
    { abbreviation: 'RN', meaning: 'right now' },
    { abbreviation: 'ROLF', meaning: 'rolling on the floor laughing' },
    { abbreviation: 'RT', meaning: 'retweet (used on Twitter)' },
    { abbreviation: 'RUOK', meaning: 'are you okay?' },
    { abbreviation: 'SFW', meaning: 'safe for work, opposite of NSFW' },
    { abbreviation: 'SMH', meaning: 'shaking my head' },
    { abbreviation: 'SMTH / SMTHN', meaning: 'something' },
    { abbreviation: 'SRSLY', meaning: 'seriously' },
    { abbreviation: 'STFU', meaning: 'shut the <spoiler>fuck</spoiler> up' },
    { abbreviation: 'SYS', meaning: 'see you soon' },
    { abbreviation: 'TBA', meaning: 'to be announced' },
    { abbreviation: 'TBC', meaning: 'to be continued' },
    { abbreviation: 'TBD', meaning: 'to be decided/determined' },
    { abbreviation: 'TBH', meaning: 'to be honest' },
    { abbreviation: 'THX', meaning: 'thanks' },
    { abbreviation: 'TIL', meaning: 'today I learned' },
    { abbreviation: 'TL;DR', meaning: "too long, didn't read (often before a summary of a text)" },
    { abbreviation: 'TMI', meaning: 'too much information' },
    { abbreviation: 'TTYL', meaning: 'talk to you later' },
    { abbreviation: 'TW / CW', meaning: 'trigger/content warning (a label that warns users about upcoming content)' },
    { abbreviation: 'TY(S/VM)', meaning: 'thank you (so/very much)' },
    { abbreviation: 'WB', meaning: 'welcome back' },
    { abbreviation: 'WIP', meaning: 'work in progress' },
    { abbreviation: 'WTF / TF', meaning: '(what) the <spoiler>fuck</spoiler>' },
    { abbreviation: 'WTH', meaning: 'what the heck/hell' },
    { abbreviation: 'YK', meaning: 'you know' },
    { abbreviation: 'YOLO', meaning: 'you only live once' },
    { abbreviation: 'YW', meaning: "you're welcome" },
];

const toneIndicators = [
    { toneIndicator: '!', meaning: 'surprise or excitement' },
    { toneIndicator: '?!', meaning: 'excited or surprised question' },
    { toneIndicator: '?', meaning: 'confusion' },
    { toneIndicator: 'a', meaning: 'alterous' },
    { toneIndicator: 'aff', meaning: 'affectionate' },
    { toneIndicator: 'ay', meaning: 'at you' },
    { toneIndicator: 'c', meaning: 'copypasta (something copied and pasted everywhere)' },
    { toneIndicator: 'cb', meaning: 'clickbait' },
    { toneIndicator: 'cj', meaning: 'coping joke' },
    { toneIndicator: 'con', meaning: 'concerned' },
    { toneIndicator: 'cr', meaning: 'cringey' },
    { toneIndicator: 'crit', meaning: 'being critical / giving criticism' },
    { toneIndicator: 'cur', meaning: 'curious' },
    { toneIndicator: 'cwh', meaning: 'coping with humour' },
    { toneIndicator: 'dkm', meaning: "don't kill me (used with opinions or some jokes)" },
    { toneIndicator: 'dr', meaning: "don't reply" },
    { toneIndicator: 'e', meaning: 'embarrassed <i>OR</i> excited' },
    { toneIndicator: 'f', meaning: 'fake' },
    { toneIndicator: 'fex', meaning: 'for example' },
    { toneIndicator: 'fl', meaning: 'flirting' },
    { toneIndicator: 'g or /gen', meaning: 'genuine / genuine statement / genuine question' },
    { toneIndicator: 'gen', meaning: 'genuine question' },
    { toneIndicator: 'hj', meaning: 'half joking' },
    { toneIndicator: 'hlh', meaning: 'half lighthearted' },
    { toneIndicator: 'hs or /iw', meaning: 'headspace / innerworld' },
    { toneIndicator: 'hs', meaning: 'half sarcastic' },
    { toneIndicator: 'hsrs', meaning: 'half serious' },
    { toneIndicator: 'hyp', meaning: 'hyperbole' },
    { toneIndicator: 'i or /ir', meaning: 'ironic' },
    { toneIndicator: 'ij', meaning: 'inside joke' },
    { toneIndicator: 'j', meaning: 'joke or joking' },
    { toneIndicator: 'l or /ly or /lyr', meaning: 'lyrics' },
    { toneIndicator: 'lh', meaning: 'light hearted' },
    { toneIndicator: 'li', meaning: 'literal / literally' },
    { toneIndicator: 'lj or /lhj', meaning: 'light (hearted) joke' },
    { toneIndicator: 'lu', meaning: 'little upset' },
    { toneIndicator: 'ly', meaning: 'lyrics' },
    { toneIndicator: 'm', meaning: 'metaphor / metaphorically <i>OR</i> mocking' },
    { toneIndicator: 'met', meaning: 'metaphorical' },
    { toneIndicator: 'mhly', meaning: 'misheard lyrics' },
    { toneIndicator: 'mj', meaning: 'mostly or mainly joking' },
    { toneIndicator: 'ms', meaning: 'mostly sarcastic <i>OR</i> meatspace / the physical world' },
    { toneIndicator: 'msrs', meaning: 'mostly serious' },
    { toneIndicator: 'nav', meaning: 'not a vent' },
    { toneIndicator: 'nay', meaning: 'not at you' },
    { toneIndicator: 'nb', meaning: 'not bragging' },
    { toneIndicator: 'nbh', meaning: 'for when you\'re "vagueposting" or venting, but it\'s directed at nobody here (none of your followers)' },
    { toneIndicator: 'nbr', meaning: 'not being rude' },
    { toneIndicator: 'nc or /neg', meaning: 'negative connotation' },
    { toneIndicator: 'neg', meaning: 'negative connotation' },
    { toneIndicator: 'neu', meaning: 'neutral / neutral connotation' },
    { toneIndicator: 'nf or /nfta', meaning: 'not forcing / not forced to answer' },
    { toneIndicator: 'nm', meaning: 'not mad' },
    { toneIndicator: 'non', meaning: 'nonsense' },
    { toneIndicator: 'npa', meaning: 'not passive-aggressive' },
    { toneIndicator: 'ns', meaning: 'not sure' },
    { toneIndicator: 'nsb', meaning: 'not sub-posting (refers to someone without mentioning them)' },
    { toneIndicator: 'nsrs', meaning: 'not serious' },
    { toneIndicator: 'nsx or /nx or /ns', meaning: 'no <spoiler>sexual</spoiler> intent' },
    { toneIndicator: 'ot', meaning: 'off topic' },
    { toneIndicator: 'p or /pl', meaning: 'platonic (intimate, not <spoiler>sexual</spoiler>)' },
    { toneIndicator: 'p', meaning: 'platonic' },
    { toneIndicator: 'pa', meaning: 'passive-aggressive' },
    { toneIndicator: 'pc or /pos', meaning: 'positive connotation' },
    { toneIndicator: 'pf', meaning: 'playful' },
    { toneIndicator: 'pos', meaning: 'positive connotation' },
    { toneIndicator: 'pr', meaning: 'parental' },
    { toneIndicator: 'pw', meaning: 'physical world' },
    { toneIndicator: 'q or /quo', meaning: 'quote' },
    { toneIndicator: 'r', meaning: 'romantic' },
    { toneIndicator: 'ref', meaning: 'reference' },
    { toneIndicator: 'rh or /rt', meaning: 'rhetorical question' },
    { toneIndicator: 'rp', meaning: 'roleplay' },
    { toneIndicator: 's or /sarc', meaning: 'sarcastic / sarcasm' },
    { toneIndicator: 'srs', meaning: 'serious' },
    { toneIndicator: 'st', meaning: 'still thinking' },
    { toneIndicator: 'sx or /x', meaning: '<spoiler>sexual</spoiler> intent' },
    { toneIndicator: 't', meaning: 'teasing' },
    { toneIndicator: 'tfj', meaning: '3/4 joking' },
    { toneIndicator: 'th', meaning: 'threat' },
    { toneIndicator: 'tic', meaning: 'tics' },
    { toneIndicator: 'ui', meaning: 'unironic' },
    { toneIndicator: 'vu', meaning: 'very upset' },
    { toneIndicator: 'wp', meaning: 'wrong proxy' },
];

const minecraftColorCodes = [
    { color: 'Dark Red', colorName: 'dark_red', colorCode: '4', motdCode: '00A74', hexCode: 'aa0000', backgroundColor: 'aa0000', textColor: 'fafafa' },
    { color: 'Red', colorName: 'red', colorCode: 'c', motdCode: '00A7c', hexCode: 'ff5555', backgroundColor: 'ff5555', textColor: 'fafafa' },
    { color: 'Gold', colorName: 'gold', colorCode: '6', motdCode: '00A76', hexCode: 'ffaa00', backgroundColor: 'ffaa00', textColor: '000000' },
    { color: 'Yellow', colorName: 'yellow', colorCode: 'e', motdCode: '00A7e', hexCode: 'ffff55', backgroundColor: 'ffff55', textColor: '000000' },
    { color: 'Dark Green', colorName: 'dark_green', colorCode: '2', motdCode: '00A72', hexCode: '00aa00', backgroundColor: '00aa00', textColor: 'fafafa' },
    { color: 'Green', colorName: 'green', colorCode: 'a', motdCode: '00A7a', hexCode: '55ff55', backgroundColor: '55ff55', textColor: '000000' },
    { color: 'Aqua', colorName: 'aqua', colorCode: 'b', motdCode: '00A7b', hexCode: '55ffff', backgroundColor: '55ffff', textColor: '000000' },
    { color: 'Dark Aqua', colorName: 'dark_aqua', colorCode: '3', motdCode: '00A73', hexCode: '00aaaa', backgroundColor: '00aaaa', textColor: 'fafafa' },
    { color: 'Dark Blue', colorName: 'dark_blue', colorCode: '1', motdCode: '00A71', hexCode: '0000aa', backgroundColor: '0000aa', textColor: 'fafafa' },
    { color: 'Blue', colorName: 'blue', colorCode: '9', motdCode: '00A79', hexCode: '5555ff', backgroundColor: '5555ff', textColor: 'fafafa' },
    { color: 'Light Purple', colorName: 'light_purple', colorCode: 'd', motdCode: '00A7d', hexCode: 'ff55ff', backgroundColor: 'ff55ff', textColor: 'fafafa' },
    { color: 'Dark Purple', colorName: 'dark_purple', colorCode: '5', motdCode: '00A75', hexCode: 'aa00aa', backgroundColor: 'aa00aa', textColor: 'fafafa' },
    { color: 'White', colorName: 'white', colorCode: 'f', motdCode: '00A7f', hexCode: 'ffffff', backgroundColor: 'ffffff', textColor: '000000' },
    { color: 'Gray', colorName: 'gray', colorCode: '7', motdCode: '00A77', hexCode: 'aaaaaa', backgroundColor: 'aaaaaa', textColor: '000000' },
    { color: 'Dark Gray', colorName: 'dark_gray', colorCode: '8', motdCode: '00A78', hexCode: '555555', backgroundColor: '555555', textColor: 'fafafa' },
    { color: 'Black', colorName: 'black', colorCode: '0', motdCode: '00A70', hexCode: '000000', backgroundColor: '000000', textColor: 'fafafa' },
];

const minecraftFormattingCodes = [
    { type: 'Obfuscated', formattingCode: 'k', motdCode: '00A7k', style: '' },
    { type: 'Bold', formattingCode: 'l', motdCode: '00A7l', style: 'font-weight: bold' },
    { type: 'Strikethrough', formattingCode: 'm', motdCode: '00A7m', style: 'text-decoration: line-through' },
    { type: 'Underline', formattingCode: 'n', motdCode: '00A7n', style: 'text-decoration: underline' },
    { type: 'Italic', formattingCode: 'o', motdCode: '00A7o', style: 'font-style: italic' },
    { type: 'Reset color and formatting', formattingCode: 'r', motdCode: '00A7r', style: '' },
];

const stateAbbreviations = [
    { state: 'Alabama', postal: 'AL', standard: 'Ala.' },
    { state: 'Alaska', postal: 'AK', standard: 'Alaska' },
    { state: 'Arizona', postal: 'AZ', standard: 'Ariz.' },
    { state: 'Arkansas', postal: 'AR', standard: 'Ark.' },
    { state: 'California', postal: 'CA', standard: 'Calif.' },
    { state: 'Colorado', postal: 'CO', standard: 'Colo.' },
    { state: 'Connecticut', postal: 'CT', standard: 'Conn.' },
    { state: 'Delaware', postal: 'DE', standard: 'Del.' },
    { state: 'Florida', postal: 'FL', standard: 'Fla.' },
    { state: 'Georgia', postal: 'GA', standard: 'Ga.' },
    { state: 'Hawaii', postal: 'HI', standard: 'Hawaii' },
    { state: 'Idaho', postal: 'ID', standard: 'Idaho' },
    { state: 'Illinois', postal: 'IL', standard: 'Ill.' },
    { state: 'Indiana', postal: 'IN', standard: 'Ind.' },
    { state: 'Iowa', postal: 'IA', standard: 'Iowa' },
    { state: 'Kansas', postal: 'KS', standard: 'Kans.' },
    { state: 'Kentucky', postal: 'KY', standard: 'Ky.' },
    { state: 'Louisiana', postal: 'LA', standard: 'La.' },
    { state: 'Maine', postal: 'ME', standard: 'Maine' },
    { state: 'Maryland', postal: 'MD', standard: 'Md.' },
    { state: 'Massachusetts', postal: 'MA', standard: 'Mass.' },
    { state: 'Michigan', postal: 'MI', standard: 'Mich.' },
    { state: 'Minnesota', postal: 'MN', standard: 'Minn.' },
    { state: 'Mississippi', postal: 'MS', standard: 'Miss.' },
    { state: 'Missouri', postal: 'MO', standard: 'Mo.' },
    { state: 'Montana', postal: 'MT', standard: 'Mont.' },
    { state: 'Nebraska', postal: 'NE', standard: 'Nebr.' },
    { state: 'Nevada', postal: 'NV', standard: 'Nev.' },
    { state: 'New Hampshire', postal: 'NH', standard: 'N.H.' },
    { state: 'New Jersey', postal: 'NJ', standard: 'N.J.' },
    { state: 'New Mexico', postal: 'NM', standard: 'N.M.' },
    { state: 'New York', postal: 'NY', standard: 'N.Y.' },
    { state: 'North Carolina', postal: 'NC', standard: 'N.C.' },
    { state: 'North Dakota', postal: 'ND', standard: 'N.D.' },
    { state: 'Ohio', postal: 'OH', standard: 'Ohio' },
    { state: 'Oklahoma', postal: 'OK', standard: 'Okla.' },
    { state: 'Oregon', postal: 'OR', standard: 'Ore.' },
    { state: 'Pennsylvania', postal: 'PA', standard: 'Pa.' },
    { state: 'Rhode Island', postal: 'RI', standard: 'R.I.' },
    { state: 'South Carolina', postal: 'SC', standard: 'S.C.' },
    { state: 'South Dakota', postal: 'SD', standard: 'S.D.' },
    { state: 'Tennessee', postal: 'TN', standard: 'Tenn.' },
    { state: 'Texas', postal: 'TX', standard: 'Tex.' },
    { state: 'Utah', postal: 'UT', standard: 'Utah' },
    { state: 'Vermont', postal: 'VT', standard: 'Vt.' },
    { state: 'Virginia', postal: 'VA', standard: 'Va.' },
    { state: 'Washington', postal: 'WA', standard: 'Wash.' },
    { state: 'West Virginia', postal: 'WV', standard: 'W.Va.' },
    { state: 'Wisconsin', postal: 'WI', standard: 'Wis.' },
    { state: 'Wyoming', postal: 'WY', standard: 'Wyo.' },
];

export const blankProperties = {
    description: '',
    page: '',
    additionalScripts: [],
    additionalStyles: [],
    script: false,
};

export const allPageInfo = {
    base64: {
        link: 'tools/base64',
        title: 'Base64 Encode/Decode',
        icon: 'fa-solid fa-code',
        description: 'Encode and decode to and from Base64 format (binary)',
        keywords: ['b64'],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'base64-image': {
        link: 'tools/base64-image',
        title: 'Base64 Image Encode/Decode',
        icon: 'fa-solid fa-file-image',
        description: 'Encode and decode images to and from Base64 format',
        keywords: ['b64'],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'binary-calc': {
        link: 'tools/binary-calc',
        title: 'Binary Calculator',
        icon: 'fa-solid fa-0',
        description: 'Convert to/from binary/octal/decimal/hex',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'binary-text': {
        link: 'tools/binary-text',
        title: 'Binary Text Converter',
        icon: 'fa-solid fa-1',
        description: 'Convert to/from binary text',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'browser-info': {
        link: 'tools/browser-info',
        title: 'Browser Info',
        icon: 'fa-solid fa-laptop',
        description: 'Shows basic information about your browser and operating system',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'case-changer': {
        link: 'tools/case-changer',
        title: 'Case Changer',
        icon: 'fa-solid fa-font',
        description: 'Change a string to uppercase, lowercase, title case, or sentence case',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'color-info': {
        link: 'tools/color-info',
        title: 'Color Information',
        icon: 'fa-solid fa-palette',
        description: 'Use a color picker or manually input Hexadecimal (Hex), Decimal, RGB(A), HSL(A), CMYK(A), or valid CSS color names, and view conversions and manipulate those colors',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    countdowns: {
        link: 'tools/countdowns',
        title: 'Countdowns',
        icon: 'fa-regular fa-hourglass',
        description: 'Shows various countdowns until major upcoming holidays',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    counter: {
        link: 'tools/counter',
        title: 'Counter',
        icon: 'fa-solid fa-calculator',
        description: 'Press a key/button to add one to a counter',
        keywords: ['spacebar'],
        additionalScripts: [imports.odometerJs],
        additionalStyles: [imports.odometerCss],
        script: true,
    },
    'currency-exchange': {
        link: 'tools/currency-exchange',
        title: 'Currency Exchange Rates',
        icon: 'fa-solid fa-coins',
        description: 'Shows information for various currency conversions',
        keywords: ['usd', 'money'],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'image-converter': {
        link: 'tools/image-converter',
        title: 'Image Converter',
        icon: 'fa-solid fa-image',
        description: 'Convert images to and from various formats',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'ip-info': {
        link: 'tools/ip-info',
        title: 'IP Info',
        icon: 'fa-solid fa-wifi',
        description: 'Displays your current <span class="tooltip-bottom" data-tooltip="Internet Protocol">IP</span> address, and IP provided information',
        keywords: ['internet', 'isp'],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'keycode-info': {
        link: 'tools/keycode-info',
        title: 'KeyCode Information',
        icon: 'fa-solid fa-keyboard',
        description: 'Click any keyboard key to get the key, key location, key code, char code (ASCII), and char code (Unicode)',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'length-converter': {
        link: 'tools/length-converter',
        title: 'Length Converter',
        icon: 'fa-solid fa-ruler',
        description: 'Convert between United States standard length measurements and imperial length units',
        keywords: [],
        additionalScripts: [imports.mathJs],
        additionalStyles: [],
        script: true,
    },
    'list-sorter': {
        link: 'tools/list-sorter',
        title: 'List Sorter',
        icon: 'fa-solid fa-arrow-down-wide-short',
        description: 'Alphabetize, numerize, randomize, and reverse lists that can be defined with custom separators',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'morse-code-converter': {
        link: 'tools/morse-code-converter',
        title: 'Morse Code Converter',
        icon: 'fa-solid fa-ellipsis',
        description: 'Convert to/from Morse code',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'quick-copy': {
        link: 'tools/quick-copy',
        title: 'Quick Copy',
        icon: 'fa-regular fa-clipboard',
        description: 'Clipboard display, clear clipboard button, and useful characters',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'random-number': {
        link: 'tools/random-number',
        title: 'Random Number Generator',
        icon: 'fa-solid fa-hashtag',
        description: 'Generate a random number between two numbers',
        keywords: [],
        additionalScripts: [imports.odometerJs],
        additionalStyles: [imports.odometerCss],
        script: true,
    },
    regex: {
        link: 'tools/regex',
        title: 'Regex Tools',
        icon: 'fa-solid fa-highlighter',
        description: 'Some useful regex tools (duplicate line remover, whitespace remover), as well as a regex tester',
        keywords: ['regular expression'],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'roman-converter': {
        link: 'tools/roman-converter',
        title: 'Roman Numeral Converter',
        icon: 'fa-solid fa-i',
        description: 'Convert to and from roman numerals, with high level thousand supports (bars above numbers)',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'scientific-notation-converter': {
        link: 'tools/scientific-notation-converter',
        title: 'Scientific Notation Converter',
        icon: 'fa-solid fa-e',
        description: 'Convert between scientific (<i>e</i>) notation and decimal form',
        keywords: [],
        additionalScripts: [imports.mathJs],
        additionalStyles: [],
        script: true,
    },
    stopwatch: {
        link: 'tools/stopwatch',
        title: 'Stopwatch',
        icon: 'fa-solid fa-stopwatch',
        description: 'Simple stopwatch (displays down to milliseconds)',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'svg-to-png': {
        link: 'tools/svg-to-png',
        title: 'SVG to PNG',
        icon: 'fa-solid fa-image',
        description: 'Convert <span data-tooltip="Scalable Vector Graphics">SVG</span> to <span data-tooltip="Portable Network Graphics">PNG</span>',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'temperature-converter': {
        link: 'tools/temperature-converter',
        title: 'Temperature Converter',
        icon: 'fa-solid fa-thermometer-half',
        description: 'Convert between Fahrenheit, Celsius/Centigrade, and Kelvin',
        keywords: [],
        additionalScripts: [imports.mathJs],
        additionalStyles: [],
        script: true,
    },
    'tides-info': {
        link: 'tools/tides-info',
        title: 'Tides Info',
        icon: 'fa-solid fa-water',
        description: 'Shows current tidal information and for the next 7 days',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    time: {
        link: 'tools/time',
        title: 'Time',
        icon: 'fa-regular fa-clock',
        description: 'Displays the current time and date (in your time zone), as well as detailed time information',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'time-converter': {
        link: 'tools/time-converter',
        title: 'Time Converter',
        icon: 'fa-solid fa-hourglass',
        description: 'Convert between units of time',
        keywords: [],
        additionalScripts: [imports.mathJs],
        additionalStyles: [],
        script: true,
    },
    timer: {
        link: 'tools/timer',
        title: 'Countdown Timer',
        icon: 'fa-solid fa-bell fa-shake',
        description: 'Simple countdown timer with end time display',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'unix-time-converter': {
        link: 'tools/unix-time-converter',
        title: 'UNIX Time Converter',
        icon: 'fa-solid fa-calendar',
        description: 'Convert from date strings to UNIX time (in seconds or milliseconds), and back',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'weather-info': {
        link: 'tools/weather-info',
        title: 'Weather Info',
        icon: 'fa-solid fa-cloud-sun-rain',
        description: 'Shows current weather information and alerts',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'word-counter': {
        link: 'tools/word-counter',
        title: 'Word Counter',
        icon: 'fa-solid fa-file-word',
        description: 'Displays total characters, words, sentences, lines, and paragraphs in a piece of text',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'minecraft-codes': {
        link: 'info/minecraft-codes',
        title: 'Minecraft Formatting Codes',
        icon: 'fa-solid fa-gamepad',
        description: 'List of all Minecraft color and formatting codes',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: false,
        minecraftColorCodes,
        minecraftFormattingCodes,
    },
    'phonetic-alphabet': {
        link: 'info/phonetic-alphabet',
        title: 'NATO Phonetic Alphabet',
        icon: 'fa-solid fa-arrow-down-a-z',
        description: 'Code words used by the military/police for letters',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: false,
        alphabet,
    },
    'queer-calendar': {
        link: 'info/queer-calendar',
        title: 'Queer Calendar',
        icon: 'fa-solid fa-calendar-days',
        description: 'Show LGBTQ+ related events for the current date or an inputted date of the current year',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'state-abbreviations': {
        link: 'info/state-abbreviations',
        title: 'State Abbreviations',
        icon: 'fa-solid fa-map-marked-alt',
        description: 'List of all state abbreviations',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: false,
        stateAbbreviations,
    },
    'text-abbreviations': {
        link: 'info/text-abbreviations',
        title: 'Text Abbreviations',
        icon: 'fa-solid fa-spell-check',
        description: 'List of common abbreviations used in text',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: false,
        textAbbreviations,
    },
    'tone-indicators': {
        link: 'info/tone-indicators',
        title: 'Tone Indicators',
        icon: 'fa-solid fa-slash',
        description: 'List of common tone indicators',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: false,
        toneIndicators,
    },
    'astronomy-picture': {
        link: 'fun/astronomy-picture',
        title: 'Astronomy Picture of the Day',
        icon: 'fa-solid fa-meteor',
        description: 'View <span class="tooltip-bottom" data-tooltip="National Aeronautics and Space Administration">NASA</span>\'s Astronomy Picture of the Day (APOD)',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'eight-ball': {
        link: 'fun/eight-ball',
        title: 'Magic Eight Ball',
        icon: 'fa-solid fa-circle-dot',
        description: 'Ask a question, and it will give you an answer!',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'mp3-player': {
        link: 'fun/mp3-player',
        title: 'MP3 Player',
        icon: 'fa-solid fa-music',
        description: 'Play some music!',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'random-fact': {
        link: 'fun/random-fact',
        title: 'Random Fact',
        icon: 'fa-solid fa-circle-info',
        description: 'Generate a random fact',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
    'random-joke': {
        link: 'fun/random-joke',
        title: 'Random Joke',
        icon: 'fa-regular fa-face-grin-tears',
        description: 'Generate a random joke',
        keywords: [],
        additionalScripts: [],
        additionalStyles: [],
        script: true,
    },
};
