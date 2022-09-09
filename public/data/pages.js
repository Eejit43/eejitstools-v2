const imports = {
    heic2any: { link: 'external/heic2any.js', external: false, module: true },
    mathJs: { link: 'https://unpkg.com/mathjs/lib/browser/math.js', external: true, module: false },
    minecraftCss: '/styles/minecraft.css',
    odometerCss: '/styles/external/odometer.css',
    odometerJs: { link: 'external/odometer.js', external: false, module: true }
};

const phoneticAlphabet = [
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
    { letter: 'Z', codeWord: 'Zulu' }
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
    { abbreviation: 'YW', meaning: "you're welcome" }
];

const toneIndicators = [
    { indicator: '!', meaning: 'surprise or excitement' },
    { indicator: '?!', meaning: 'excited or surprised question' },
    { indicator: '?', meaning: 'confusion' },
    { indicator: 'a', meaning: 'alterous' },
    { indicator: 'aff', meaning: 'affectionate' },
    { indicator: 'ay', meaning: 'at you' },
    { indicator: 'c', meaning: 'copypasta (something copied and pasted everywhere)' },
    { indicator: 'cb', meaning: 'clickbait' },
    { indicator: 'cj', meaning: 'coping joke' },
    { indicator: 'con', meaning: 'concerned' },
    { indicator: 'cr', meaning: 'cringey' },
    { indicator: 'crit', meaning: 'being critical / giving criticism' },
    { indicator: 'cur', meaning: 'curious' },
    { indicator: 'cwh', meaning: 'coping with humour' },
    { indicator: 'dkm', meaning: "don't kill me (used with opinions or some jokes)" },
    { indicator: 'dr', meaning: "don't reply" },
    { indicator: 'e', meaning: 'embarrassed <i>OR</i> excited' },
    { indicator: 'f', meaning: 'fake' },
    { indicator: 'fex', meaning: 'for example' },
    { indicator: 'fl', meaning: 'flirting' },
    { indicator: 'g or /gen', meaning: 'genuine / genuine statement / genuine question' },
    { indicator: 'gen', meaning: 'genuine question' },
    { indicator: 'hj', meaning: 'half joking' },
    { indicator: 'hlh', meaning: 'half lighthearted' },
    { indicator: 'hs or /iw', meaning: 'headspace / innerworld' },
    { indicator: 'hs', meaning: 'half sarcastic' },
    { indicator: 'hsrs', meaning: 'half serious' },
    { indicator: 'hyp', meaning: 'hyperbole' },
    { indicator: 'i or /ir', meaning: 'ironic' },
    { indicator: 'ij', meaning: 'inside joke' },
    { indicator: 'j', meaning: 'joke or joking' },
    { indicator: 'l or /ly or /lyr', meaning: 'lyrics' },
    { indicator: 'lh', meaning: 'light hearted' },
    { indicator: 'li', meaning: 'literal / literally' },
    { indicator: 'lj or /lhj', meaning: 'light (hearted) joke' },
    { indicator: 'lu', meaning: 'little upset' },
    { indicator: 'ly', meaning: 'lyrics' },
    { indicator: 'm', meaning: 'metaphor / metaphorically <i>OR</i> mocking' },
    { indicator: 'met', meaning: 'metaphorical' },
    { indicator: 'mhly', meaning: 'misheard lyrics' },
    { indicator: 'mj', meaning: 'mostly or mainly joking' },
    { indicator: 'ms', meaning: 'mostly sarcastic <i>OR</i> meatspace / the physical world' },
    { indicator: 'msrs', meaning: 'mostly serious' },
    { indicator: 'nav', meaning: 'not a vent' },
    { indicator: 'nay', meaning: 'not at you' },
    { indicator: 'nb', meaning: 'not bragging' },
    { indicator: 'nbh', meaning: 'for when you\'re "vagueposting" or venting, but it\'s directed at nobody here (none of your followers)' },
    { indicator: 'nbr', meaning: 'not being rude' },
    { indicator: 'nc or /neg', meaning: 'negative connotation' },
    { indicator: 'neg', meaning: 'negative connotation' },
    { indicator: 'neu', meaning: 'neutral / neutral connotation' },
    { indicator: 'nf or /nfta', meaning: 'not forcing / not forced to answer' },
    { indicator: 'nm', meaning: 'not mad' },
    { indicator: 'non', meaning: 'nonsense' },
    { indicator: 'npa', meaning: 'not passive-aggressive' },
    { indicator: 'ns', meaning: 'not sure' },
    { indicator: 'nsb', meaning: 'not sub-posting (refers to someone without mentioning them)' },
    { indicator: 'nsrs', meaning: 'not serious' },
    { indicator: 'nsx or /nx or /ns', meaning: 'no <spoiler>sexual</spoiler> intent' },
    { indicator: 'ot', meaning: 'off topic' },
    { indicator: 'p or /pl', meaning: 'platonic (intimate, not <spoiler>sexual</spoiler>)' },
    { indicator: 'p', meaning: 'platonic' },
    { indicator: 'pa', meaning: 'passive-aggressive' },
    { indicator: 'pc or /pos', meaning: 'positive connotation' },
    { indicator: 'pf', meaning: 'playful' },
    { indicator: 'pos', meaning: 'positive connotation' },
    { indicator: 'pr', meaning: 'parental' },
    { indicator: 'pw', meaning: 'physical world' },
    { indicator: 'q or /quo', meaning: 'quote' },
    { indicator: 'r', meaning: 'romantic' },
    { indicator: 'ref', meaning: 'reference' },
    { indicator: 'rh or /rt', meaning: 'rhetorical question' },
    { indicator: 'rp', meaning: 'roleplay' },
    { indicator: 's or /sarc', meaning: 'sarcastic / sarcasm' },
    { indicator: 'srs', meaning: 'serious' },
    { indicator: 'st', meaning: 'still thinking' },
    { indicator: 'sx or /x', meaning: '<spoiler>sexual</spoiler> intent' },
    { indicator: 't', meaning: 'teasing' },
    { indicator: 'tfj', meaning: '3/4 joking' },
    { indicator: 'th', meaning: 'threat' },
    { indicator: 'tic', meaning: 'tics' },
    { indicator: 'ui', meaning: 'unironic' },
    { indicator: 'vu', meaning: 'very upset' },
    { indicator: 'wp', meaning: 'wrong proxy' }
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
    { color: 'Black', colorName: 'black', colorCode: '0', motdCode: '00A70', hexCode: '000000', backgroundColor: '000000', textColor: 'fafafa' }
];

