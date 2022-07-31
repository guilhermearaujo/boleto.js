const Boleto = require('../src/boleto');

describe('Boleto.js', () => {
  const validBankslipNumber = '34195000080123320318964221470004584410000002000';
  const invalidBankslipNumber = '34195000080123320318964221470004584410000002001';

  const getBankslip = () => new Boleto(validBankslipNumber);

  describe('#constructor()', () => {
    it('should return a valid Boleto object when a valid bankslip code is passed', () => {
      expect(getBankslip().bankSlipNumber).toBe(validBankslipNumber);
    });

    it('should throw an error when an invalid bankslip code is passed', () => {
      const fn = () => new Boleto(invalidBankslipNumber);

      expect(fn).toThrow(Error('Invalid bank slip number'));
    });
  });

  describe('#valid()', () => {
    it('should return true if a valid bankslip number is passed', () => {
      expect(getBankslip().valid()).toBe(true);
    });

    it('should return false if an invalid bankslip number is passed', () => {
      const invalidBankslip = Object.create(getBankslip());
      invalidBankslip.bankSlipNumber = '123';

      expect(invalidBankslip.valid()).toBe(false);
    });
  });

  describe('#barcode()', () => {
    it('should return correct barcode', () => {
      expect(getBankslip().barcode()).toBe('34195844100000020005000001233203186422147000');
    });
  });

  describe('#number()', () => {
    it('should return correct bankslip number', () => {
      expect(getBankslip().number()).toBe(validBankslipNumber);
    });
  });

  describe('#prettyNumber()', () => {
    it('should return correct, formatted bankslip number', () => {
      expect(getBankslip().prettyNumber()).toBe('34195.00008 01233.203189 64221.470004 5 84410000002000');
    });
  });

  describe('#bank()', () => {
    const banks = [
      { code: '001', name: 'Banco do Brasil' },
      { code: '007', name: 'BNDES' },
      { code: '033', name: 'Santander' },
      { code: '069', name: 'Crefisa' },
      { code: '077', name: 'Banco Inter' },
      { code: '102', name: 'XP Investimentos' },
      { code: '104', name: 'Caixa Econômica Federal' },
      { code: '140', name: 'Easynvest' },
      { code: '197', name: 'Stone' },
      { code: '208', name: 'BTG Pactual' },
      { code: '212', name: 'Banco Original' },
      { code: '237', name: 'Bradesco' },
      { code: '260', name: 'Nu Pagamentos' },
      { code: '341', name: 'Itaú' },
      { code: '389', name: 'Banco Mercantil do Brasil' },
      { code: '422', name: 'Banco Safra' },
      { code: '505', name: 'Credit Suisse' },
      { code: '633', name: 'Banco Rendimento' },
      { code: '652', name: 'Itaú Unibanco' },
      { code: '735', name: 'Banco Neon' },
      { code: '739', name: 'Banco Cetelem' },
      { code: '745', name: 'Citibank' },
      { code: '999', name: 'Unknown' },
    ];

    banks.forEach(({ code, name }) => {
      it(`should return ${name}`, () => {
        const bankslip = getBankslip();
        bankslip.barcode = jest.fn().mockReturnValue(code);
        expect(bankslip.bank()).toBe(name);
      });
    });
  });

  describe('#currency()', () => {
    it('should return BRL', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('xxx9');
      expect(bankslip.currency()).toEqual({ code: 'BRL', symbol: 'R$', decimal: ',' });
    });

    it('should return Unknown', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('xxx0');
      expect(bankslip.currency()).toBe('Unknown');
    });
  });

  describe('#checksum()', () => {
    it('should return correct checksum', () => {
      expect(getBankslip().checksum()).toBe('5');
    });
  });

  describe('#expirationDate()', () => {
    it('should return correct expiration date', () => {
      expect(getBankslip().expirationDate()).toEqual(new Date('2020-11-16 12:00:00 GMT-0300'));
    });
  });

  describe('#amount()', () => {
    it('should return correct amount', () => {
      expect(getBankslip().amount()).toBe('20.00');
    });
  });

  describe('#prettyAmount()', () => {
    it('should return the correct, formatted amount in BRL', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('xxx9xxxxx0000002000');
      expect(bankslip.prettyAmount()).toBe('R$ 20,00');
    });

    it('should return correct, unformatted amount', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('xxx0xxxxx0000002000');
      expect(bankslip.prettyAmount()).toBe('20.00');
    });
  });

  describe('#toSVG()', () => {
    const wrapper = {
      children: [],
      appendChild: (child) => wrapper.children.push(child),
    };

    it('should render the SVG', () => {
      document.querySelector = jest.fn().mockReturnValue(wrapper);
      expect(getBankslip().toSVG('#fake-wrapper')).toBeNull();
    });
  });
});
