const Boleto = require('../src/boleto');

describe('Boleto.js', () => {
  const validBankslipNumber = '34195000080123320318964221470004584410000002000';
  const invalidBankslipNumber = '34195000080123320318964221470004584410000002001';

  const bankslip = new Boleto(validBankslipNumber);

  describe('#constructor()', () => {
    it('should return a valid Boleto object when a valid bankslip code is passed', () => {
      expect(bankslip.bankSlipNumber).toBe(validBankslipNumber);
    });

    it('should throw an error when an invalid bankslip code is passed', () => {
      const fn = () => new Boleto(invalidBankslipNumber);

      expect(fn).toThrow(Error('Invalid bank slip number'));
    });
  });

  describe('#valid()', () => {
    it('should return true if a valid bankslip number is passed', () => {
      expect(bankslip.valid()).toBe(true);
    });

    it('should return false if an invalid bankslip number is passed', () => {
      const invalidBankslip = Object.create(bankslip);
      invalidBankslip.bankSlipNumber = '123';

      expect(invalidBankslip.valid()).toBe(false);
    });
  });

  describe('#barcode()', () => {
    it('should return correct barcode', () => {
      expect(bankslip.barcode()).toBe('34195844100000020005000001233203186422147000');
    });
  });

  describe('#number()', () => {
    it('should return correct bankslip number', () => {
      expect(bankslip.number()).toBe(validBankslipNumber);
    });
  });

  describe('#prettyNumber()', () => {
    it('should return correct, formatted bankslip number', () => {
      expect(bankslip.prettyNumber()).toBe('34195.00008 01233.203189 64221.470004 5 84410000002000');
    });
  });

  describe('#bank()', () => {
    it('should return correct Banco do Brasil', () => {
      spyOn(bankslip, 'barcode').and.returnValue('001');
      expect(bankslip.bank()).toBe('Banco do Brasil');
    });

    it('should return correct BNDES', () => {
      spyOn(bankslip, 'barcode').and.returnValue('007');
      expect(bankslip.bank()).toBe('BNDES');
    });

    it('should return correct Santander', () => {
      spyOn(bankslip, 'barcode').and.returnValue('033');
      expect(bankslip.bank()).toBe('Santander');
    });

    it('should return correct Crefisa', () => {
      spyOn(bankslip, 'barcode').and.returnValue('069');
      expect(bankslip.bank()).toBe('Crefisa');
    });

    it('should return correct Banco Inter', () => {
      spyOn(bankslip, 'barcode').and.returnValue('077');
      expect(bankslip.bank()).toBe('Banco Inter');
    });

    it('should return correct XP Investimentos', () => {
      spyOn(bankslip, 'barcode').and.returnValue('102');
      expect(bankslip.bank()).toBe('XP Investimentos');
    });

    it('should return correct Caixa Econômica Federal', () => {
      spyOn(bankslip, 'barcode').and.returnValue('104');
      expect(bankslip.bank()).toBe('Caixa Econômica Federal');
    });

    it('should return correct Easynvest', () => {
      spyOn(bankslip, 'barcode').and.returnValue('140');
      expect(bankslip.bank()).toBe('Easynvest');
    });

    it('should return correct Stone', () => {
      spyOn(bankslip, 'barcode').and.returnValue('197');
      expect(bankslip.bank()).toBe('Stone');
    });

    it('should return correct BTG Pactual', () => {
      spyOn(bankslip, 'barcode').and.returnValue('208');
      expect(bankslip.bank()).toBe('BTG Pactual');
    });

    it('should return correct Banco Original', () => {
      spyOn(bankslip, 'barcode').and.returnValue('212');
      expect(bankslip.bank()).toBe('Banco Original');
    });

    it('should return correct Bradesco', () => {
      spyOn(bankslip, 'barcode').and.returnValue('237');
      expect(bankslip.bank()).toBe('Bradesco');
    });

    it('should return correct Nu Pagamentos', () => {
      spyOn(bankslip, 'barcode').and.returnValue('260');
      expect(bankslip.bank()).toBe('Nu Pagamentos');
    });

    it('should return correct Itaú', () => {
      spyOn(bankslip, 'barcode').and.returnValue('341');
      expect(bankslip.bank()).toBe('Itaú');
    });

    it('should return correct Banco Mercantil do Brasil', () => {
      spyOn(bankslip, 'barcode').and.returnValue('389');
      expect(bankslip.bank()).toBe('Banco Mercantil do Brasil');
    });

    it('should return correct Banco Safra', () => {
      spyOn(bankslip, 'barcode').and.returnValue('422');
      expect(bankslip.bank()).toBe('Banco Safra');
    });

    it('should return correct Credit Suisse', () => {
      spyOn(bankslip, 'barcode').and.returnValue('505');
      expect(bankslip.bank()).toBe('Credit Suisse');
    });

    it('should return correct Banco Rendimento', () => {
      spyOn(bankslip, 'barcode').and.returnValue('633');
      expect(bankslip.bank()).toBe('Banco Rendimento');
    });

    it('should return correct Itaú Unibanco', () => {
      spyOn(bankslip, 'barcode').and.returnValue('652');
      expect(bankslip.bank()).toBe('Itaú Unibanco');
    });

    it('should return correct Banco Neon', () => {
      spyOn(bankslip, 'barcode').and.returnValue('735');
      expect(bankslip.bank()).toBe('Banco Neon');
    });

    it('should return correct Banco Cetelem', () => {
      spyOn(bankslip, 'barcode').and.returnValue('739');
      expect(bankslip.bank()).toBe('Banco Cetelem');
    });

    it('should return correct Citibank', () => {
      spyOn(bankslip, 'barcode').and.returnValue('745');
      expect(bankslip.bank()).toBe('Citibank');
    });

    it('should return correct Unknown', () => {
      spyOn(bankslip, 'barcode').and.returnValue('999');
      expect(bankslip.bank()).toBe('Unknown');
    });
  });

  describe('#currency()', () => {
    it('should return BRL', () => {
      spyOn(bankslip, 'barcode').and.returnValue('xxx9');
      expect(bankslip.currency()).toEqual({ code: 'BRL', symbol: 'R$', decimal: ',' });
    });

    it('should return Unknown', () => {
      spyOn(bankslip, 'barcode').and.returnValue('xxx0');
      expect(bankslip.currency()).toBe('Unknown');
    });
  });

  describe('#checksum()', () => {
    it('should return correct checksum', () => {
      expect(bankslip.checksum()).toBe('5');
    });
  });

  describe('#expirationDate()', () => {
    it('should return correct expiration date', () => {
      expect(bankslip.expirationDate()).toEqual(new Date('2020-11-16 12:00:00 GMT-0300'));
    });
  });

  describe('#amount()', () => {
    it('should return correct amount', () => {
      expect(bankslip.amount()).toBe('20.00');
    });
  });

  describe('#prettyAmount()', () => {
    it('should return the correct, formatted amount in BRL', () => {
      spyOn(bankslip, 'barcode').and.returnValue('xxx9xxxxx0000002000');
      expect(bankslip.prettyAmount()).toBe('R$ 20,00');
    });

    it('should return correct, unformatted amount', () => {
      spyOn(bankslip, 'barcode').and.returnValue('xxx0xxxxx0000002000');
      expect(bankslip.prettyAmount()).toBe('20.00');
    });
  });

  describe('#toSVG()', () => {
    const wrapper = {
      children: [],
      appendChild: (child) => wrapper.children.push(child),
    };

    it('should render the SVG', () => {
      spyOn(document, 'querySelector').and.returnValue(wrapper);
      expect(bankslip.toSVG('#fake-wrapper')).toBeNull();
    });
  });
});