const minecraftFormattingCodes = [
    { type: 'Obfuscated', formattingCode: 'k', motdCode: '00A7k', style: '' },
    { type: 'Bold', formattingCode: 'l', motdCode: '00A7l', style: 'font-weight: bold' },
    { type: 'Strikethrough', formattingCode: 'm', motdCode: '00A7m', style: 'text-decoration: line-through' },
    { type: 'Underline', formattingCode: 'n', motdCode: '00A7n', style: 'text-decoration: underline' },
    { type: 'Italic', formattingCode: 'o', motdCode: '00A7o', style: 'font-style: italic' },
    { type: 'Reset color and formatting', formattingCode: 'r', motdCode: '00A7r', style: '' }
];

const stateAbbreviations = [
    { name: 'Alabama', postal: 'AL', standard: 'Ala.' },
    { name: 'Alaska', postal: 'AK', standard: 'Alaska' },
    { name: 'Arizona', postal: 'AZ', standard: 'Ariz.' },
    { name: 'Arkansas', postal: 'AR', standard: 'Ark.' },
    { name: 'California', postal: 'CA', standard: 'Calif.' },
    { name: 'Colorado', postal: 'CO', standard: 'Colo.' },
    { name: 'Connecticut', postal: 'CT', standard: 'Conn.' },
    { name: 'Delaware', postal: 'DE', standard: 'Del.' },
    { name: 'Florida', postal: 'FL', standard: 'Fla.' },
    { name: 'Georgia', postal: 'GA', standard: 'Ga.' },
    { name: 'Hawaii', postal: 'HI', standard: 'Hawaii' },
    { name: 'Idaho', postal: 'ID', standard: 'Idaho' },
    { name: 'Illinois', postal: 'IL', standard: 'Ill.' },
    { name: 'Indiana', postal: 'IN', standard: 'Ind.' },
    { name: 'Iowa', postal: 'IA', standard: 'Iowa' },
    { name: 'Kansas', postal: 'KS', standard: 'Kans.' },
    { name: 'Kentucky', postal: 'KY', standard: 'Ky.' },
    { name: 'Louisiana', postal: 'LA', standard: 'La.' },
    { name: 'Maine', postal: 'ME', standard: 'Maine' },
    { name: 'Maryland', postal: 'MD', standard: 'Md.' },
    { name: 'Massachusetts', postal: 'MA', standard: 'Mass.' },
    { name: 'Michigan', postal: 'MI', standard: 'Mich.' },
    { name: 'Minnesota', postal: 'MN', standard: 'Minn.' },
    { name: 'Mississippi', postal: 'MS', standard: 'Miss.' },
    { name: 'Missouri', postal: 'MO', standard: 'Mo.' },
    { name: 'Montana', postal: 'MT', standard: 'Mont.' },
    { name: 'Nebraska', postal: 'NE', standard: 'Nebr.' },
    { name: 'Nevada', postal: 'NV', standard: 'Nev.' },
    { name: 'New Hampshire', postal: 'NH', standard: 'N.H.' },
    { name: 'New Jersey', postal: 'NJ', standard: 'N.J.' },
    { name: 'New Mexico', postal: 'NM', standard: 'N.M.' },
    { name: 'New York', postal: 'NY', standard: 'N.Y.' },
    { name: 'North Carolina', postal: 'NC', standard: 'N.C.' },
    { name: 'North Dakota', postal: 'ND', standard: 'N.D.' },
    { name: 'Ohio', postal: 'OH', standard: 'Ohio' },
    { name: 'Oklahoma', postal: 'OK', standard: 'Okla.' },
    { name: 'Oregon', postal: 'OR', standard: 'Ore.' },
    { name: 'Pennsylvania', postal: 'PA', standard: 'Pa.' },
    { name: 'Rhode Island', postal: 'RI', standard: 'R.I.' },
    { name: 'South Carolina', postal: 'SC', standard: 'S.C.' },
    { name: 'South Dakota', postal: 'SD', standard: 'S.D.' },
    { name: 'Tennessee', postal: 'TN', standard: 'Tenn.' },
    { name: 'Texas', postal: 'TX', standard: 'Tex.' },
    { name: 'Utah', postal: 'UT', standard: 'Utah' },
    { name: 'Vermont', postal: 'VT', standard: 'Vt.' },
    { name: 'Virginia', postal: 'VA', standard: 'Va.' },
    { name: 'Washington', postal: 'WA', standard: 'Wash.' },
    { name: 'West Virginia', postal: 'WV', standard: 'W.Va.' },
    { name: 'Wisconsin', postal: 'WI', standard: 'Wis.' },
    { name: 'Wyoming', postal: 'WY', standard: 'Wyo.' }
];

