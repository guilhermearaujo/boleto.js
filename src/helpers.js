/**
 * Calculates the modulo 11 checksum digit
 *
 * The specifications of the algorithm can be found at
 * https://portal.febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao
 *
 * @params {Array|String} number
 * @return {Integer} The modulo 11 checksum digit
 *
 * @example
 * // Returns 7
 * modulo11('123456789');
 */
function modulo11(number) {
  let digits = number;

  if (typeof digits === 'string') {
    digits = digits.split('');
  }

  digits.reverse();

  let sum = 0;

  for (let i = 0; i < digits.length; i += 1) {
    sum += ((i % 8) + 2) * digits[i];
  }

  return (11 - (sum % 11)) % 10 || 1;
}

module.exports = { modulo11 };
