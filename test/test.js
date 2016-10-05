var expect = require('chai').expect;
var rewire = require('rewire');
var sinon = require('sinon');

// Boleto.js tests

var Boleto = rewire('../src/boleto');

var validBankslipNumber = '34195000080123320318964221470004584410000002000';
var invalidBankslipNumber = '34195000080123320318964221470004584410000002001';

var bankslip = new Boleto(validBankslipNumber);

var fakeWrapper = function() {
  return {
    children: [],
    appendChild: function(child) {
      this.children.push(child);
    }
  };
};

sinon.stub(document, 'querySelector');

describe('Boleto.js', function() {

  // Public methods
  describe('#constructor()', function() {
    it('should return a valid Boleto object when a valid bankslip code is passed', function() {
      var bankslip = new Boleto(validBankslipNumber);

      expect(bankslip.bankSlipNumber).to.equal('34195000080123320318964221470004584410000002000');
    });

    it('should throw an error when an invalid bankslip code is passed', function() {
      var fn = function() { new Boleto(invalidBankslipNumber) };

      expect(fn).to.throw(Error);
      expect(fn).to.throw(/Invalid bank slip number/);
    });
  });

  describe('#valid()', function() {
    it('should return true if a valid bankslip number is passed', function() {
      expect(bankslip.valid()).to.equal(true);
    });

    it('should return false if an invalid bankslip number is passed', function() {
      var invalidBankslip = Object.create(bankslip);
      invalidBankslip.bankSlipNumber = '123';

      expect(invalidBankslip.valid()).to.equal(false);
    });
  });

  describe('#barcode()', function() {
    it('should return correct barcode', function() {
      expect(bankslip.barcode()).to.equal('34195844100000020005000001233203186422147000');
    });
  });

  describe('#number()', function() {
    it('should return correct bankslip number', function() {
      expect(bankslip.number()).to.equal('34195000080123320318964221470004584410000002000');
    });
  });

  describe('#prettyNumber()', function() {
    it('should return correct, formatted bankslip number', function() {
      expect(bankslip.prettyNumber()).to.equal('34195.00008 01233.203189 64221.470004 5 84410000002000');
    });
  });

  describe('#bank()', function() {
    var bankslip = new Boleto(validBankslipNumber);
    sinon.stub(bankslip, 'barcode');

    it('should return correct Banco do Brasil', function() {
      bankslip.barcode.withArgs().returns('001');
      expect(bankslip.bank()).to.equal('Banco do Brasil');
    });

    it('should return correct Santander', function() {
      bankslip.barcode.withArgs().returns('033');
      expect(bankslip.bank()).to.equal('Santander');
    });

    it('should return correct Caixa Econômica Federal', function() {
      bankslip.barcode.withArgs().returns('104');
      expect(bankslip.bank()).to.equal('Caixa Econômica Federal');
    });

    it('should return correct Bradesco', function() {
      bankslip.barcode.withArgs().returns('237');
      expect(bankslip.bank()).to.equal('Bradesco');
    });

    it('should return correct Itaú', function() {
      bankslip.barcode.withArgs().returns('341');
      expect(bankslip.bank()).to.equal('Itaú');
    });

    it('should return correct Banco Real', function() {
      bankslip.barcode.withArgs().returns('356');
      expect(bankslip.bank()).to.equal('Banco Real');
    });

    it('should return correct Banco Mercantil do Brasil', function() {
      bankslip.barcode.withArgs().returns('389');
      expect(bankslip.bank()).to.equal('Banco Mercantil do Brasil');
    });

    it('should return correct HSBC', function() {
      bankslip.barcode.withArgs().returns('399');
      expect(bankslip.bank()).to.equal('HSBC');
    });

    it('should return correct Banco Safra', function() {
      bankslip.barcode.withArgs().returns('422');
      expect(bankslip.bank()).to.equal('Banco Safra');
    });

    it('should return correct Banco Rural', function() {
      bankslip.barcode.withArgs().returns('453');
      expect(bankslip.bank()).to.equal('Banco Rural');
    });

    it('should return correct Banco Rendimento', function() {
      bankslip.barcode.withArgs().returns('633');
      expect(bankslip.bank()).to.equal('Banco Rendimento');
    });

    it('should return correct Unibanco', function() {
      bankslip.barcode.withArgs().returns('652');
      expect(bankslip.bank()).to.equal('Unibanco');
    });

    it('should return correct Citibank', function() {
      bankslip.barcode.withArgs().returns('745');
      expect(bankslip.bank()).to.equal('Citibank');
    });

    it('should return correct Unknown', function() {
      bankslip.barcode.withArgs().returns('999');
      expect(bankslip.bank()).to.equal('Unknown');
    });
  });

  describe('#currency()', function() {
    var bankslip = new Boleto(validBankslipNumber);
    sinon.stub(bankslip, 'barcode');

    it('should return BRL', function() {
      bankslip.barcode.withArgs().returns('xxx9');
      expect(bankslip.currency()).to.deep.equal({ code: 'BRL', symbol: 'R$', decimal: ',' });
    });

    it('should return Unknown', function() {
      bankslip.barcode.withArgs().returns('xxx0');
      expect(bankslip.currency()).to.deep.equal('Unknown');
    });
  });

  describe('#checksum()', function() {
    it('should return correct checksum', function() {
      expect(bankslip.checksum()).to.equal('5');
    });
  });

  describe('#expirationDate()', function() {
    it('should return correct expiration date', function() {
      expect(bankslip.expirationDate()).to.deep.equal(new Date('2020-11-16'));
    });
  });

  describe('#amount()', function() {
    it('should return correct amount', function() {
      expect(bankslip.amount()).to.equal('20.00');
    });
  });

  describe('#prettyAmount()', function() {
    var bankslip = new Boleto(validBankslipNumber);
    sinon.stub(bankslip, 'barcode');

    it('should return the correct, formatted amount in BRL', function() {
      bankslip.barcode.withArgs().returns('xxx9xxxxx0000002000');
      expect(bankslip.prettyAmount()).to.equal('R$ 20,00');
    });

    it('should return correct, unformatted amount', function() {
      bankslip.barcode.withArgs().returns('xxx0xxxxx0000002000');
      expect(bankslip.prettyAmount()).to.equal('20.00');
    });
  });

  describe('#toSVG()', function() {
    it('should render the SVG', function() {
      var wrapper = fakeWrapper();
      document.querySelector.withArgs('#fake-wrapper').returns(wrapper);
      expect(bankslip.toSVG('#fake-wrapper')).to.be.undefined;
    });
  });

  // Private methods
  describe('#modulo11()', function() {
    var modulo11 = Boleto.__get__('modulo11');

    it('should return the correct checksum', function() {
      expect(modulo11('09')).to.equal(4);
      expect(modulo11('18')).to.equal(3);
      expect(modulo11('27')).to.equal(2);
      expect(modulo11('36')).to.equal(1);
      expect(modulo11('45')).to.equal(1);
      expect(modulo11('99')).to.equal(1);
    });
  });
});