export const blankProperties = {
    category: '',
    description: '',
    descriptionParsed: '',
    page: '',
    additionalScripts: [],
    additionalStyles: [],
    script: false,
    style: false,
    keywords: []
};

const allPageInfo = {
    // Tools
    'audio-converter': {
        title: 'Audio Converter',
        icon: 'fa-solid fa-volume-up',
        category: 'tools',
        description: 'Convert audio files to and from various formats'
    },
    'base64-converter': {
        title: 'Base64 Encode/Decode',
        icon: 'fa-solid fa-code',
        category: 'tools',
        description: 'Encode and decode to and from Base64 format (binary)',
        keywords: ['b64']
    },
    'base64-image-converter': {
        title: 'Base64 Image Encode/Decode',
        icon: 'fa-solid fa-file-image',
        category: 'tools',
        description: 'Encode and decode images to and from Base64 format',
        keywords: ['b64']
    },
    'binary-calc': {
        title: 'Binary Calculator',
        icon: 'fa-solid fa-0',
        category: 'tools',
        description: 'Convert to/from binary/octal/decimal/hex'
    },
    'binary-text': {
        title: 'Binary Text Converter',
        icon: 'fa-solid fa-1',
        category: 'tools',
        description: 'Convert to/from binary text'
    },
    'browser-info': {
        title: 'Browser Info',
        icon: 'fa-solid fa-laptop',
        category: 'tools',
        description: 'Shows basic information about your browser and operating system'
    },
    'case-changer': {
        title: 'Case Changer',
        icon: 'fa-solid fa-font',
        category: 'tools',
        description: 'Change a string to uppercase, lowercase, title case, or sentence case'
    },
    'color-info': {
        title: 'Color Information',
        icon: 'fa-solid fa-palette',
        category: 'tools',
        description: 'Use a color picker or manually input Hexadecimal (Hex), Decimal, RGB(A), HSL(A), CMYK(A), or valid CSS color names, and view conversions and manipulate those colors'
    },
    countdowns: {
        title: 'Countdowns',
        icon: 'fa-regular fa-hourglass',
        category: 'tools',
        description: 'Shows various countdowns until major upcoming holidays'
    },
    counter: {
        title: 'Counter',
        icon: 'fa-solid fa-calculator',
        category: 'tools',
        description: 'Press a key/button to add one to a counter',
        keywords: ['spacebar'],
        additionalScripts: [imports.odometerJs],
        additionalStyles: [imports.odometerCss]
    },
    'currency-exchange': {
        title: 'Currency Exchange Rates',
        icon: 'fa-solid fa-coins',
        category: 'tools',
        description: 'Shows information for various currency conversions',
        keywords: ['usd', 'money']
    },
    'heic-converter': {
        title: 'HEIC Converter',
        icon: 'fa-solid fa-file-image',
        category: 'tools',
        description: 'Convert <span data-tooltip="High Efficiency Image File">HEIC</span> files to various formats',
        additionalScripts: [imports.heic2any]
    },
    'image-converter': {
        title: 'Image Converter',
        icon: 'fa-solid fa-image',
        category: 'tools',
        description: 'Convert images to and from various formats'
    },
    'ip-info': {
        title: 'IP Info',
        icon: 'fa-solid fa-wifi',
        category: 'tools',
        description: 'Displays your current <span class="tooltip-bottom" data-tooltip="Internet Protocol">IP</span> address, and IP provided information',
        keywords: ['internet', 'isp']
    },
    'keycode-info': {
        title: 'KeyCode Information',
        icon: 'fa-solid fa-keyboard',
        category: 'tools',
        description: 'Click any keyboard key to get the key, key location, key code, char code (ASCII), and char code (Unicode)'
    },
    'length-converter': {
        title: 'Length Converter',
        icon: 'fa-solid fa-ruler',
        category: 'tools',
        description: 'Convert between United States standard length measurements and imperial length units',
        additionalScripts: [imports.mathJs]
    },
    'list-sorter': {
        title: 'List Sorter',
        icon: 'fa-solid fa-arrow-down-wide-short',
        category: 'tools',
        description: 'Alphabetize, numerize, randomize, and reverse lists that can be defined with custom separators'
    },
    'morse-code-converter': {
        title: 'Morse Code Converter',
        icon: 'fa-solid fa-ellipsis',
        category: 'tools',
        description: 'Convert to/from Morse code'
    },
    'quick-copy': {
        title: 'Quick Copy',
        icon: 'fa-regular fa-clipboard',
        category: 'tools',
        description: 'Clipboard display, clear clipboard button, and useful characters'
    },
    'random-number': {
        title: 'Random Number Generator',
        icon: 'fa-solid fa-hashtag',
        category: 'tools',
        description: 'Generate a random number between two numbers',
        additionalScripts: [imports.odometerJs],
        additionalStyles: [imports.odometerCss]
    },
    regex: {
        title: 'Regex Tools',
        icon: 'fa-solid fa-highlighter',
        category: 'tools',
        description: 'Some useful regex tools (duplicate line remover, whitespace remover), as well as a regex tester',
        keywords: ['regular expression']
    },
    'roman-converter': {
        title: 'Roman Numeral Converter',
        icon: 'fa-solid fa-i',
        category: 'tools',
        description: 'Convert to and from roman numerals, with high level thousand supports (bars above numbers)'
    },
    'scientific-notation-converter': {
        title: 'Scientific Notation Converter',
        icon: 'fa-solid fa-e',
        category: 'tools',
        description: 'Convert between scientific (<i>e</i>) notation and decimal form',
        additionalScripts: [imports.mathJs]
    },
    stopwatch: {
        title: 'Stopwatch',
        icon: 'fa-solid fa-stopwatch',
        category: 'tools',
        description: 'Simple stopwatch (displays down to milliseconds)'
    },
    'svg-to-png': {
        title: 'SVG to PNG',
        icon: 'fa-solid fa-image',
        category: 'tools',
        description: 'Convert <span data-tooltip="Scalable Vector Graphics">SVG</span> files to <span data-tooltip="Portable Network Graphics">PNG</span> images'
    },
    'temperature-converter': {
        title: 'Temperature Converter',
        icon: 'fa-solid fa-thermometer-half',
        category: 'tools',
        description: 'Convert between Fahrenheit, Celsius/Centigrade, and Kelvin',
        additionalScripts: [imports.mathJs]
    },
    'tides-info': {
        title: 'Tides Info',
        icon: 'fa-solid fa-water',
        category: 'tools',
        description: 'Shows current tidal information and for the next 7 days'
    },
    'time-converter': {
        title: 'Time Converter',
        icon: 'fa-solid fa-hourglass',
        category: 'tools',
        description: 'Convert between units of time',
        additionalScripts: [imports.mathJs]
    },
    time: {
        title: 'Time',
        icon: 'fa-regular fa-clock',
        category: 'tools',
        description: 'Displays the current time and date (in your time zone), as well as detailed time information'
    },
    timer: {
        title: 'Countdown Timer',
        icon: 'fa-solid fa-bell fa-shake',
        category: 'tools',
        description: 'Simple countdown timer with end time display'
    },
    'unix-time-converter': {
        title: 'UNIX Time Converter',
        icon: 'fa-solid fa-calendar',
        category: 'tools',
        description: 'Convert from date strings to UNIX time (in seconds or milliseconds), and back'
    },
    'video-converter': {
        title: 'Video Converter',
        icon: 'fa-solid fa-video',
        category: 'tools',
        description: 'Convert video files to and from various formats'
    },
    'video-to-audio': {
        title: 'Video to Audio Converter',
        icon: 'fa-solid fa-volume-up',
        category: 'tools',
        description: 'Convert video files to various audio formats'
    },
    'weather-info': {
        title: 'Weather Info',
        icon: 'fa-solid fa-cloud-sun-rain',
        category: 'tools',
        description: 'Shows current weather information and alerts'
    },
    'word-counter': {
        title: 'Word Counter',
        icon: 'fa-solid fa-file-word',
        category: 'tools',
        description: 'Displays total characters, words, sentences, lines, and paragraphs in a piece of text'
    },
    // Info
    'minecraft-codes': {
        title: 'Minecraft Formatting Codes',
        icon: 'fa-solid fa-gamepad',
        category: 'info',
        description: 'List of all Minecraft color and formatting codes',
        additionalStyles: [imports.minecraftCss],
        script: false,
        minecraftColorCodes,
        minecraftFormattingCodes
    },
    'phonetic-alphabet': {
        title: 'NATO Phonetic Alphabet',
        icon: 'fa-solid fa-arrow-down-a-z',
        category: 'info',
        description: 'Code words used by the military/police for letters',
        script: false,
        phoneticAlphabet
    },
    'queer-calendar': {
        title: 'Queer Calendar',
        icon: 'fa-solid fa-calendar-days',
        category: 'info',
        description: 'Show LGBTQ+ related events for the current date or an inputted date of the current year'
    },
    'state-abbreviations': {
        title: 'State Abbreviations',
        icon: 'fa-solid fa-map-marked-alt',
        category: 'info',
        description: 'List of all state abbreviations',
        script: false,
        stateAbbreviations
    },
    'text-abbreviations': {
        title: 'Text Abbreviations',
        icon: 'fa-solid fa-spell-check',
        category: 'info',
        description: 'List of common abbreviations used in text',
        script: false,
        textAbbreviations
    },
    'tone-indicators': {
        title: 'Tone Indicators',
        icon: 'fa-solid fa-slash',
        category: 'info',
        description: 'List of common tone indicators',
        script: false,
        toneIndicators
    },
    // Fun
    'astronomy-picture': {
        title: 'Astronomy Picture of the Day',
        icon: 'fa-solid fa-meteor',
        category: 'fun',
        description: 'View <span class="tooltip-bottom" data-tooltip="National Aeronautics and Space Administration">NASA</span>\'s Astronomy Picture of the Day (APOD)'
    },
    'eight-ball': {
        title: 'Magic Eight Ball',
        icon: 'fa-solid fa-circle-dot',
        category: 'fun',
        description: 'Ask a question, and it will give you an answer!'
    },
    'mp3-player': {
        title: 'MP3 Player',
        icon: 'fa-solid fa-music',
        category: 'fun',
        description: 'Play some music!'
    },
    'random-fact': {
        title: 'Random Fact',
        icon: 'fa-solid fa-circle-info',
        category: 'fun',
        description: 'Generate a random fact'
    },
    'random-joke': {
        title: 'Random Joke',
        icon: 'fa-regular fa-face-grin-tears',
        category: 'fun',
        description: 'Generate a random joke'
    }
};

export const pagesParsed = Object.fromEntries(
    Object.entries(allPageInfo).map(([page, info]) => [
        page,
        {
            name: page,
            title: info.title || 'MISSING_TITLE',
            icon: info.icon || 'fa-solid fa-triangle-exclamation',
            category: info.category || 'tools',
            description: info.description || '',
            descriptionParsed: (info.description || '').replace(/<(.*?) ?.*?>(.*?)<\/\1>/g, '$2'),
            link: `/${info.category}/${page}`,
            keywords: info.keywords || [],
            additionalScripts: info.additionalScripts || [],
            additionalStyles: info.additionalStyles || [],
            script: info.script || true,
            style: info.style || false,
            ...Object.fromEntries(Object.entries(info).filter(([key]) => key !== 'title' && key !== 'icon' && key !== 'category' && key !== 'description' && key !== 'keywords' && key !== 'additionalScripts' && key !== 'additionalStyles' && key !== 'script' && key !== 'style'))
        }
    ])
);
