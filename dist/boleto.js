/*!
 * boleto.js v1.0.2
 * https://github.com/guilhermearaujo/boleto.js
 *
 * Licensed MIT © Guilherme Araújo
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Boleto = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.xmlserializer = factory();
    }
}(this, function () {

    var removeInvalidCharacters = function (content) {
        // See http://www.w3.org/TR/xml/#NT-Char for valid XML 1.0 characters
        return content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
    };

    var serializeAttributeValue = function (value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    var serializeTextContent = function (content) {
        return content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    var serializeAttribute = function (attr) {
        var value = attr.value;

        return ' ' + attr.name + '="' + serializeAttributeValue(value) + '"';
    };

    var getTagName = function (node) {
        var tagName = node.tagName;

        // Aid in serializing of original HTML documents
        if (node.namespaceURI === 'http://www.w3.org/1999/xhtml') {
            tagName = tagName.toLowerCase();
        }
        return tagName;
    };

    var serializeNamespace = function (node, isRootNode) {
        var nodeHasXmlnsAttr = Array.prototype.map.call(node.attributes || node.attrs, function (attr) {
            return attr.name;
        })
                .indexOf('xmlns') >= 0;
        // Serialize the namespace as an xmlns attribute whenever the element
        // doesn't already have one and the inherited namespace does not match
        // the element's namespace.
        if (!nodeHasXmlnsAttr &&
            (isRootNode ||
             node.namespaceURI !== node.parentNode.namespaceURI)) {
            return ' xmlns="' + node.namespaceURI + '"';
        } else {
            return '';
        }
    };

    var serializeChildren = function (node) {
        return Array.prototype.map.call(node.childNodes, function (childNode) {
            return nodeTreeToXHTML(childNode);
        }).join('');
    };

    var serializeTag = function (node, isRootNode) {
        var output = '<' + getTagName(node);
        output += serializeNamespace(node, isRootNode);

        Array.prototype.forEach.call(node.attributes || node.attrs, function (attr) {
            output += serializeAttribute(attr);
        });

        if (node.childNodes.length > 0) {
            output += '>';
            output += serializeChildren(node);
            output += '</' + getTagName(node) + '>';
        } else {
            output += '/>';
        }
        return output;
    };

    var serializeText = function (node) {
        var text = node.nodeValue || node.value || '';
        return serializeTextContent(text);
    };

    var serializeComment = function (node) {
        return '<!--' +
            node.data
            .replace(/-/g, '&#45;') +
            '-->';
    };

    var serializeCDATA = function (node) {
        return '<![CDATA[' + node.nodeValue + ']]>';
    };

    var nodeTreeToXHTML = function (node, options) {
        var isRootNode = options && options.rootNode;

        if (node.nodeName === '#document' ||
            node.nodeName === '#document-fragment') {
            return serializeChildren(node);
        } else {
            if (node.tagName) {
                return serializeTag(node, isRootNode);
            } else if (node.nodeName === '#text') {
                return serializeText(node);
            } else if (node.nodeName === '#comment') {
                return serializeComment(node);
            } else if (node.nodeName === '#cdata-section') {
                return serializeCDATA(node);
            }
        }
    };

    return {
        serializeToString: function (node) {
            return removeInvalidCharacters(nodeTreeToXHTML(node, {rootNode: true}));
        }
    };
}));

},{}],2:[function(require,module,exports){
'use strict';

var _svg = require('./svg');

var _svg2 = _interopRequireDefault(_svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ITF = require('./itf');

var Boleto = function () {
  /**
   * Initializes the class
   *
   * @constructor
   * @param {String} bankSlipNumber The bank slip number
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
   *
   * The validation function ensures that the bank slip number is exactly 47
   * characters long, then applies the modulo-11 algorithm to the bank slip's
   * barcode. Finally, it verifies that the result of the algorithm equals the
   * checksum digit from the bank slip number.
   *
   * @return {Boolean} Whether the bank slip number is valid or not
   */


  Boleto.prototype.valid = function valid() {
    if (this.bankSlipNumber.length !== 47) return false;

    var barcodeDigits = this.barcode().split('');
    var checksum = barcodeDigits.splice(4, 1);

    return modulo11(barcodeDigits).toString() === checksum.toString();
  };

  /**
   * Converts the printed bank slip number into the barcode number
   *
   * The bank slip's number is a rearrangement of its barcode, plus three
   * checksum digits. This function executes the inverse process and returns the
   * original arrangement of the code. Specifications can be found at
   * https://portal.febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao
   *
   * @return {String} The barcode extracted from the bank slip number
   */


  Boleto.prototype.barcode = function barcode() {
    return this.bankSlipNumber.replace(/^(\d{4})(\d{5})\d{1}(\d{10})\d{1}(\d{10})\d{1}(\d{15})$/, '$1$5$2$3$4');
  };

  /**
   * Returns the bank slip's raw number
   *
   * @return {String} The raw bank slip number
   */


  Boleto.prototype.number = function number() {
    return this.bankSlipNumber;
  };

  /**
   * Returns the bank slip number with the usual, easy-to-read mask:
   * 00000.00000 00000.000000 00000.000000 0 00000000000000
   *
   * @return {String} The formatted bank slip number
   */


  Boleto.prototype.prettyNumber = function prettyNumber() {
    return this.bankSlipNumber.replace(/^(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})$/, '$1.$2 $3.$4 $5.$6 $7 $8');
  };

  /**
   * Returns the name of the bank that issued the bank slip
   *
   * This function is able to identify the most popular or commonly used banks
   * in Brazil, but not all of them are included here.
   *
   * A comprehensive list of all Brazilian banks and their codes can be found at
   * http://www.buscabanco.org.br/AgenciasBancos.asp
   *
   * @return {String} The bank name
   */


  Boleto.prototype.bank = function bank() {
    switch (this.barcode().substr(0, 3)) {
      case '001':
        return 'Banco do Brasil';
      case '007':
        return 'BNDES';
      case '033':
        return 'Santander';
      case '069':
        return 'Crefisa';
      case '077':
        return 'Banco Inter';
      case '102':
        return 'XP Investimentos';
      case '104':
        return 'Caixa Econômica Federal';
      case '140':
        return 'Easynvest';
      case '197':
        return 'Stone';
      case '208':
        return 'BTG Pactual';
      case '212':
        return 'Banco Original';
      case '237':
        return 'Bradesco';
      case '260':
        return 'Nu Pagamentos';
      case '341':
        return 'Itaú';
      case '389':
        return 'Banco Mercantil do Brasil';
      case '422':
        return 'Banco Safra';
      case '505':
        return 'Credit Suisse';
      case '633':
        return 'Banco Rendimento';
      case '652':
        return 'Itaú Unibanco';
      case '735':
        return 'Banco Neon';
      case '739':
        return 'Banco Cetelem';
      case '745':
        return 'Citibank';
      default:
        return 'Unknown';
    }
  };

  /**
   * Returns the currency of the bank slip
   *
   * The currency is determined by the currency code, the fourth digit of the
   * barcode. A list of values other than 9 (Brazilian Real) could not be found.
   *
   * @return {String} The currency code, symbol and decimal separator
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
   *
   * The barcode has its own checksum digit, which is the fifth digit of itself.
   *
   * @return {String} The checksum of the barcode
   */


  Boleto.prototype.checksum = function checksum() {
    return this.barcode()[4];
  };

  /**
   * Returns the date when the bank slip is due
   *
   * The portion of the barcode ranging from its sixth to its nineth digits
   * represent the number of days since the 7th of October, 1997 up to when the
   * bank slip is good to be paid. Attempting to pay a bank slip after this date
   * may incurr in extra fees.
   *
   * @return {Date} The expiration date of the bank slip
   */


  Boleto.prototype.expirationDate = function expirationDate() {
    var refDate = new Date('1997-10-07');
    var days = this.barcode().substr(5, 4);

    return new Date(refDate.getTime() + days * 86400000);
  };

  /**
   * Returns the bank slip's nominal amount
   *
   * @return {String} The bank slip's raw amount
   */


  Boleto.prototype.amount = function amount() {
    return (this.barcode().substr(9, 10) / 100.0).toFixed(2);
  };

  /**
   * Returns the bank slip's formatted nominal amount
   *
   * @return {String} The bank slip's formatted amount
   */


  Boleto.prototype.prettyAmount = function prettyAmount() {
    var currency = this.currency();

    if (currency === 'Unknown') {
      return this.amount();
    }

    return currency.symbol + ' ' + this.amount().replace('.', currency.decimal);
  };

  /**
   * Renders the bank slip as a child of the provided selector
   *
   * @param {String} selector The selector to the object where the SVG must be
   * appended
   *
   * @see {@link SVG#render}
   */


  Boleto.prototype.toSVG = function toSVG(selector) {
    var stripes = ITF.encode(this.barcode());
    return new _svg2.default(stripes).render(selector);
  };

  return Boleto;
}();

