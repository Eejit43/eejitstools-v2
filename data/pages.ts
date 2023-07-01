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
    { abbreviation: 'AF / ASF', meaning: 'as <span class="spoiler">fuck</span>, such as "I\'m bored af"' },
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
    { abbreviation: 'FFS', meaning: 'for <span class="spoiler">fuck</span>\'s sake' },
    { abbreviation: 'FOMO', meaning: 'fear of missing out' },
    { abbreviation: 'FTLOG', meaning: 'for the love of god' },
    { abbreviation: 'FU', meaning: '<span class="spoiler">fuck</span> you' },
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
    { abbreviation: 'NSFW', meaning: 'not safe for work, usually <span class="spoiler">sexual</span> or gross content' },
    { abbreviation: 'NVM / NM', meaning: 'nevermind <em>OR</em> not (very) much' },
    { abbreviation: 'NW', meaning: 'no worries' },
    { abbreviation: 'OC', meaning: 'original content' },
    { abbreviation: 'OG', meaning: 'original (original gangster)' },
    { abbreviation: 'OMFG', meaning: 'oh my <span class="spoiler">fuck</span>ing god' },
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
    { abbreviation: 'STFU', meaning: 'shut the <span class="spoiler">fuck</span> up' },
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
    { abbreviation: 'WTF / TF', meaning: '(what) the <span class="spoiler">fuck</span>' },
    { abbreviation: 'WTH', meaning: 'what the heck/hell' },
    { abbreviation: 'YK', meaning: 'you know' },
    { abbreviation: 'YOLO', meaning: 'you only live once' },
    { abbreviation: 'YW', meaning: "you're welcome" }
];

