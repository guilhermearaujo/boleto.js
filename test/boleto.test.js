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
    it('should return correct Banco do Brasil', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('001');
      expect(bankslip.bank()).toBe('Banco do Brasil');
    });

    it('should return correct BNDES', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('007');
      expect(bankslip.bank()).toBe('BNDES');
    });

    it('should return correct Santander', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('033');
      expect(bankslip.bank()).toBe('Santander');
    });

    it('should return correct Crefisa', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('069');
      expect(bankslip.bank()).toBe('Crefisa');
    });

    it('should return correct Banco Inter', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('077');
      expect(bankslip.bank()).toBe('Banco Inter');
    });

    it('should return correct XP Investimentos', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('102');
      expect(bankslip.bank()).toBe('XP Investimentos');
    });

    it('should return correct Caixa Econômica Federal', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('104');
      expect(bankslip.bank()).toBe('Caixa Econômica Federal');
    });

    it('should return correct Easynvest', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('140');
      expect(bankslip.bank()).toBe('Easynvest');
    });

    it('should return correct Stone', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('197');
      expect(bankslip.bank()).toBe('Stone');
    });

    it('should return correct BTG Pactual', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('208');
      expect(bankslip.bank()).toBe('BTG Pactual');
    });

    it('should return correct Banco Original', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('212');
      expect(bankslip.bank()).toBe('Banco Original');
    });

    it('should return correct Bradesco', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('237');
      expect(bankslip.bank()).toBe('Bradesco');
    });

    it('should return correct Nu Pagamentos', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('260');
      expect(bankslip.bank()).toBe('Nu Pagamentos');
    });

    it('should return correct Itaú', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('341');
      expect(bankslip.bank()).toBe('Itaú');
    });

    it('should return correct Banco Mercantil do Brasil', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('389');
      expect(bankslip.bank()).toBe('Banco Mercantil do Brasil');
    });

    it('should return correct Banco Safra', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('422');
      expect(bankslip.bank()).toBe('Banco Safra');
    });

    it('should return correct Credit Suisse', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('505');
      expect(bankslip.bank()).toBe('Credit Suisse');
    });

    it('should return correct Banco Rendimento', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('633');
      expect(bankslip.bank()).toBe('Banco Rendimento');
    });

    it('should return correct Itaú Unibanco', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('652');
      expect(bankslip.bank()).toBe('Itaú Unibanco');
    });

    it('should return correct Banco Neon', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('735');
      expect(bankslip.bank()).toBe('Banco Neon');
    });

    it('should return correct Banco Cetelem', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('739');
      expect(bankslip.bank()).toBe('Banco Cetelem');
    });

    it('should return correct Citibank', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('745');
      expect(bankslip.bank()).toBe('Citibank');
    });

    it('should return correct Unknown', () => {
      const bankslip = getBankslip();
      bankslip.barcode = jest.fn().mockReturnValue('999');
      expect(bankslip.bank()).toBe('Unknown');
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
