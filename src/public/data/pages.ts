import {
    euroCoins,
    minecraftColorCodes,
    minecraftFormattingCodes,
    phoneticAlphabet,
    stateAbbreviations,
    textAbbreviations,
    toneIndicators,
} from './pages-data.js';

interface Script {
    link: string;
    module?: boolean;
    external?: boolean;
}

interface Style {
    link: string;
}

const imports = {
    mathJax: {
        script: { link: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js' },
    },
    mathJs: {
        script: { link: 'https://unpkg.com/mathjs/lib/browser/math.js' },
    },
    odometer: {
        style: { link: 'external/odometer.css' },
        script: { link: '/scripts/external/odometer.js', module: true, external: false },
    },
    uaParser: {
        script: { link: 'https://cdn.jsdelivr.net/npm/ua-parser-js/src/ua-parser.min.js' },
    },
    chroma: {
        script: { link: 'https://cdn.jsdelivr.net/npm/chroma-js/chroma.min.js' },
    },
    suncalc: {
        script: { link: 'https://cdn.jsdelivr.net/npm/suncalc3/suncalc.js' },
    },
} satisfies Record<string, { script?: Script; style?: Style }>;

export const blankProperties = {
    title: "Eejit's Tools",
    id: '',
    icon: '',
    description: 'Some useful tools for general purposes!',
    descriptionParsed: 'Some useful tools for general purposes!',
    toolbox: false,
    toolboxTitle: null,
    script: false,
    style: false,
    additionalScripts: [],
    additionalStyles: [],
    keywords: [],
};

interface Page {
    title: string;
    icon: string;
    description: string;
    toolbox?: boolean;
    toolboxTitle?: string | null;
    script?: boolean;
    style?: boolean;
    additionalScripts?: (Script | undefined)[];
    additionalStyles?: (Style | undefined)[];
    additionalData?: unknown;
    keywords?: string[];
}

type PreParsedPages = Record<string, Record<string, Page>>;

const preParsedPages: PreParsedPages = {
    tools: {
        'base64-converter': { title: 'Base64 Encode/Decode', icon: 'code', description: 'Encode and decode to and from Base64 format' },
        'base64-image-converter': {
            title: 'Base64 Image Encode/Decode',
            icon: 'file-image',
            description: 'Encode and decode images to and from Base64 format',
        },
        'binary-converter': { title: 'Binary Converter', icon: 'binary', description: 'Convert to and from binary/octal/decimal/hex' },
        'binary-text': { title: 'Binary Text Converter', icon: 'file-binary', description: 'Convert to and from binary text' },
        'browser-info': {
            title: 'Browser Info',
            icon: 'laptop',
            description: 'Shows basic information about your browser and operating system',
            additionalScripts: [imports.uaParser.script],
        },
        'calendar': { title: 'Calendar', icon: 'calendar', description: 'A simple calendar with a personal to-do list', toolbox: false },
        'case-changer': {
            title: 'Case Changer',
            icon: 'font-case',
            description: 'Change a string to uppercase, lowercase, title case, or sentence case',
        },
        'color-info': {
            title: 'Color Information',
            icon: 'palette',
            description: 'Use a color picker or manually input colors to view information about the color and manipulate it',
            additionalScripts: [imports.chroma.script],
        },
        'timer': { title: 'Countdown Timer', icon: 'bell', description: 'A simple countdown timer with end time display' },
        'countdowns': { title: 'Countdowns', icon: 'hourglass-half', description: 'Shows countdowns until upcoming major holidays' },
        'counter': {
            title: 'Counter',
            icon: 'calculator',
            description: 'Press a key or button to add one to a counter',
            keywords: ['spacebar'],
            additionalScripts: [imports.odometer.script],
            additionalStyles: [imports.odometer.style],
        },
        'currency-exchange': {
            title: 'Currency Exchange Rates',
            icon: 'coins',
            description: 'Shows information for various currency conversions',
            keywords: ['usd', 'money'],
        },
        'image-converter': { title: 'Image Converter', icon: 'file-image', description: 'Convert images to and from various formats' },
        'ip-info': {
            title: 'IP Info',
            icon: 'router',
            description:
                'Displays your current <span class="tooltip-bottom" data-tooltip="Internet Protocol">IP</span> address and IP provided information',
            toolboxTitle: '<span data-tooltip="Internet Protocol">IP</span> Info',
            keywords: ['internet', 'isp'],
        },
        'keycode-info': {
            title: 'Keycode Information',
            icon: 'keyboard',
            description: 'Click any keyboard key to get information about it',
        },
        'length-converter': {
            title: 'Length Converter',
            icon: 'ruler-horizontal',
            description: 'Convert between United States standard length measurements and imperial length units',
            additionalScripts: [imports.mathJs.script],
        },
        'list-sorter': {
            title: 'List Sorter',
            icon: 'arrow-down-wide-short',
            description: 'Alphabetize, sort in numerical order, randomize, and reverse lists',
        },
        'morse-code-converter': { title: 'Morse Code Converter', icon: 'message-dots', description: 'Convert to and from Morse code' },
        'quick-copy': {
            title: 'Quick Copy',
            icon: 'clipboard',
            description: 'Clipboard display, clear clipboard button, and useful characters',
        },
        'radical-simplifier': {
            title: 'Radical Simplifier',
            icon: 'square-root-variable',
            description: 'Simplify radical expressions',
            keywords: ['root', 'square root'],
            additionalScripts: [imports.mathJax.script],
        },
        'random-number': {
            title: 'Random Number Generator',
            icon: 'hashtag',
            description: 'Generate a random number between two numbers',
            additionalScripts: [imports.odometer.script],
            additionalStyles: [imports.odometer.style],
        },
        'regex-tester': { title: 'Regex Tester', icon: 'highlighter', description: 'Test and run regex', keywords: ['regular expression'] },
        'roman-converter': {
            title: 'Roman Numeral Converter',
            icon: 'i',
            description: 'Convert to and from roman numerals, with high value number support',
        },
        'scientific-notation-converter': {
            title: 'Scientific Notation Converter',
            icon: 'e',
            description: 'Convert between scientific (<i>e</i>) notation and decimal form',
            additionalScripts: [imports.mathJs.script],
        },
        'stopwatch': { title: 'Stopwatch', icon: 'stopwatch', description: 'Simple stopwatch that displays down to the milliseconds' },
        'svg-to-png': {
            title: 'SVG to PNG',
            icon: 'file-image',
            description:
                'Convert <span data-tooltip="Scalable Vector Graphics">SVG</span> files to <span data-tooltip="Portable Network Graphics">PNG</span> images',
            toolboxTitle:
                '<span data-tooltip="Scalable Vector Graphics">SVG</span> to <span data-tooltip="Portable Network Graphics">PNG</span> Converter',
        },
        'temperature-converter': {
            title: 'Temperature Converter',
            icon: 'temperature-list',
            description: 'Convert between Fahrenheit, Celsius/Centigrade, and Kelvin',
            additionalScripts: [imports.mathJs.script],
        },
        'tides-info': { title: 'Tides Info', icon: 'water', description: 'Shows current tidal information and for the next 7 days' },
        'time-converter': {
            title: 'Time Converter',
            icon: 'hourglass-clock',
            description: 'Convert between units of time',
            additionalScripts: [imports.mathJs.script],
        },
        'time': { title: 'Time', icon: 'clock', description: 'Displays the current time and date, as well as detailed time information' },
        'unix-time-converter': {
            title: 'UNIX Time Converter',
            icon: 'calendar-clock',
            description: 'Convert from date strings to UNIX time (in seconds or milliseconds), and back',
        },
        'weather-info': {
            title: 'Weather Info',
            icon: 'cloud-sun-rain',
            description: 'Shows current weather information and alerts',
            additionalScripts: [imports.suncalc.script],
        },
        'word-counter': {
            title: 'Word Counter',
            icon: 'file-word',
            description: 'Displays total characters, words, sentences, lines, and paragraphs in a piece of text',
        },
    },
    info: {
        'coins-info': {
            title: 'Coins Info',
            icon: 'coin',
            description: 'Information about all coins that have been produced for circulation in the United States',
        },
        'coins-list': { title: 'Coins List', icon: 'coins', description: 'A list of coins I have and need' },
        'euro-coins': {
            title: 'Euro Coins',
            icon: 'euro-sign',
            description: 'A list of all euro coin designs',
            additionalData: { euroCoins },
        },
        'foreign-collections-list': {
            title: 'Foreign Collection List',
            icon: 'earth-americas',
            description: 'A list of countries, territories, etc. I have coins, banknotes, and stamps from',
        },
        'minecraft-codes': {
            title: 'Minecraft Formatting Codes',
            icon: 'gamepad-modern',
            description: 'A list of all Minecraft color and formatting codes',
            additionalData: { minecraftColorCodes, minecraftFormattingCodes },
        },
        'phonetic-alphabet': {
            title: 'NATO Phonetic Alphabet',
            icon: 'arrow-down-a-z',
            description: 'A list of words used as a replacement for letters',
            additionalData: { phoneticAlphabet },
        },
        'queer-calendar': {
            title: 'Queer Calendar',
            icon: 'calendar-days',
            description: 'Show LGBTQ+ related events for a given date',
            toolboxTitle:
                '<span style="color: var(--brand-color-1)">Q</span><span style="color: var(--brand-color-2)">u</span><span style="color: var(--brand-color-4)">e</span><span style="color: var(--brand-color-6)">e</span><span style="color: var(--brand-color-8)">r</span> Calendar',
        },
        'state-abbreviations': {
            title: 'State Abbreviations',
            icon: 'map-location-dot',
            description: 'A list of all state abbreviations',
            additionalData: { stateAbbreviations },
        },
        'text-abbreviations': {
            title: 'Text Abbreviations',
            icon: 'text',
            description: 'A list of common abbreviations used in text',
            additionalData: { textAbbreviations },
        },
        'tone-indicators': {
            title: 'Tone Indicators',
            icon: 'slash-forward',
            description: 'A list of common tone indicators',
            additionalData: { toneIndicators },
        },
    },
    fun: {
        'astronomy-picture': {
            title: 'Astronomy Picture of the Day',
            icon: 'planet-ringed',
            description:
                'View <span class="tooltip-bottom" data-tooltip="National Aeronautics and Space Administration">NASA</span>\'s Astronomy Picture of the Day (APOD)',
        },
        'eight-ball': {
            title: 'Magic Eight Ball',
            icon: 'pool-8-ball',
            description: 'Ask the Magic Eight Ball a question and receive an answer!',
        },
        'mp3-player': { title: 'MP3 Player', icon: 'music', description: 'Play some music!', toolbox: false },
        'random-fact': { title: 'Random Fact', icon: 'circle-info', description: 'Generate a random fact' },
        'random-joke': { title: 'Random Joke', icon: 'face-grin-tears', description: 'Generate a random joke' },
    },
};

interface ParsedPage extends Page {
    id: string;
    descriptionParsed: string;
    toolbox: boolean;
    toolboxTitle: string | null;
    script: boolean;
    style: boolean;
    additionalScripts: (Script | undefined)[];
    additionalStyles: (Style | undefined)[];
    keywords: string[];
    category: string;
    link: string;
}

type AllPages = Record<string, Record<string, ParsedPage>>;

export const allPages = structuredClone(preParsedPages) as AllPages;

for (const [category, pages] of Object.entries(preParsedPages))
    for (const [id, page] of Object.entries(pages)) {
        allPages[category][id] = {
            ...blankProperties,
            ...page,
            descriptionParsed: page.description.replaceAll(/<(.*?) ?.*?>(.*?)<\/\1>/g, '$2'),
            id,
            category,
            link: `/${category}/${id}`,
            toolbox: page.toolbox ?? true,
        };

        if (!('script' in page)) delete pages[id].script;
        if (!('style' in page)) delete pages[id].style;
    }