/**
 * Calculates the modulo 11 checksum digit
 *
 * The specifications of the algorithm can be found at
 * https://portal.febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao
 *
 * @params {Array|String} digits
 * @return {Integer} The modulo 11 checksum digit
 *
 * @example
 * // Returns 7
 * modulo11('123456789');
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

  return (11 - sum % 11) % 10 || 1;
}

module.exports = Boleto;

},{"./itf":3,"./svg":4}],3:[function(require,module,exports){
'use strict';

/**
 * @module ITF
 */

/**
 * Representations of each decimal digit
 *
 * @default
 * @constant
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
 * Representation of Start portion of the barcode
 *
 * @default
 * @constant
 */
var START = '1111';

/**
 * Representation of Stop portion of the barcode
 *
 * @default
 * @constant
 */
var STOP = '211';

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

},{}],4:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var xmlserializer = require('xmlserializer');

var SVG = function () {
  /**
   * Initializes the class
   *
   * @constructor
   * @param {Array} stripes The list of stripes to be drawn
   * @param {Integer} stripeWidth The width of a single-weighted stripe
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
   *
   * The structure of the SVG is a series of parallel rectangular stripes whose
   * colors alternate between black or white.
   * These stripes are placed from left to right. Their width will vary
   * depending on their weight, which can be either 1 or 2.
   *
   * @param {String} selector The selector to the object where the SVG must be
   * appended
   */


  SVG.prototype.render = function render(selector) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
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

    if (selector === undefined) {
      return xmlserializer.serializeToString(svg);
    } else {
      document.querySelector(selector).appendChild(svg);
    }
  };

  /**
   * Calculates the total width of the barcode
   *
   * The calculation method is the sum of the weight of the stripes multiplied
   * by the width of a single-wighted stripe
   *
   * @return {Integer} The width of a view box that fits the barcode
   */


  SVG.prototype.viewBoxWidth = function viewBoxWidth() {
    return this.stripes.reduce(function (a, b) {
      return a + b;
    }, 0) * this.stripeWidth;
  };

  /**
   * Returns the appropriate color for each stripe
   *
   * Odd numbers will return white, even will return black
   *
   * @param {Integer} i The index of the stripe
   * @return {String} The stripe color
   *
   * @example
   * // Returns "#ffffff"
   * svg.color(1);
   * // Returns "#000000"
   * svg.color(2);
   */


  SVG.prototype.color = function color(i) {
    return i % 2 ? '#ffffff' : '#000000';
  };

  return SVG;
}();

module.exports = SVG;

},{"xmlserializer":1}]},{},[2])(2)
});
