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
export default [];
