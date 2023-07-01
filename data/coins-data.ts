// Lists of coins: https://mycoinguides.com/listing-of-coin-guides

export interface CoinType {
    name: string;
    id: string;
    coins: CoinVariant[];
}

export interface ParsedCoinType extends CoinType {
    coins: ParsedCoinVariant[];
}

interface CoinVariant {
    name: string;
    id: string;
    note?: string;
    years?: string;
    active?: true;
    coins?: Coin[];
}

export interface ParsedCoinVariant extends CoinVariant {
    coins: Coin[];
}

export interface Coin {
    id: string;
    year: string;
    mintMark?: string;
    specification?: string;
    image?: string;
    comparison?: string;
    obtained: boolean;
    upgrade?: boolean;
}

export const coinsData: CoinType[] = [
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
