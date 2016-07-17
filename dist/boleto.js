(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Boleto = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _svg = require('./svg');

var _svg2 = _interopRequireDefault(_svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ITF = require('./itf');

var Boleto = function () {
  /**
   * Initializes the class
   * @params {String} bankSlipNumber
   */

  function Boleto(bankSlipNumber) {
    _classCallCheck(this, Boleto);

    this.bankSlipNumber = bankSlipNumber.replace(/[^\d]/g, '');

    if (!this.valid()) {
      throw new Error('Invalid bank slip number');
    }
  }

  /**
   * Validates whether the bank slip number is valid or not
   */


  Boleto.prototype.valid = function valid() {
    if (this.bankSlipNumber.length != 47) return false;

    var barcodeDigits = this.barcode().split('');
    var checksum = barcodeDigits.splice(4, 1);

    if (modulo11(barcodeDigits) != checksum) return false;
    return true;
  };

  /**
   * Converts the printed bank slip number into the barcode number
   */


  Boleto.prototype.barcode = function barcode() {
    return this.bankSlipNumber.replace(/^(\d{4})(\d{5})\d{1}(\d{10})\d{1}(\d{10})\d{1}(\d{15})$/, '$1$5$2$3$4');
  };

  /**
   * Returns the bank slip's raw number
   */


  Boleto.prototype.number = function number() {
    return this.bankSlipNumber;
  };

  /**
   * Returns the bank slip number with the usual, easy-to-read mask
   */


  Boleto.prototype.prettyNumber = function prettyNumber() {
    return this.bankSlipNumber.replace(/^(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})$/, '$1.$2 $3.$4 $5.$6 $7 $8');
  };

  /**
   * Returns the name of the bank that issued the bank slip
   */


  Boleto.prototype.bank = function bank() {
    switch (this.barcode().substr(0, 3)) {
      case '001':
        return 'Banco do Brasil';
      case '033':
        return 'Santander';
      case '104':
        return 'Caixa Econômica Federal';
      case '237':
        return 'Bradesco';
      case '341':
        return 'Itaú';
      case '356':
        return 'Banco Real';
      case '389':
        return 'Banco Mercantil do Brasil';
      case '399':
        return 'HSBC';
      case '422':
        return 'Banco Safra';
      case '453':
        return 'Banco Rural';
      case '633':
        return 'Banco Rendimento';
      case '652':
        return 'Unibanco';
      case '745':
        return 'Citibank';
      default:
        return 'Unknown';
    }
  };

  /**
   * Returns the currency of the bank slip
   */


  Boleto.prototype.currency = function currency() {
    switch (this.barcode()[3]) {
      case '9':
        return { code: 'BRL', symbol: 'R$', decimal: ',' };
      default:
        return 'Unknown';
    }
  };

  /**
   * Returns the verification digit of the barcode
   */


  Boleto.prototype.checksum = function checksum() {
    this.barcode()[4];
  };

  /**
   * Returns the date when the bank slip is due
   */


  Boleto.prototype.expirationDate = function expirationDate() {
    var refDate = new Date('1997-10-07');
    var days = this.barcode().substr(5, 4);

    return new Date(refDate.getTime() + days * 86400000);
  };

  /**
   * Returns the bank slip's nominal amount
   */


  Boleto.prototype.amount = function amount() {
    return (this.barcode().substr(9, 10) / 100.0).toFixed(2);
  };

  /**
   * Returns the bank slip's formatted nominal amount
   */


  Boleto.prototype.prettyAmount = function prettyAmount() {
    var currency = this.currency();

    if (currency == 'Unknown') {
      return this.amount().toFixed(2);
    }

    return currency.symbol + ' ' + this.amount().replace('.', currency.decimal);
  };

  Boleto.prototype.toSVG = function toSVG(element) {
    var stripes = ITF.encode(this.barcode());
    new _svg2.default(stripes).render(element);
  };

  return Boleto;
}();

/**
 * Calculates the modulo 11 checksum digit
 * @params {Array|String} digits
 */


function modulo11(digits) {
  if (typeof digits == 'string') {
    digits = digits.split('');
  }

  digits.reverse();

  var sum = 0;

  for (var i = 0; i < digits.length; i++) {
    sum += (i % 8 + 2) * digits[i];
  }

  return (11 - sum % 11) % 10 || 1;
}

module.exports = Boleto;

},{"./itf":2,"./svg":3}],2:[function(require,module,exports){
'use strict';

/**
 * Representations of each decimal digit
 */
var WEIGHTS = ['11221', // 0
'21112', // 1
'12112', // 2
'22111', // 3
'11212', // 4
'21211', // 5
'12211', // 6
'11122', // 7
'21121', // 8
'12121' // 9
];

/**
 * Representations of Start and Stop portions of the barcode
 */
var START = '1111';
var STOP = '211';

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

module.exports = { encode: encode };

},{}],3:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SVG = function () {
  /**
   * Initializes the class
   * @param {Array} stripes
   * @param {Integer} stripeWidth
   */

  function SVG(stripes, stripeWidth) {
    _classCallCheck(this, SVG);

    this.stripes = stripes.split('').map(function (a) {
      return parseInt(a, 10);
    });
    this.stripeWidth = stripeWidth || 4;
  }

  /**
   * Appends an SVG object and renders the barcode inside it
   * @param {Object} element
   */


  SVG.prototype.render = function render(element) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element.appendChild(svg);

    var pos = 0;

    for (var i = 0; i < this.stripes.length; i++, pos += width) {
      var width = this.stripeWidth * this.stripes[i];

      var shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shape.setAttribute('width', width);
      shape.setAttribute('height', 100);
      shape.setAttribute('fill', this.color(i));
      shape.setAttribute('x', pos);
      shape.setAttribute('y', 0);
      svg.appendChild(shape);
    }

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 ' + this.viewBoxWidth() + ' 100');
  };

  /**
   * Calculates the total width of the barcode
   */


  SVG.prototype.viewBoxWidth = function viewBoxWidth() {
    return this.stripes.reduce(function (a, b) {
      return a + b;
    }, 0) * this.stripeWidth;
  };

  /**
   * Returns the appropriate color for each stripe
   * @param {Integer} i
   */


  SVG.prototype.color = function color(i) {
    return i % 2 ? '#ffffff' : '#000000';
  };

  return SVG;
}();

module.exports = SVG;

},{}]},{},[1])(1)
});