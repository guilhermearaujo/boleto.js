const { modulo11 } = require('../src/helpers');

describe('modulo11', () => {
  it('11 - mod(11) is mod(10)', () => {
    expect(modulo11('42')).toBe(6);
    expect(modulo11('31415')).toBe(3);
  });

  it('11 - mod(11) is not mod(10)', () => {
    expect(modulo11('6')).toBe(1);
    expect(modulo11('37')).toBe(1);
    expect(modulo11('85')).toBe(1);
  });
});