// ITF tests

var ITF = rewire('../src/itf');

describe('itf.js', function() {

  // Public methods
  describe('#encode()', function() {
    it('should return begin with the start code', function() {
      expect(ITF.encode('11')).to.match(/^1111/);
    });

    it('should return end with the stop code', function() {
      expect(ITF.encode('11')).to.match(/211$/);
    });

    it('should return the correct code code', function() {
      expect(ITF.encode('11')).to.equal('11112211111122211');
    });
  });

  // Private methods
  describe('#interleavePair()', function() {
    var interleavePair = ITF.__get__('interleavePair');

    it('should interleave the codes correctly', function() {
      expect(interleavePair('09')).to.equal('1112212211');
      expect(interleavePair('18')).to.equal('2211111221');
      expect(interleavePair('27')).to.equal('1121111222');
      expect(interleavePair('36')).to.equal('2122121111');
      expect(interleavePair('45')).to.equal('1211221121');
    });
  });
});

// SVG tests

var SVG = rewire('../src/svg');
var svg = new SVG('101010');

describe('svg.js', function() {

  // Public methods
  describe('#constructor()', function() {
    it('should create a valid SVG object', function() {
      expect(svg.stripes).to.deep.equal([1, 0, 1, 0, 1, 0]);
      expect(svg.stripeWidth).to.equal(4);
    });
  });

  describe('#render()', function() {
    var wrapper = fakeWrapper();
    document.querySelector.withArgs('#fake-wrapper').returns(wrapper);
    svg.render('#fake-wrapper')

    it('should append one SVG to the wrapper', function() {
      expect(wrapper.children.length).to.equal(1);
    });

    it('should append six stripes to the SVG', function() {
      expect(wrapper.children[0].children.length).to.equal(6);
    });
  });

  describe('#viewBoxWidth()', function() {
    it('should sum the stripes and multiply them by the stripe width', function() {
      expect(svg.viewBoxWidth()).to.equal(12);
    });
  });

  describe('#color()', function() {
    it('should return, in hex, white for odd and black for even numbers', function() {
      expect(svg.color(1)).to.equal('#ffffff');
      expect(svg.color(2)).to.equal('#000000');
    });
  });
});
