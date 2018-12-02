const ITF = require('../src/itf');

describe('itf.js', () => {
  describe('#encode()', () => {
    it('should return begin with the start code', () => {
      expect(ITF.encode('11')).toMatch(/^1111/);
    });

    it('should return end with the stop code', () => {
      expect(ITF.encode('11')).toMatch(/211$/);
    });

    it('should return the correct code code', () => {
      expect(ITF.encode('11')).toBe('11112211111122211');
    });
  });
});
