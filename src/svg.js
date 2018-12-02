const xmlserializer = require('xmlserializer');

class SVG {
  /**
   * Initializes the class
   *
   * @constructor
   * @param {Array} stripes The list of stripes to be drawn
   * @param {Integer} stripeWidth The width of a single-weighted stripe
   */
  constructor(stripes, stripeWidth) {
    this.stripes = stripes.split('').map(a => parseInt(a, 10));
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
  render(selector) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let pos = 0;
    let width = 0;

    for (let i = 0; i < this.stripes.length; i += 1, pos += width) {
      width = this.stripeWidth * this.stripes[i];

      const shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shape.setAttribute('width', width);
      shape.setAttribute('height', 100);
      shape.setAttribute('fill', SVG.color(i));
      shape.setAttribute('x', pos);
      shape.setAttribute('y', 0);
      svg.appendChild(shape);
    }

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${this.viewBoxWidth()} 100`);

    if (selector === undefined) {
      return xmlserializer.serializeToString(svg);
    }

    document.querySelector(selector).appendChild(svg);
    return null;
  }

  /**
   * Calculates the total width of the barcode
   *
   * The calculation method is the sum of the weight of the stripes multiplied
   * by the width of a single-wighted stripe
   *
   * @return {Integer} The width of a view box that fits the barcode
   */
  viewBoxWidth() {
    return this.stripes.reduce((a, b) => a + b, 0) * this.stripeWidth;
  }

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
  static color(i) {
    return i % 2 ? '#ffffff' : '#000000';
  }
}

module.exports = SVG;
