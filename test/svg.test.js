const SVG = require('../src/svg');

const svg = new SVG('101010');

describe('svg.js', () => {
  // Public methods
  describe('#constructor()', () => {
    it('should create a valid SVG object', () => {
      expect(svg.stripes).toEqual([1, 0, 1, 0, 1, 0]);
      expect(svg.stripeWidth).toBe(4);
    });
  });

  describe('#render("selector")', () => {
    let wrapper;
    const fakeWrapper = () => ({
      children: [],
      appendChild: child => wrapper.children.push(child),
    });

    beforeEach(() => {
      wrapper = fakeWrapper();
      spyOn(document, 'querySelector').and.returnValue(wrapper);
      svg.render('#fake-wrapper');
    });

    it('should append one SVG to the wrapper', () => {
      expect(wrapper.children.length).toBe(1);
    });

    it('should append six stripes to the SVG', () => {
      expect(wrapper.children[0].children.length).toBe(6);
    });
  });

  describe('#render()', () => {
    const string = svg.render();

    it('should append one SVG to the wrapper', () => {
      const svgString = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 12 100">',
        '<rect width="4" height="100" fill="#000000" x="0" y="0"/>',
        '<rect width="0" height="100" fill="#ffffff" x="4" y="0"/>',
        '<rect width="4" height="100" fill="#000000" x="4" y="0"/>',
        '<rect width="0" height="100" fill="#ffffff" x="8" y="0"/>',
        '<rect width="4" height="100" fill="#000000" x="8" y="0"/>',
        '<rect width="0" height="100" fill="#ffffff" x="12" y="0"/>',
        '</svg>',
      ].join('');
      expect(string).toBe(svgString);
    });
  });

  describe('#viewBoxWidth()', () => {
    it('should sum the stripes and multiply them by the stripe width', () => {
      expect(svg.viewBoxWidth()).toBe(12);
    });
  });

  describe('#color()', () => {
    it('should return, in hex, white for odd and black for even numbers', () => {
      expect(SVG.color(1)).toBe('#ffffff');
      expect(SVG.color(2)).toBe('#000000');
    });
  });
});
