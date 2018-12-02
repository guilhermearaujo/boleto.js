/**
 * @module ITF
 */

/**
 * Representations of each decimal digit
 *
 * @default
 * @constant
 */
const WEIGHTS = [
  '11221', // 0
  '21112', // 1
  '12112', // 2
  '22111', // 3
  '11212', // 4
  '21211', // 5
  '12211', // 6
  '11122', // 7
  '21121', // 8
  '12121', // 9
];

/**
 * Representation of Start portion of the barcode
 *
 * @default
 * @constant
 */
const START = '1111';

/**
 * Representation of Stop portion of the barcode
 *
 * @default
 * @constant
 */
const STOP = '211';

/**
 * Converts a pair of digits into their ITF representation and interleave them
 *
 * @param {String} pair The pair to be interleaved
 * @return {String} The input pair encoded into its ITF representation
 *
 * @example
 * // Returns "1211212112"
 * ITF.interleavePair('01');
 */
function interleavePair(pair) {
  const black = WEIGHTS[Math.floor(pair / 10)];
  const white = WEIGHTS[pair % 10];

  let p = '';

  for (let i = 0; i < 5; i += 1) {
    p += black[i];
    p += white[i];
  }

  return p;
}

/**
 * Encodes a base-10 number into its Interleaved 2 of 5 (ITF) representation
 *
 * @param {String} number The number to be encoded
 * @return {String} The input number encoded into its ITF representation
 *
 * @example
 * // Returns "111121121111222121121112211222111112111122211121122211211"
 * ITF.encode('1234567890');
 */
function encode(number) {
  return START + number.match(/(..?)/g).map(interleavePair).join('') + STOP;
}

module.exports = { encode };
