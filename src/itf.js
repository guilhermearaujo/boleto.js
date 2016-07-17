/**
 * Representations of each decimal digit
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
  '12121'  // 9
];

/**
 * Representations of Start and Stop portions of the barcode
 */
const START = '1111';
const STOP = '211';

/**
 * Encodes a base-10 number into its Interleaved 2 of 5 (ITF) representation
 * @param {String} number
 */
function encode(number) {
  return START + number.match(/(..?)/g).map(interleavePair).join('') + STOP;
}

/**
 * Converts a pair of digits in their ITF representation and interleave them
 * @param {String} number
 */
function interleavePair(pair) {

  var black = WEIGHTS[Math.floor(pair / 10)];
  var white = WEIGHTS[pair % 10];

  var p = '';

  for (var i = 0; i < 5; i++) {
    p += black[i];
    p += white[i];
  }

  return p;
}

module.exports = { encode };