export const toneIndicators = [
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
    { indicator: 'g or /gen', meaning: 'genuine / genuine statement' },
    { indicator: 'gq', meaning: 'genuine question' },
    { indicator: 'hj', meaning: 'half joking' },
    { indicator: 'hlh', meaning: 'half lighthearted' },
    { indicator: 'hs', meaning: 'half sarcastic' },
    { indicator: 'hsrs', meaning: 'half serious' },
    { indicator: 'hyp', meaning: 'hyperbole' },
    { indicator: 'i or /ir', meaning: 'ironic' },
    { indicator: 'ij', meaning: 'inside joke' },
    { indicator: 'j', meaning: 'joke or joking' },
    { indicator: 'l or /ly or /lyr', meaning: 'lyric(s)' },
    { indicator: 'lh', meaning: 'light hearted' },
    { indicator: 'li', meaning: 'literal / literally' },
    { indicator: 'lj or /lhj', meaning: 'light (hearted) joke' },
    { indicator: 'lu', meaning: 'little upset' },
    { indicator: 'm', meaning: 'metaphor / metaphorically <i>OR</i> mocking' },
    { indicator: 'met', meaning: 'metaphorical' },
    { indicator: 'mhly', meaning: 'misheard lyrics' },
    { indicator: 'mj', meaning: 'mostly or mainly joking' },
    { indicator: 'ms', meaning: 'mostly sarcastic' },
    { indicator: 'msrs', meaning: 'mostly serious' },
    { indicator: 'nav', meaning: 'not a vent' },
    { indicator: 'nay', meaning: 'not at you' },
    { indicator: 'nb', meaning: 'not bragging' },
    { indicator: 'nbh', meaning: 'nobody here; not about anybody that would see the message' },
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
    { indicator: 'nsx or /nx or /ns', meaning: 'no <span class="spoiler">sexual</span> intent' },
    { indicator: 'ot', meaning: 'off topic' },
    { indicator: 'p or /pl', meaning: 'platonic (intimate, not <span class="spoiler">sexual</span>)' },
    { indicator: 'pa', meaning: 'passive-aggressive' },
    { indicator: 'pc or /pos', meaning: 'positive connotation' },
    { indicator: 'pf', meaning: 'playful' },
    { indicator: 'pos', meaning: 'positive connotation' },
    { indicator: 'pr', meaning: 'parental' },
    { indicator: 'q or /quo', meaning: 'quote' },
    { indicator: 'r', meaning: 'romantic' },
    { indicator: 'ref', meaning: 'reference' },
    { indicator: 'rh or /rt', meaning: 'rhetorical question' },
    { indicator: 'rp', meaning: 'roleplay' },
    { indicator: 's or /sarc', meaning: 'sarcastic / sarcasm' },
    { indicator: 'srs', meaning: 'serious' },
    { indicator: 'st', meaning: 'still thinking' },
    { indicator: 'sx or /x', meaning: '<span class="spoiler">sexual</span> intent' },
    { indicator: 't', meaning: 'teasing' },
    { indicator: 'tfj', meaning: '3/4 joking' },
    { indicator: 'th', meaning: 'threat' },
    { indicator: 'tic', meaning: 'tics' },
    { indicator: 'ui', meaning: 'unironic' },
    { indicator: 'vu', meaning: 'very upset' }
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

interface Script {
    link: string;
    module?: boolean;
    external?: boolean;
}

interface Style {
    link: string;
}

interface Imports {
    [key: string]: {
        script?: Script;
        style?: Style;
    };
}

const imports: Imports = {
    mathJs: {
        script: { link: 'https://unpkg.com/mathjs/lib/browser/math.js' }
    },
    minecraft: {
        style: { link: 'minecraft.css' }
    },
    odometer: {
        style: { link: 'external/odometer.css' },
        script: { link: '/scripts/external/odometer.js', module: true, external: false }
    },
    mathJax: {
        script: { link: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js' }
    }
};

export const blankProperties = {
    title: '',
    id: '',
    icon: '',
    description: '',
    descriptionParsed: '',
    toolbox: false,
    iconStyle: null,
    toolboxTitle: null,
    script: false,
    style: false,
    additionalScripts: [],
    additionalStyles: [],
    keywords: []
};

interface Page {
    title: string;
    icon: string;
    description: string;
    toolbox?: boolean;
    iconStyle?: string | null;
    toolboxTitle?: string | null;
    script?: boolean;
    style?: boolean;
    additionalScripts?: (Script | undefined)[];
    additionalStyles?: (Style | undefined)[];
    additionalData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    keywords?: string[];
}

interface PreParsedPages {
    [category: string]: {
        [id: string]: Page;
    };
}

const preParsedPages: PreParsedPages = {
    tools: {
        'base64-converter': { title: 'Base64 Encode/Decode', icon: 'code', description: 'Encode and decode to and from Base64 format' },
        'base64-image-converter': { title: 'Base64 Image Encode/Decode', icon: 'file-image', description: 'Encode and decode images to and from Base64 format' },
        'binary-calc': { title: 'Binary Calculator', icon: 'binary', description: 'Convert to/from binary/octal/decimal/hex' },
        'binary-text': { title: 'Binary Text Converter', icon: 'file-binary', description: 'Convert to/from binary text' },
        'browser-info': { title: 'Browser Info', icon: 'laptop', description: 'Shows basic information about your browser and operating system' },
        calendar: { title: 'Calendar', icon: 'calendar', description: 'A simple calendar with personal to-do list', toolbox: false },
        'case-changer': { title: 'Case Changer', icon: 'font-case', description: 'Change a string to uppercase, lowercase, title case, or sentence case' },
        'color-info': { title: 'Color Information', icon: 'palette', description: 'Use a color picker or manually input Hexadecimal (Hex), Decimal, RGB(A), HSL(A), CMYK(A), or valid CSS color names, and view conversions and manipulate those colors' },
        timer: { title: 'Countdown Timer', icon: 'bell', description: 'Simple countdown timer with end time display' },
        countdowns: { title: 'Countdowns', icon: 'hourglass-half', description: 'Shows various countdowns until major upcoming holidays' },
        counter: { title: 'Counter', icon: 'calculator', description: 'Press a key/button to add one to a counter', keywords: ['spacebar'], additionalScripts: [imports.odometer.script], additionalStyles: [imports.odometer.style] },
        'currency-exchange': { title: 'Currency Exchange Rates', icon: 'coins', description: 'Shows information for various currency conversions', keywords: ['usd', 'money'] },
        'image-converter': { title: 'Image Converter', icon: 'file-image', description: 'Convert images to and from various formats' },
        'ip-info': { title: 'IP Info', icon: 'router', description: 'Displays your current <span class="tooltip-bottom" data-tooltip="Internet Protocol">IP</span> address, and IP provided information', keywords: ['internet', 'isp'] },
        'keycode-info': { title: 'KeyCode Information', icon: 'keyboard', description: 'Click any keyboard key to get the key, key location, key code, char code (ASCII), and char code (Unicode)' },
        'length-converter': { title: 'Length Converter', icon: 'ruler-horizontal', description: 'Convert between United States standard length measurements and imperial length units', additionalScripts: [imports.mathJs.script] },
        'list-sorter': { title: 'List Sorter', icon: 'arrow-down-wide-short', description: 'Alphabetize, numerize, randomize, and reverse lists that can be defined with custom separators' },
        'morse-code-converter': { title: 'Morse Code Converter', icon: 'message-dots', description: 'Convert to/from Morse code' },
        'quick-copy': { title: 'Quick Copy', icon: 'clipboard', description: 'Clipboard display, clear clipboard button, and useful characters' },
        'radical-simplifier': { title: 'Radical Simplifier', icon: 'square-root-variable', description: 'Simplify radical expressions', keywords: ['root', 'square root'], additionalScripts: [imports.mathJax.script] },
        'random-number': { title: 'Random Number Generator', icon: 'hashtag', description: 'Generate a random number between two numbers', additionalScripts: [imports.odometer.script], additionalStyles: [imports.odometer.style] },
        'regex-tester': { title: 'Regex Tester', icon: 'highlighter', description: 'Test and run regex', keywords: ['regular expression'] },
        'roman-converter': { title: 'Roman Numeral Converter', icon: 'i', description: 'Convert to and from roman numerals, with high level thousand supports (bars above numbers)' },
        'scientific-notation-converter': { title: 'Scientific Notation Converter', icon: 'e', description: 'Convert between scientific (<i>e</i>) notation and decimal form', additionalScripts: [imports.mathJs.script] },
        stopwatch: { title: 'Stopwatch', icon: 'stopwatch', description: 'Simple stopwatch (displays down to milliseconds)' },
        'svg-to-png': { title: 'SVG to PNG', icon: 'file-image', description: 'Convert <span data-tooltip="Scalable Vector Graphics">SVG</span> files to <span data-tooltip="Portable Network Graphics">PNG</span> images', toolboxTitle: '<span data-tooltip="Scalable Vector Graphics">SVG</span> to <span data-tooltip="Portable Network Graphics">PNG</span> Converter' },
        'temperature-converter': { title: 'Temperature Converter', icon: 'temperature-list', description: 'Convert between Fahrenheit, Celsius/Centigrade, and Kelvin', additionalScripts: [imports.mathJs.script] },
        'tides-info': { title: 'Tides Info', icon: 'water', description: 'Shows current tidal information and for the next 7 days' },
        'time-converter': { title: 'Time Converter', icon: 'hourglass-clock', description: 'Convert between units of time', additionalScripts: [imports.mathJs.script] },
        time: { title: 'Time', icon: 'clock', description: 'Displays the current time and date (in your time zone), as well as detailed time information' },
        'unix-time-converter': { title: 'UNIX Time Converter', icon: 'calendar-clock', description: 'Convert from date strings to UNIX time (in seconds or milliseconds), and back' },
        'weather-info': { title: 'Weather Info', icon: 'cloud-sun-rain', description: 'Shows current weather information and alerts' },
        'word-counter': { title: 'Word Counter', icon: 'file-word', description: 'Displays total characters, words, sentences, lines, and paragraphs in a piece of text' }
    },
    info: {
        'coins-list': { title: 'Coins List', icon: 'coins', description: 'A list of coins I have/need' },
        'minecraft-codes': { title: 'Minecraft Formatting Codes', icon: 'gamepad-modern', description: 'List of all Minecraft color and formatting codes', additionalStyles: [imports.minecraft.style], additionalData: { minecraftColorCodes, minecraftFormattingCodes }, iconStyle: 'padding-right: 5px', toolboxTitle: '<span style="font-size: 27px" class="mcui-text format-2"><span class="format-l">Minecraft</span></span> Formatting Codes' },
        'phonetic-alphabet': { title: 'NATO Phonetic Alphabet', icon: 'arrow-down-a-z', description: 'Code words used by the military/police for letters', additionalData: { phoneticAlphabet } },
        'queer-calendar': { title: 'Queer Calendar', icon: 'calendar-days', description: 'Show LGBTQ+ related events for the current date or an inputted date of the current year', iconStyle: 'color: #e73636', toolboxTitle: '<span style="color: #e78236">Q</span><span style="color: #e7ce36">u</span><span style="color: #b5e736">e</span><span style="color: #69e736">e</span><span style="color: #36e74f">r</span> <span style="color: #36e79b">C</span><span style="color: #36e7e7">a</span><span style="color: #369be7">l</span><span style="color: #364fe7">e</span><span style="color: #6936e7">n</span><span style="color: #b536e7">d</span><span style="color: #e736ce">a</span><span style="color: #e73682">r</span> 🏳️‍🌈' },
        'state-abbreviations': { title: 'State Abbreviations', icon: 'map-location-dot', description: 'List of all state abbreviations', additionalData: { stateAbbreviations } },
        'text-abbreviations': { title: 'Text Abbreviations', icon: 'text', description: 'List of common abbreviations used in text', additionalData: { textAbbreviations } },
        'tone-indicators': { title: 'Tone Indicators', icon: 'slash-back', description: 'List of common tone indicators', additionalData: { toneIndicators } }
    },
    fun: {
        'astronomy-picture': { title: 'Astronomy Picture of the Day', icon: 'planet-ringed', description: 'View <span class="tooltip-bottom" data-tooltip="National Aeronautics and Space Administration">NASA</span>\'s Astronomy Picture of the Day (APOD)' },
        'eight-ball': { title: 'Magic Eight Ball', icon: 'pool-8-ball', description: 'Ask a question, and it will give you an answer!' },
        'mp3-player': { title: 'MP3 Player', icon: 'music', description: 'Play some music!', toolbox: false },
        'random-fact': { title: 'Random Fact', icon: 'circle-info', description: 'Generate a random fact' },
        'random-joke': { title: 'Random Joke', icon: 'face-grin-tears', description: 'Generate a random joke' }
    }
};

interface ParsedPage extends Page {
    id: string;
    descriptionParsed: string;
    toolbox: boolean;
    iconStyle: string | null;
    toolboxTitle: string | null;
    script: boolean;
    style: boolean;
    additionalScripts: (Script | undefined)[];
    additionalStyles: (Style | undefined)[];
    keywords: string[];
    category: string;
    link: string;
}

interface AllPages {
    [category: string]: {
        [id: string]: ParsedPage;
    };
}

export const allPages = structuredClone(preParsedPages) as AllPages;

Object.entries(preParsedPages).forEach(([category, pages]) => {
    Object.entries(pages).forEach(([id, page]) => {
        (allPages[category] as { [id: string]: ParsedPage })[id] = {
            ...blankProperties,
            ...page,
            descriptionParsed: page.description.replace(/<(.*?) ?.*?>(.*?)<\/\1>/g, '$2'),
            id,
            category,
            link: `/${category}/${id}`,
            toolbox: page.toolbox ?? true
        };

        if (!('script' in page)) delete pages[id].script;
        if (!('style' in page)) delete pages[id].style;
    });
});

/* eslint-disable @typescript-eslint/naming-convention */

export const holidayEmojis = {
    "New Year's Day": '🎉',
    'Martin Luther King Jr. Day': '👴🏾',
    'First Day of Black History Month': '✊🏿',
    "Valentine's Day": '❤️',
    "Presidents' Day": '🤵',
    "First Day of Women's History Month": '👩',
    "St. Patrick's Day": '☘️',
    'Daylight Saving Time starts': '🕑',
    'Easter Sunday': '🐇',
    'Tax Day': '💰',
    'Easter Monday': '🐇',
    'First Day of Asian Pacific American Heritage Month': '🌏',
    'Cinco de Mayo': '🥳',
    "Mother's Day": '🤱',
    'Memorial Day': '🪦',
    'First Day of LGBTQ+ Pride Month': '🏳️‍🌈',
    'Flag Day': '🇺🇸',
    "Father's Day": '👨',
    Juneteenth: '✊🏿',
    'Summer Solstice': '☀️',
    'Independence Day': '🇺🇸',
    'Labor Day': '🛠',
    'First Day of Hispanic Heritage Month': '🌎',
    "Indigenous Peoples' Day": '🪶',
    'Columbus Day': '⛵️',
    Halloween: '🎃',
    'First Day of American Indian Heritage Month': '🪶',
    'Daylight Saving Time ends': '🕑',
    'Election Day': '🗳️',
    'Veterans Day': '🎖️',
    'Thanksgiving Day': '🦃',
    'Native American Heritage Day': '🪶',
    'Winter Solstice': '❄️',
    'Christmas Eve': '🎅🏻',
    'Christmas Day': '🎄',
    "New Year's Eve": '🕛'
};

export const moonEmojis = {
    'New moon': '🌑',
    'First quarter': '🌓',
    'Full moon': '🌕',
    'Last quarter': '🌗'
};
