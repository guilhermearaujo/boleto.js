const path = require('path');

module.exports = {
  entry: './src/boleto.js',
  mode: 'production',
  output: {
    filename: 'boleto.min.js',
    path: path.resolve(__dirname, 'lib')
  },
};
