import SVG from './svg';

var ITF = require('./itf');

class Boleto {
  /**
   * Initializes the class
   * @params {String} bankSlipNumber
   */
  constructor(bankSlipNumber) {
    this.bankSlipNumber = bankSlipNumber.replace(/[^\d]/g, '');

    if (!this.valid()) {
      throw new Error('Invalid bank slip number');
    }
  }

  /**
   * Validates whether the bank slip number is valid or not
   */
  valid() {
    if (this.bankSlipNumber.length !== 47) return false;

    var barcodeDigits = this.barcode().split('');
    var checksum = barcodeDigits.splice(4, 1);

    if (modulo11(barcodeDigits) !== checksum) return false;
    return true;
  }

  /**
   * Converts the printed bank slip number into the barcode number
   */
  barcode() {
    return this.bankSlipNumber.replace(
      /^(\d{4})(\d{5})\d{1}(\d{10})\d{1}(\d{10})\d{1}(\d{15})$/,
      '$1$5$2$3$4'
    );
  }

  /**
   * Returns the bank slip's raw number
   */
  number() {
    return this.bankSlipNumber;
  }

  /**
   * Returns the bank slip number with the usual, easy-to-read mask
   */
  prettyNumber() {
    return this.bankSlipNumber.replace(
      /^(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})$/,
      '$1.$2 $3.$4 $5.$6 $7 $8'
    );
  }

  /**
   * Returns the name of the bank that issued the bank slip
   */
  bank() {
    switch (this.barcode().substr(0, 3)) {
      case '001': return 'Banco do Brasil';
      case '033': return 'Santander';
      case '104': return 'Caixa Econômica Federal';
      case '237': return 'Bradesco';
      case '341': return 'Itaú';
      case '356': return 'Banco Real';
      case '389': return 'Banco Mercantil do Brasil';
      case '399': return 'HSBC';
      case '422': return 'Banco Safra';
      case '453': return 'Banco Rural';
      case '633': return 'Banco Rendimento';
      case '652': return 'Unibanco';
      case '745': return 'Citibank';
      default:    return 'Unknown';
    }
  }

  /**
   * Returns the currency of the bank slip
   */
  currency() {
    switch (this.barcode()[3]) {
      case '9': return { code: 'BRL', symbol: 'R$', decimal: ',' };
      default:  return 'Unknown';
    }
  }

  /**
   * Returns the verification digit of the barcode
   */
  checksum() {
    return this.barcode()[4];
  }

  /**
   * Returns the date when the bank slip is due
   */
  expirationDate() {
    var refDate = new Date('1997-10-07');
    var days = this.barcode().substr(5, 4);

    return new Date(refDate.getTime() + days * 86400000);
  }

  /**
   * Returns the bank slip's nominal amount
   */
  amount() {
    return (this.barcode().substr(9, 10) / 100.0).toFixed(2);
  }

  /**
   * Returns the bank slip's formatted nominal amount
   */
  prettyAmount() {
    var currency = this.currency();

    if (currency === 'Unknown') {
      return this.amount().toFixed(2);
    }

    return currency.symbol + ' ' + this.amount().replace('.', currency.decimal);
  }

  toSVG(selector) {
    var stripes = ITF.encode(this.barcode());
    new SVG(stripes).render(selector);
  }
}

/**
 * Calculates the modulo 11 checksum digit
 * @params {Array|String} digits
 */
function modulo11(digits) {
  if (typeof digits === 'string') {
    digits = digits.split('');
  }

  digits.reverse();

  var sum = 0;

  for (var i = 0; i < digits.length; i++) {
    sum += (i % 8 + 2) * digits[i];
  }

  return (11 - (sum % 11)) % 10 || 1;
}

module.exports = Boleto;
