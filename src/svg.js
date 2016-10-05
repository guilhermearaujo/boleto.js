class SVG {
  /**
   * Initializes the class
   *
   * @param {Array} stripes
   * @param {Integer} stripeWidth
   */
  constructor(stripes, stripeWidth) {
    this.stripes = stripes.split('').map(function(a) { return parseInt(a, 10); });
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
   * @param {Object} selector
   */
  render(selector) {
    var wrapper = document.querySelector(selector);
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    wrapper.appendChild(svg);

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
  }

  /**
   * Calculates the total width of the barcode
   *
   * The calculation method is the sum of the weight of the stripes multiplied
   * by the width of a single-wighted stripe
   */
  viewBoxWidth() {
    return this.stripes.reduce(function(a, b) { return a + b; }, 0) * this.stripeWidth;
  }

  /**
   * Returns the appropriate color for each stripe
   *
   * Odd numbers will return white, even will return black
   *
   * @param {Integer} i
   */
  color(i) {
    return i % 2 ? '#ffffff' : '#000000';
  }
}

module.exports = SVG;
