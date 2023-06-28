// Lists of coins: https://mycoinguides.com/listing-of-coin-guides

/**
 * @typedef {object} CoinType
 * @property {string} name The name of the coin type
 * @property {string} id The id of the coin type (used in image filenames)
 * @property {CoinVariant[]} coins The coin variants of the type
 */

/**
 * @typedef {object} CoinVariant
 * @property {string} name The name of the coin variant
 * @property {string} id The id of the coin variant (used in image filenames)
 * @property {string} [note] A note about the coin variant
 * @property {string} years The years the coin variant was minted
 * @property {string} image The relative url to the image of the coin variant (not including file extension or coin type identifier (e.g. `pennies/`))
 * @property {Coin[]} coins The coins of the variant
 */

/**
 * @typedef {object} Coin
 * @property {string} year The year the coin was minted
 * @property {string} [mintMark] The mint mark of the coin
 * @property {string} [specification] Specifications about the coin
 * @property {string} [image] The relative url to the image of the coin (not including file extension or coin type identifier (e.g. `pennies/`))
 * @property {string} [comparison] The relative url to the image of coin type comparison (not including file extension or coin type identifier (e.g. `pennies/`))
 * @property {boolean} obtained Whether or not the coin has been obtained
 * @property {boolean} [upgrade] Whether or not the coin needs to be upgraded (is in poor condition, defaults to `false`)
 */

/** @type {CoinType[]} */
export default [
    {
        name: 'Pennies',
        id: 'pennies',
        coins: [
            { name: 'Flying Eagle Cent', note: 'Stored elsewhere', id: 'flying-eagle' },
            { name: 'Indian Head Cent', id: 'indian-head' },
            { name: 'Wheat Penny', id: 'wheat' },
            { name: 'Memorial Penny', id: 'memorial' },
            { name: 'Lincoln Bicentennial Penny', id: 'lincoln-formative' },
            { name: 'Union Shield Penny', id: 'shield', active: true }
        ]
    },
    {
        name: 'Nickels',
        id: 'nickels',
        coins: [
            { name: 'Buffalo / Indian Head Nickel', id: 'buffalo' },
            { name: 'Early Jefferson Nickel', id: 'early-jefferson' },
            { name: 'Modern Jefferson Nickel', id: 'modern-jefferson' },
            { name: 'Westward Journey (Lewis & Clark, 1805-2005) Nickel', id: 'westward-bison' },
            { name: 'Return to Monticello Nickel', id: 'return-to-monticello', active: true }
        ]
    },
    {
        name: 'Dimes',
        id: 'dimes',
        coins: [
            { name: 'Mercury / Liberty Head Dime', id: 'mercury' },
            { name: 'Silver Roosevelt Dime', id: 'silver-roosevelt' },
            { name: 'Clad Roosevelt Dime', id: 'clad-roosevelt', active: true }
        ]
    },
    {
        name: 'Quarters',
        id: 'quarters',
        coins: [
            { name: 'Silver Washington Quarter', id: 'silver-washington' },
            { name: 'Clad Washington Quarter', id: 'clad-washington' },
            { name: 'Statehood & Territory Quarters', id: 'statehood-territories' },
            { name: 'America The Beautiful Quarters', id: 'america-the-beautiful' },
            { name: 'General George Washington Crossing the Delaware', id: 'crossing-the-delaware' },
            { name: 'U.S. Women Quarters', id: 'us-women' }
        ]
    },
    {
        name: 'Half Dollars',
        id: 'half-dollars',
        coins: [{ name: 'Kennedy Half Dollar', id: 'kennedy', active: true }]
    },
    {
        name: 'Dollars',
        id: 'dollars',
        coins: [
            { name: 'Eisenhower (Ike) Dollar', id: 'eisenhower' },
            { name: 'Susan B. Anthony Dollar', id: 'susan-b-anthony', years: '1979-1981, 1999' },
            { name: 'Sacagawea Dollar', id: 'sacagawea' },
            { name: 'Native American Dollar', id: 'native-american', active: true },
            { name: 'Presidential Dollar', id: 'presidential', years: '2007-2016, 2020' },
            { name: 'American Innovation Dollar', id: 'american-innovation', note: "I'm only collecting coins minted in Philadelphia, not Denver." }
        ]
    }
];
