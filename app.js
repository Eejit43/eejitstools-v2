if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('json spaces', 2);

app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

app.use('/', require('./routes/index'));

app.get('/headers', (req, res) => {
    res.status(200).json(req.headers);
});

const imports = {
    odometerCss: 'https://github.hubspot.com/odometer/themes/odometer-theme-default.css',
    odometerJs: 'https://github.hubspot.com/odometer/odometer.js',
    mathJs: 'https://unpkg.com/mathjs/lib/browser/math.js',
};

const allPageInfo = {
    base64: {
        title: 'Base64 Encode/Decode',
        icon: 'fa-solid fa-code',
        description: 'Encode and decode to and from Base64 format (binary)',
        keywords: ['b64'],
        additionalScript: '',
        additionalStyle: '',
    },
    'base64-image': {
        title: 'Base64 Image Encode/Decode',
        icon: 'fa-solid fa-file-image',
        description: 'Encode and decode images to and from Base64 format',
        keywords: ['b64'],
        additionalScript: '',
        additionalStyle: '',
    },
    'binary-calc': {
        title: 'Binary Calculator',
        icon: 'fa-solid fa-0',
        description: 'Convert to/from binary/octal/decimal/hex',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'binary-text': {
        title: 'Binary Text Converter',
        icon: 'fa-solid fa-1',
        description: 'Convert to/from binary text',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'browser-info': {
        title: 'Browser Info',
        icon: 'fa-solid fa-laptop',
        description: 'Shows basic information about your browser and operating system',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'case-changer': {
        title: 'Case Changer',
        icon: 'fa-solid fa-font',
        description: 'Change a string to uppercase, lowercase, title case, or sentence case',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'color-converter': {
        title: 'Color Converter',
        icon: 'fa-solid fa-palette',
        description: 'Convert between Hex codes, RGB values, and HSL values, and see those colors displayed',
        keywords: ['hexadecimal'],
        additionalScript: '',
        additionalStyle: '',
    },
    countdowns: {
        title: 'Countdowns',
        icon: 'fa-regular fa-hourglass',
        description: 'Shows various countdowns until major upcoming holidays',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    counter: {
        title: 'Counter',
        icon: 'fa-solid fa-calculator',
        description: 'Press a key/button to add one to a counter',
        keywords: ['spacebar'],
        additionalScript: imports.odometerJs,
        additionalStyle: imports.odometerCss,
    },
    'currency-exchange': {
        title: 'Currency Exchange Rates',
        icon: 'fa-solid fa-coins',
        description: 'Shows information for various currency conversions',
        keywords: ['usd', 'money'],
        additionalScript: '',
        additionalStyle: '',
    },
    'ip-info': {
        title: 'IP Info',
        icon: 'fa-solid fa-wifi',
        description: 'Displays your current IP address, and IP provided information',
        keywords: ['internet', 'isp'],
        additionalScript: '',
        additionalStyle: '',
    },
    'keycode-info': {
        title: 'KeyCode Information',
        icon: 'fa-solid fa-keyboard',
        description: 'Click any keyboard key to get the key, key location, key code, char code (ASCII), and char code (Unicode)',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'length-converter': {
        title: 'Length Converter',
        icon: 'fa-solid fa-ruler',
        description: 'Convert between United States standard length measurements and imperial length units',
        keywords: [],
        additionalScript: imports.mathJs,
        additionalStyle: '',
    },
    'list-sorter': {
        title: 'List Sorter',
        icon: 'fa-solid fa-arrow-down-wide-short',
        description: 'Alphabetize, numerize, randomize, and reverse lists that can be defined with custom separators',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'morse-code-converter': {
        title: 'Morse Code Converter',
        icon: 'fa-solid fa-ellipsis',
        description: 'Convert to/from Morse code',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'quick-copy': {
        title: 'Quick Copy',
        icon: 'fa-regular fa-clipboard',
        description: 'Clipboard display, clear clipboard button, and useful characters',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'random-number': {
        title: 'Random Number Generator',
        icon: 'fa-solid fa-hashtag',
        description: 'Generate a random number between two numbers',
        keywords: [],
        additionalScript: imports.odometerJs,
        additionalStyle: imports.odometerCss,
    },
    regex: {
        title: 'Regex Tools',
        icon: 'fa-solid fa-highlighter',
        description: 'Some useful regex tools (duplicate line remover, whitespace remover), as well as a regex tester',
        keywords: ['regular expression'],
        additionalScript: '',
        additionalStyle: '',
    },
    'roman-converter': {
        title: 'Roman Numeral Converter',
        icon: 'fa-solid fa-i',
        description: 'Convert to and from roman numerals, with high level thousand supports (bars above numbers)',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'scientific-notation-converter': {
        title: 'Scientific Notation Converter',
        icon: 'fa-solid fa-e',
        description: 'Convert between scientific (e) notation and decimal form',
        keywords: [],
        additionalScript: imports.mathJs,
        additionalStyle: '',
    },
    stopwatch: {
        title: 'Stopwatch',
        icon: 'fa-solid fa-stopwatch',
        description: 'Simple stopwatch (displays down to milliseconds)',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'temperature-converter': {
        title: 'Temperature Converter',
        icon: 'fa-solid fa-thermometer-half',
        description: 'Convert between Fahrenheit, Celsius/Centigrade, and Kelvin',
        keywords: [],
        additionalScript: imports.mathJs,
        additionalStyle: '',
    },
    'tides-info': {
        title: 'Tides Info',
        icon: 'fa-solid fa-water',
        description: 'Shows current tidal information and for the next 7 days',
        keywords: ['tidal'],
        additionalScript: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.2/moment.js',
        additionalStyle: '',
    },
    time: {
        title: 'Time',
        icon: 'fa-regular fa-clock',
        description: 'Displays the current time and date (in your time zone), as well as detailed time information',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'time-converter': {
        title: 'Time Converter',
        icon: 'fa-solid fa-hourglass',
        description: 'Convert between units of time',
        keywords: [],
        additionalScript: imports.mathJs,
        additionalStyle: '',
    },
    timer: {
        title: 'Countdown Timer',
        icon: 'fa-solid fa-bell fa-shake',
        description: 'Simple countdown timer with end time display',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'unix-time-converter': {
        title: 'UNIX Time Converter',
        icon: 'fa-solid fa-calendar',
        description: 'Convert from date strings to UNIX time (in seconds or milliseconds), and back',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
    'weather-info': {
        title: 'Weather Info',
        icon: 'fa-solid fa-cloud-sun-rain',
        description: 'Shows current weather information and alerts',
        keywords: [],
        additionalScript: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.2/moment.js',
        additionalStyle: '',
    },
    'word-counter': {
        title: 'Word Counter',
        icon: 'fa-solid fa-file-word',
        description: 'Displays total characters, words, sentences, lines, and paragraphs in a piece of text',
        keywords: [],
        additionalScript: '',
        additionalStyle: '',
    },
};

fs.readdirSync('./views/pages').forEach((category) => {
    const pages = fs.readdirSync(`./views/pages/${category}`).filter((file) => file.endsWith('.ejs'));

    pages.forEach((page) => {
        page = page.replace('.ejs', '');
        const pageInfo = allPageInfo[page];
        if (!pageInfo) return console.log(`Unable to find page information: ${category}/${page}`);
        app.get(`/${category}/${page}`, (req, res) => {
            res.render(`pages/${category}/${page}.ejs`, { ...pageInfo, page });
        });
    });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: err.message, page: '', additionalScript: '', additionalStyle: '' });
});

module.exports = app;
